const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true,
        },
        description : {
            type : String,
            required : true,
            trim : true,
        },
        location : {
            type : String,
            required : true,
            trim : true,
        },
        startDate : {
            type : Date,
            required : true,
        },
        endDate : {
            type : Date,
            required : true,
        },
        modeOfTravel : {
            type : String,
            required : true,
        },
        coverImage : {
            type : String,
            required : true,
        },
        coverImagePublicId : {
            type : String,
            required : true,
        },
        isPublic : {
            type : Boolean,
            default : false
        },
        slug : {
            type : String,
            required : true,
            trim : true,
            lowercase : true
        },
        media : {
            type : [ 
                {
                    url : {
                    type : String,
                    required : true
                },
                publicId : {
                    type : String,
                    required : true
                },
                type : {
                    type : String,
                    enum : ["image" , "video"],
                    required : true
                }
                }
            ],
            default : [],
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User",
        },
    },
    {
        timestamps :true ,
    }
)

module.exports = mongoose.model("Memory" , memorySchema);
