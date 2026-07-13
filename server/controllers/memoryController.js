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

    const coverUpload = await cloudinary.uploader.upload(
        coverImageFile.path ,{
            folder : "avora/covers",
            resource_type : "image"
        } 
    );
    try {
          await fs.promises.unlink(coverImageFile.path);
        } catch (error) {
            console.error("Cover Cleanup Error:", error.message);
        }

    for (const file of mediaFiles) {
        try {
            const upload = await cloudinary.uploader.upload(file.path, {
                resource_type: "auto",
                folder: "avora/media",
            });

            uploadedMedia.push({
                url: upload.secure_url,
                publicId: upload.public_id,
                type: file.mimetype.startsWith("image/")
                    ? "image"
                    : "video",
            });
        } finally {
            await fs.promises.unlink(file.path).catch(() => {});
        }
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
    console.error("Create Memory Error" , error.message);
    return res.status(500).json({message : "Server Error"});
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

        if(Object.keys(req.body).length === 0) {
            return res.status(400).json
            ({message : "Please provide data to update"});
        }

        if(req.body.coverImagePublicId){
            await cloudinary.uploader.destroy(memory.coverImagePublicId);
        }

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

            req.body.slug = finalSlug;
        }

        const updatedMemory = await Memory.findByIdAndUpdate
        (id , req.body , 
            {new: true,
            runValidators: true,

            });
        return res.status(200).json(updatedMemory);
    } catch (error) {
        console.error("Update Memory Error", error.message);
        return res.status(500).json({message : "Server Error"}); 
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


module.exports = {
    createMemory,
    getMemories,
    getMemoryById,
    updateMemory,
    deleteMemory
};