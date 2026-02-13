const Joi = require('joi');
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000,
    },
    username: {
        type : string,
        required: true,
    },
}, {
    timestamps: true,
});

//comment model
module.exports = mongoose.model('Comment', CommentSchema);

//validate create comment
function validateCreateComment(obj) {
    const schema = Joi.object({
        postId: Joi.string().required().label("Post ID"),
        text: Joi.string().trim().min(1).max(1000).required()
    });
    return schema.validate(obj);
}

//validate update comment
function validateUpdateComment(obj) {
    const schema = Joi.object({
        text: Joi.string().trim().min(1).max(1000),
    });
    return schema.validate(obj);
}

module.exports = {
    validateCreateComment,
    validateUpdateComment,
};