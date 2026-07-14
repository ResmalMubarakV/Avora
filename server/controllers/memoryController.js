const mongoose = require("mongoose");
const Memory = require("../models/Memory");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
};

const createMemory = async (req , res) => {
    
    // Store every uploaded Cloudinary file
    const uploadedPublicIds = [];

   try {


     const {
        title,
        description,
        location,
        startDate,
        endDate,
        modeOfTravel,
        isPublic,
    } = req.body;

    
    if( !title || 
        !description || 
        !location || 
        !startDate || 
        !endDate || 
        !modeOfTravel 
      ) {
            return res.status(400).json({message : "Please fill all the required fields"});
        }

    if(!req.files|| !req.files.coverImage || req.files.coverImage.length === 0){
        return res.status(400).json({
            message : "Cover Image Is Required"
        });
    }

    const coverImageFile = req.files.coverImage[0];
    const mediaFiles = req.files.media || [];
    const uploadedMedia = [];

    let coverUpload;

        try {

            coverUpload = await cloudinary.uploader.upload(
                coverImageFile.path,
                {
                    folder: "avora/covers",
                    resource_type: "image",
                }
            );

        } finally {

            await fs.promises.unlink(coverImageFile.path).catch(() => {});

        }

    // Save for rollback
        uploadedPublicIds.push({
            publicId: coverUpload.public_id,
            type: "image",
        });


    for (const file of mediaFiles) {

        let upload;

        try {

            upload = await cloudinary.uploader.upload(file.path, {
                resource_type: "auto",
                folder: "avora/media",
            });

        } finally {

            await fs.promises.unlink(file.path).catch(() => {});

        }

        const type = file.mimetype.startsWith("image/")
            ? "image"
            : "video";

        uploadedPublicIds.push({
            publicId: upload.public_id,
            type,
        });

        uploadedMedia.push({
            url: upload.secure_url,
            publicId: upload.public_id,
            type,
        });

    }
        
    const slug = generateSlug(title);

    let finalSlug = slug;
    let counter = 2;

    while (
        await Memory.findOne({
            user : req.user._id,
            slug : finalSlug
        })
    ) {
        finalSlug = `${slug}-${counter}`;
        counter++;
    }

    const memory = await Memory.create({
        title,
        description,
        location,
        startDate,
        endDate,
        modeOfTravel,
        coverImage : coverUpload.secure_url,
        coverImagePublicId : coverUpload.public_id,
        isPublic,
        media : uploadedMedia,
        slug: finalSlug,
        user : req.user._id
    })
    return res.status(201).json(memory);
   } catch (error) {
    // Rollback Cloudinary uploads
        for (const file of uploadedPublicIds) {

            try {

                await cloudinary.uploader.destroy(file.publicId, {
                    resource_type: file.type,
                });

            } catch (cleanupError) {

                console.error(
                    "Cloudinary Rollback Error:",
                    cleanupError.message
                );

            }

        }

        console.error("Create Memory Error:", error.message);

        return res.status(500).json({
            message: "Server Error"
        });

    }
}

const getMemories = async (req, res) => {
    try {
       const memories = await Memory.find({user : req.user._id}).sort({createdAt : -1});
       return res.status(200).json(memories);
    } catch (error) {
        console.error("Get Memories Error" , error.message);
        return res.status(500).json({message : "Server Error"});
    }
}

const getMemoryById = async (req, res) => {
    try {
        const {id} = req.params;
        
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Memory ID"
            });
        }
        
        const memory = await Memory.findOne({
            _id: id,
            user: req.user._id,
        });

        if(!memory) {
            return res.status(404).json({
                message : "Memory not found"
            });
        } 
            return res.status(200).json(memory);
    } catch (error) {
        console.error("Get Memory By Id Error", error.message);
        return res.status(500).json({message : "Server Error"});
    }
}

