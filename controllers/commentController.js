const asynHandler = require("express-async-handler");
const User = require("../models/User");
const { validateCreateComment, Comment, validateUpdateComment} = require("../models/Comment");

/**
 * @description create new comment
 * @route /api/comments
 * @method post
 * @access private (only logged in  user)
 */
const createComment = asynHandler(async(req, res) => {
    const {error} = validateCreateComment(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message})
    }

    const profile = await User.findById(req.user.id);

    const comment = await Comment.create({
        postId : req.body.postId,
        userId : req.user.id,
        text : req.body.text,
        username : req.profile.username
    })

    res.status(201).json({comment})
})

/**
 * @description get all  comment
 * @route /api/comments
 * @method get
 * @access private (only  admin)
 */
const getAllComments = asynHandler(async(req, res) => {
    const comments = await Comment.find().populate("userId", "username");
    res.status(200).json({comments})
})

/**
 * @description delete  comment
 * @route /api/comments/:id
 * @method delete
 * @access private (only logged in  user or admin)
 */
const deleteComment = asynHandler(async(req, res) => {
    const comment = await Comment.findById(req.params.id);
    if(!comment){
        return res.status(404).json({message : "Comment not found"})
    }

    if(comment.userId.toString() !== req.user.id && req.user.isAdmin === false){
        return res.status(403).json({message : "You are not allowed to delete this comment"})
    }

    await comment.remove();
    res.status(200).json({message : "Comment deleted successfully"})
})

/**
 * @description Update  comment
 * @route /api/comments/:id
 * @method put
 * @access private (only logged in  user)
 */
const updateComment = asynHandler(async(req, res) => {
    const {error} = validateUpdateComment(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message})
    }

    const comment = await Comment.findById(req.params.id);
    if(!comment){
        return res.status(404).json({message : "Comment not found"})
    }

    if(comment.userId.toString() !== req.user.id){
        return res.status(403).json({message : "You are not allowed to update this comment"})
    }

    comment.text = req.body.text;
    await comment.save();
    res.status(200).json({comment})
})






module.exports = {
    createComment,
    getAllComments,
    deleteComment,
    updateComment
}