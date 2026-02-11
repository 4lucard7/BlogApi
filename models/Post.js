const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");




//User Schema
const PostSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
        min : 2,
        max : 200
    },
    description : {
        type : String,
        required : true,
        trim : true,
        min : 2,
        max : 200
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    category : {
        type : String,
        required : true,
        
    },
    image : {
        type : Object,
        default : {
            url : "",
            publicId : null,
        }
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
}, {timeseries : true})

//validation create USer
function validateCreatePost(obj) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(100).required(),
        description: Joi.string().min(8).required(),
        category: Joi.string().trim().required(),
    });

    return schema.validate(obj);
}

//validation Update Post
function validateUpdatePost(obj) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(100),
        description: Joi.string().min(8).trim(),
        category: Joi.string().trim()
    });

    return schema.validate(obj);
}




const Post = mongoose.model("Post", PostSchema);

module.exports = {
    Post,
    validateCreatePost,
    validateUpdatePost
}