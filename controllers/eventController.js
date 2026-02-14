const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { Event, validateCreateEvent, validateUpdateEvent } = require("../models/Event");
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require("../utils/cloudinary");

/**
 * @description Create new event
 * @route POST /api/events
 * @access private (admin only)
 */
const createEvent = asyncHandler(async (req, res) => {
    const { error } = validateCreateEvent(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let image = { url: "", publicId: null };

    if (req.file) {
        const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
        const result = await cloudinaryUploadImage(imagePath);
        image = {
            url: result.secure_url,
            publicId: result.public_id,
        };
        fs.unlinkSync(imagePath);
    }

    const event = await Event.create({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location || "",
        category: req.body.category || "upcoming",
        user: req.user.id,
        image,
    });

    res.status(201).json({ event });
});

/**
 * @description Get all events
 * @route GET /api/events
 * @access public
 */
const getAllEvents = asyncHandler(async (req, res) => {
    const { category } = req.query;
    let events;

    if (category) {
        events = await Event.find({ category }).sort({ date: -1 }).populate("user", ["-password"]);
    } else {
        events = await Event.find().sort({ date: -1 }).populate("user", ["-password"]);
    }

    res.status(200).json({ events });
});

/**
 * @description Get single event
 * @route GET /api/events/:id
 * @access public
 */
const getSingleEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate("user", ["-password"]);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });
});

/**
 * @description Update event
 * @route PUT /api/events/:id
 * @access private (admin only)
 */
const updateEvent = asyncHandler(async (req, res) => {
    const { error } = validateUpdateEvent(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    const updateData = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        category: req.body.category,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    if (req.file) {
        const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
        const result = await cloudinaryUploadImage(imagePath);
        if (event.image.publicId) {
            await cloudinaryDeleteImage(event.image.publicId);
        }
        updateData.image = {
            url: result.secure_url,
            publicId: result.public_id,
        };
        fs.unlinkSync(imagePath);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
    );

    res.status(200).json({ event: updatedEvent });
});

/**
 * @description Delete event
 * @route DELETE /api/events/:id
 * @access private (admin only)
 */
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    if (event.image.publicId) {
        await cloudinaryDeleteImage(event.image.publicId);
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
});

/**
 * @description Get events count
 * @route GET /api/events/count
 * @access private (admin only)
 */
const getEventCount = asyncHandler(async (req, res) => {
    const count = await Event.countDocuments();
    res.status(200).json({ count });
});

module.exports = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,
    getEventCount,
};
