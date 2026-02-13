const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const { cloudinaryUploadImage, cloudinaryDeleteImage, cloudinaryRemoveMultipleImages } = require("../utils/cloudinary");
const fs = require("fs");
const { Post } = require("../models/Post");
const Comment = require("../models/Comment");


/**
 * @description get all User profile
 * @route /api/users/profiles
 * @method get
 * @access private (only admin)
 */
const getAllUsers = asyncHandler(async(req, res) => {
    if(!req.user.isAdmin){
        return res.status(403).json({message : "not allowed only admin"});
    }
    const users = await User.find().select("-password").populate("posts");
    res.status(200).json(users);
})

/**
 * @description get User profile
 * @route /api/users/profile/:id
 * @method get
 * @access public 
 */
const getUser = asyncHandler(async(req, res) => {
    
    const user = await User.findById(req.params.id).select("-password").populate("posts");

    if(!user){
        return res.status(404).json({message : "user not found"})
    }

    res.status(200).json(user);
})

/**
 * @description Update User profile
 * @route /api/users/profile/:id
 * @method put
 * @access private (only user himself) 
 */
const updateUser = asyncHandler(async(req, res) => {
    const {error} = validateUpdateUser(req.body);
    if(error){
        return res.status(404).json({message : error.details[0].message})
    }

    const user = await User.findById(req.params.id).select("-password");

    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }

    const updateUser = await User.findByIdAndUpdate(req.body.id, {
        $set : {
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio
        }
    },{new: true}).select("-password");

    res.status(200).json(updateUser);
})

/**
 * @description get User count
 * @route /api/users/count
 * @method getdata
 * @access private (only admin)
 */
const getUsersCount = asyncHandler(async (req, res) => {
    const count = await User.countDocuments();
    res.status(200).json({ count });
});

/**
 * @description  profile photo upload
 * @route /api/users/profiles/profile-photo-upload
 * @method post
 * @access private (only admin)
 */ 
const profilePhotoUpload = asyncHandler(async(req, res) => {
    //validatiion
    if(req.file){
        return res.status(400).json({message : "not file"})
    }
    //get the path 
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    
    //upload to cloudinary
    const result = await cloudinaryUploadImage(imagePath);

    //get user from db
    const user = await User.findById(req.user.id);

    //delete the old profile photo if exist
    if(user.profilePhoto.publicId !== null){
        await cloudinaryDeleteImage(user.profilePhoto.publicId)
    }

    //change the profilePhoto filed in the db
    user.profilePhoto = {
        url : result.secure_url,
        publicId : result.public_id,
    }
    await user.save();

    //res to the clients
    res.status(200).json({message : "Your profile photo upload sucessfuly", profilePhoto : {url : result.secure_url, publicId : result.public_id}})

    //Remove image from the server
    fs.unlinkSync(path.join(imagePath));
})


/**
 * @description  profile photo delete(account)
 * @route /api/users/profiles/:id
 * @method post
 * @access private (only admin or user)
 */ 
const profilePhotodelete = asyncHandler(async(req, res) => {

    //get the user from db
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({ message : "user not found"})
    }

    //get all posts from db
    const posts = await Post.find({user : req.params.id});

    //get then public ids from the psot
    const imagePublicIds = posts.map(post => post.image.publicId);

    //delete all posts img from cloudinary 
    await cloudinaryRemoveMultipleImages(imagePublicIds);

    //delete the profile pict from cloudinary
    await cloudinaryDeleteImage(user.profilePhoto.publicId)

    //delete user post and comments
    await Post.deleteMany({user : req.params.id})
    await Comment.deleteMany({user : req.params.id})

    //delete user himself
    await User.findByIdAndDelete(req.params.id);

    //res to the clients
    res.status(200).json({message : "Your profile photo has been deleted"})

   
})













module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    getUsersCount,
    profilePhotoUpload,
    profilePhotodelete
    
}