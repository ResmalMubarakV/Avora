const mongoose = require("mongoose");
const Memory = require("../models/Memory");
const cloudinary = require("../config/cloudinary");

const createMemory = async (req , res) => {
   try {
     const {
        title,
        description,
        location,
        startDate,
        endDate,
        modeOfTravel,
        coverImage,
        coverImagePublicId,
        images,
    } = req.body;

    if( !title || 
        !description || 
        !location || 
        !startDate || 
        !endDate || 
        !modeOfTravel || 
        !coverImage || 
        !coverImagePublicId ) {
        return res.status(400).json({message : "Please fill all the required fields"});
    }

    const memory = await Memory.create({
        title,
        description,
        location,
        startDate,
        endDate,
        modeOfTravel,
        coverImage,
        coverImagePublicId,
        images,
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
        
        const memory = await Memory.findById(id);

        if(!memory) {
            return res.status(404).json({message : "Memory not Found"});
        }
        if(memory.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({message : "Not Authorized"});
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

       const memory = await Memory.findById(id);

        if(!memory) {
            return res.status(404).json({
                message : "Memory not found"
            });
        } 

        if(memory.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message : "You are not authorized to update this memory"
            });
        }
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json
            ({message : "Please provide data to update"});
        }

        if(req.body.coverImagePublicId){
            await cloudinary.uploader.destroy(memory.coverImagePublicId);
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

        const memory = await Memory.findById(id);

        if(!memory) {
            return res.status(404).json({message : "Memory not found"});
        }
        if(memory.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({message : "You are not authorized to delete this memory"});
        }
        await cloudinary.uploader.destroy(memory.coverImagePublicId);

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