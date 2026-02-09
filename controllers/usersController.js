const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcrypt");




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
    const users = await User.find().select("-password");
    res.status(200).json(users);
})

/**
 * @description get User profile
 * @route /api/users/profile/:id
 * @method get
 * @access public 
 */
const getUser = asyncHandler(async(req, res) => {
    
    const user = await User.findById(req.params.id).select("-password");

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
 * @method get
 * @access private (only admin)
 */
const getUsersCount = asyncHandler(async (req, res) => {
    const count = await User.countDocuments();
    res.status(200).json({ count });
});



















module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    getUsersCount
    
}