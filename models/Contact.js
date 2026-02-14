const mongoose = require("mongoose");
const Joi = require("joi");

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
    },
    phone: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    type: {
        type: String,
        enum: ["volunteer", "contact", "partnership"],
        default: "contact",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Contact = mongoose.model("Contact", ContactSchema);

function validateCreateContact(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        phone: Joi.string().trim().allow(""),
        message: Joi.string().trim().min(2).required(),
        type: Joi.string().valid("volunteer", "contact", "partnership"),
    });
    return schema.validate(obj);
}

module.exports = {
    Contact,
    validateCreateContact,
};
