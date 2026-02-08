const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const {User, validateSignupUser, validateLoginUser} = require("../models/User");


/**
 * @description Sign up New User
 * @route /api/auth/signup
 * @method POST
 * @access public
 */
module.exports.signupUserController = asyncHandler(async (req, res) => {

    //validation
    const {error} = validateSignupUser(req.body);

    if(error){
        return res.status(400).json({message : error.details[0].message})
    }

    //isUser already exits
    let user = await User.findOne({email : req.body.email});
    if(user){
        return res.status(400).json({message : "user already exist"})
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPs = await bcrypt.hash(req.body.password, salt);

    //new user and save in DB
    user = new User({
        username : req.body.username,
        email : req.body.email,
        password : hashPs,
    })
    await user.save();

    //send res to client
    res.status(201).json({message : "You register pls log in!!"})
});

/**
 * @description Sign up New User
 * @route /api/auth/login
 * @method POST
 * @access public
 */
module.exports.loginUserController = asyncHandler(async (req, res) => {

    //validation
    const {error} = validateLoginUser(req.body);

    if(error){
        return res.status(400).json({message : error.details[0].message})
    }

    //is user exit
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return res.status(400).json({message : "user not exist"})
    }

    //check the password
    const isPassword = await bcrypt.compare(req.body.password, user.password);
    if(isPassword){
        return res.status(400).json({message : "user not exist"})
    }
    
    //TODO sending email to verif acc

    //generate token
    const token = user.generateAuthToken();
    //res to client

    res.status(201).json({
        _id : user.id,
        username : user.username,
        email : user.email,
        isAdmin : user.isAdmin,
        isAccountVerified : user.isAccountVerified,
        profilePhoto : user.profilePhoto,
        token ,
    },
        {message : "log in!!"})

})