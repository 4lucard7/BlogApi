const mongoose = require("mongoose");
const Joi = require("joi");
const { User } = require("./User");





//Create Category Schema
const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
}, { 
    timestamps: true,
})

module.exports = mongoose.model("Category", categorySchema);


//validate create category
module.exports.validateCategory = (category) => {
    const schema = Joi.object({
        title: Joi.string().required(),
    })
    return schema.validate(category)
}



