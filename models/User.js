const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken")


//User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    profilePhoto: {
        url: {
            type: String,
            default: "https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.jpg"
        },
        publicId: {
            type: String,
            default: null
        }
    },
    bio: {
        type: String,
        maxlength: 500
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});



//validation Sign up USer
function validateSignupUser(obj) {
    const schema = Joi.object({
        username: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().min(5).max(100).required(),
        password: Joi.string().min(8).required(),
        bio: Joi.string().max(500)
    });

    return schema.validate(obj);
}

//validation login USer
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(100).required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(obj);
}

//validation Update USer
function validateUpdateUser(obj) {
    const schema = Joi.object({
        username: Joi.string().min(2).max(100).required(),
        password: Joi.string().min(8).required(),
        bio: Joi.string().max(500)
    });

    return schema.validate(obj);
}

//generate token

UserSchema.methods.generateAuthToken = function() {
    return jwt.sign({id : this._id, isAdmin : this.isAdmin}, process.env.SECRET_KEY)
}










//User model
const User = mongoose.model("User", UserSchema);

module.exports = {
    User,
    validateSignupUser,
    validateLoginUser,
    validateUpdateUser
}