const updateMemory = async (req, res) => {
    const uploadedPublicIds = [];

    try {
       const {id} = req.params;

       if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Memory ID"
            });
        }

       const memory = await Memory.findOne({
            _id: id,
            user: req.user._id,
        });

        if(!memory) {
            return res.status(404).json({
                message : "Memory not found"
            });
        } 

        if(Object.keys(req.body).length === 0 &&
                        !req.files?.coverImage &&
                        !req.files?.media) {
            return res.status(400).json
            ({message : "Please provide data to update"});
        }

        let oldCoverPublicId = null;

        // Update Cover Image
        if(req.files?.coverImage?.length > 0){
            const coverImageFile = req.files.coverImage[0];

                let coverUpload;

                try {

                    coverUpload = await cloudinary.uploader.upload(
                        coverImageFile.path,
                        {
                            folder: "avora/covers",
                            resource_type: "image",
                        }
                    );

                } finally {

                    await fs.promises.unlink(coverImageFile.path).catch(() => {});

                }

            // Save for rollback
            uploadedPublicIds.push({
                publicId: coverUpload.public_id,
                type: "image",
            });


            oldCoverPublicId = memory.coverImagePublicId;

            memory.coverImage = coverUpload.secure_url;
            memory.coverImagePublicId = coverUpload.public_id;
        }


        // Append Gallery Media

        if(req.files?.media?.length > 0){
            
            const uploadedMedia = [];

            for (const file of req.files.media) {

                    let upload;

                    try {

                        upload = await cloudinary.uploader.upload(file.path, {
                            resource_type: "auto",
                            folder: "avora/media",
                        });

                    } finally {

                        await fs.promises.unlink(file.path).catch(() => {});

                    }

                    const type = file.mimetype.startsWith("image/")
                        ? "image"
                        : "video";

                    uploadedPublicIds.push({
                        publicId: upload.public_id,
                        type,
                    });

                    uploadedMedia.push({
                        url: upload.secure_url,
                        publicId: upload.public_id,
                        type,
                    });

                }
            memory.media.push(...uploadedMedia);
            
        }
        

        // Update Slug if Title Changes
        if (req.body.title) {
            const baseSlug = generateSlug(req.body.title);
            let finalSlug = baseSlug;
            let counter = 2;

            while (
                await Memory.findOne({
                    user: req.user._id,
                    slug: finalSlug,
                    _id: { $ne: id }
                })
            ) {
                finalSlug = `${baseSlug}-${counter}`;
                counter++;
            }

            memory.slug = finalSlug;
        }

        // Update Other Fields
        memory.title = req.body.title || memory.title;
        memory.description = req.body.description || memory.description;
        memory.location = req.body.location || memory.location;
        memory.startDate = req.body.startDate || memory.startDate;
        memory.endDate = req.body.endDate || memory.endDate;
        memory.modeOfTravel = req.body.modeOfTravel || memory.modeOfTravel;
        memory.isPublic = req.body.isPublic ?? memory.isPublic;
        
        await memory.save();

        if (oldCoverPublicId) {
            try {
                await cloudinary.uploader.destroy(oldCoverPublicId);
            } catch (err) {
                console.error("Cover Cleanup Error:", err.message);
            }
        }

        return res.status(200).json(memory);
    
    } catch (error) {

            for (const file of uploadedPublicIds) {

                try {

                    await cloudinary.uploader.destroy(file.publicId, {
                        resource_type: file.type,
                    });

                } catch (cleanupError) {

                    console.error(
                        "Cloudinary Rollback Error:",
                        cleanupError.message
                    );

                }

            }

            console.error("Update Memory Error", error.message);

            return res.status(500).json({
                message: "Server Error"
            });

        }
}


const deleteMemory = async (req, res) => {
    try {
        const {id} = req.params;
        

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Memory ID"
            });
        }

        const memory = await Memory.findOne({
            _id: id,
            user: req.user._id,
        });

        if(!memory) {
            return res.status(404).json({
                message : "Memory not found"
            });
        } 
        
        try {
                await cloudinary.uploader.destroy(memory.coverImagePublicId);
            } catch (err) {
                console.error("Cover Cleanup Error:", err.message);
            }

            for (const item of memory.media || []) {
                try {
                    await cloudinary.uploader.destroy(item.publicId, {
                        resource_type:
                            item.type === "video" ? "video" : "image",
                    });
                } catch (err) {
                    console.error(`Media Cleanup Error (${item.publicId}):`, err.message);
                }
            }

        await memory.deleteOne();

        return res.status(200).json({message : "Memory deleted successfully"}); 
    } catch (error) {
        console.error("Delete Memory Error", error.message);
        return res.status(500).json({message : "Server Error"});
    }
}

const deleteMedia = async (req, res) => {
    try {
        const {id} = req.params;
        const {mediaPublicId} = req.body;

        // validate Memory
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message : "Invalid Memory Id"
            })
        }


        // validate public Id
        if(!mediaPublicId){
            return res.status(400).json({
                message : "Media PublicId is Required"
            })
        }

        // find memory
        const memory = await Memory.findOne({
            _id : id,
            user : req.user._id,

        })

        // validate memory
        if(!memory) {
            return res.status(404).json({
                message : "Memory not found"
            })
        }

        // find media item
        const media = memory.media.find((item) => item.publicId === mediaPublicId )

        if(!media){
            return res.status(404).json({
                message : "Media Not Found"
            })
        }

        //Delete from cloudinary
        try {

            await cloudinary.uploader.destroy(mediaPublicId, {
                resource_type:
                    media.type === "video" ? "video" : "image",
            });

        } catch (error) {

            console.error("Cloudinary delete error", error.message);

            return res.status(500).json({
                message: "Failed to delete media from Cloudinary",
            });

        }

        memory.media = memory.media.filter(
            (item) => item.publicId !== mediaPublicId
        );

        await memory.save();

        // send response
        return res.status(200).json({
            message : "Media deleted successfully", memory
        })

    } catch (error) {
        console.error("Delete media error", error.message)
            return res.status(500).json({
                message : "Server Error"
            })
    }
}


module.exports = {
    createMemory,
    getMemories,
    getMemoryById,
    updateMemory,
    deleteMemory,
    deleteMedia
};