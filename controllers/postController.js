const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const path = require("path");
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require("../utils/cloudinary");
const fs = require("fs");
const { validateCreatePost, Post, validateUpdatePost } = require("../models/Post");




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

/** 
 * @description get all posts
 * @route /api/posts
 * @method get
 * @access private (only logged in  user)
 */
const getAllPost = asyncHandler(async(req, res) => {

    const Post_per_page = 3;
    const {pagenumber, category}= req.query;
    let posts;
    
    if(pagenumber){
        posts = await Post.find().skip((pagenumber - 1) * Post_per_page)
        .limit(Post_per_page).sort({createdAt : -1})
        .populate("user",["-passsword"]);
    }else if(category){
        posts = await Post.find({category}).sort({createdAt : -1})
        .populate("user",["-passsword"]);
    }else{
        posts = await Post.find().sort({createdAt : -1})
        .populate("user",["-passsword"]);
    }

    res.status(200).json({posts})
})

/** 
 * @description get byid post
 * @route /api/posts/:id
 * @method get
 * @access private (only logged in  user)
 */
const getSinglePost = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.id).populate("user",["-passsword"]);

    if(!post){
        return res.status(404).json({ message : "post not found"})
    }
    
    res.status(200).json({post})
})

/** 
 * @description get post count
 * @route /api/posts/count
 * @method get
 * @access private (only logged in  user)
 */
const getCountPost = asyncHandler(async(req, res) => {
    const count = await Post.count();
    
    res.status(200).json({count})
})

/** 
 * @description delete post
 * @route /api/posts/:id
 * @method delete
 * @access private (only logged in  user)
 */
const getDeletePost = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.id);

    if(!post){
        return res.status(404).json({ message : "post not found"})
    }

    if(req.user.id || req.user.isAdmin === post.user.toString()){
        await Post.findByIdAndDelete(req.params.id);
        await cloudinaryDeleteImage(post.image.publicId);
        //TODO delete all comments from the post
        return res.status(200).json({message : "post deleted successfully"})
    }else{
        return res.status(403).json({message : "not allowed only admin or post owner"})
    }
    
})

/**
 * @description update  post
 * @route /api/posts/:id
 * @method put
 * @access private (only logged in  user)
 */
const updatePost = asyncHandler(async(req, res) => {

    //validation for data
    const {error} = validateUpdatePost(req.body);
    if(error){
        return res.status(400).json({ message : error.details[0].message})
    }
    
    //get post from DB
    const post = await Post.findById(req.params.id);
    
    if(!post){
        return res.status(404).json({ message : "post not found"})
    }

    //check if the user is the post owner 
    if(req.user.id !== post.user.toString()){
        return res.status(403).json({message : "not allowed only post owner"})
    }

    //update post
    const updatePost = await Post.findByIdAndUpdate(req.params.id, {
        $set : {
            title : req.body.title,
            description : req.body.description,
            category : req.body.category
        }
    },{new: true})

    res.status(200).json({updatePost})


})

/**
 * @description update  post image
 * @route /api/posts/:id
 * @method put
 * @access private (only logged in  user)
 */
const updateImagePost = asyncHandler(async(req, res) => {

    //validation for data
    if(req){
        return res.status(400).json({ message : "file not found "})
    }
    
    //get post from DB
    const post = await Post.findById(req.params.id);
    
    if(!post){
        return res.status(404).json({ message : "post not found"})
    }

    //check if the user is the post owner 
    if(req.user.id !== post.user.toString()){
        return res.status(403).json({message : "not allowed only post owner"})
    }

    //update post image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(imagePath);
    await cloudinaryDeleteImage(post.image.publicId);

    const updatePost = await Post.findByIdAndUpdate(req.params.id, {
        $set : {
            image : {
                url : result.secure_url,
                publicId : result.public_id
            }
        }
    },{new: true});

    //remove img from the server
    fs.unlinkSync(imagePath);

    res.status(200).json({updatePost})

})

/**
 * @description  Toggle like post
 * @route /api/posts/like/:id
 * @method put
 * @access private (only logged in  user)
 */
const toggleLike = asyncHandler(async(req, res) => {
    const loggedInUserId = req.user.id;
    const {id : postId} = req.params;

    let post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({ message : "post not found"})
    }
    
    //check if the user already liked the post
    const isliked = post.likes.find((user) => user.toString() === loggedInUserId);

    if(isliked){
        post = await Post.findByIdAndUpdate(postId, {
            $pull : {likes : loggedInUserId}
        },{new : true})
    }else{
        post = await Post.findByIdAndUpdate(postId, {
            $push : {likes : loggedInUserId}
        },{new : true})
    }

    res.status(200).json({post})
})











module.exports = {
    createPost,
    getAllPost,
    getSinglePost,
    getCountPost,
    getDeletePost,
    updatePost,
    updateImagePost,
    toggleLike
}