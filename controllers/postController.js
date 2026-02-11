const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const path = require("path");
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require("../utils/cloudinary");
const fs = require("fs");
const { validateCreatePost, Post } = require("../models/Post");




/**
 * @description create new post
 * @route /api/posts
 * @method post
 * @access private (only logged in  user)
 */
const createPost = asyncHandler(async(req, res) => {

    //validation for image
    if (!req.file){
        return res.status(400).json({ message : "file not found "})
    }

    //validation for data
    const {error} = validateCreatePost(req.body);
    if(error){
        return res.status(400).json({ message : error.details[0].message})
    }
    
    //upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(imagePath);

    //create new post and save it to DB
    const post = await Post.create({
        title : req.body.title,
        description : req.body.description,
        category : req.body.category,
        user : req.user.id,
        image : {
            url : result.secure_url,
            publicId : result.public_id
        }
    })

    //send res to the client
    res.status(201).json({ post})

    //remove img from the server
    fs.unlinkSync(imagePath);
})









module.exports = {
    createPost,
}