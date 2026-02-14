const mongoose = require("mongoose");
const Joi = require("joi");

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        trim: true,
    },
    image: {
        type: Object,
        default: {
            url: "",
            publicId: null,
        },
    },
    category: {
        type: String,
        enum: ["past", "upcoming"],
        default: "upcoming",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
});

const Event = mongoose.model("Event", EventSchema);

function validateCreateEvent(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(200).required(),
        description: Joi.string().trim().min(2).required(),
        date: Joi.date().required(),
        location: Joi.string().trim().allow(""),
        category: Joi.string().valid("past", "upcoming"),
    });
    return schema.validate(obj);
}

function validateUpdateEvent(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(200),
        description: Joi.string().trim().min(2),
        date: Joi.date(),
        location: Joi.string().trim().allow(""),
        category: Joi.string().valid("past", "upcoming"),
    });
    return schema.validate(obj);
}

module.exports = {
    Event,
    validateCreateEvent,
    validateUpdateEvent,
};
