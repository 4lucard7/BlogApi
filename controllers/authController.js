const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { User, validateSignupUser, validateLoginUser } = require("../models/User");

/**
 * @description Sign up New User
 * @route /api/auth/signup
 * @method POST
 * @access public
 */
module.exports.signupUserController = asyncHandler(async (req, res) => {

    // validation
    const { error } = validateSignupUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPs = await bcrypt.hash(req.body.password, salt);

    // create new user and save in DB
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPs,
    });
    await user.save();

    // TODO: sending email to verify account

    // send response to client
    res.status(201).json({ message: "You registered successfully! Please log in." });
});

/**
 * @description Login User
 * @route /api/auth/login
 * @method POST
 * @access public
 */
module.exports.loginUserController = asyncHandler(async (req, res) => {

    // validation
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // check the password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate token
    const token = user.generateAuthToken(); // make sure generateAuthToken adds isAdmin

    // send response to client
    res.status(200).json({
        message: "Logged in successfully!",
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isAccountVerified: user.isAccountVerified,
        profilePhoto: user.profilePhoto,
        token,
    });
});
