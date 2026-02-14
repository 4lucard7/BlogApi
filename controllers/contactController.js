const asyncHandler = require("express-async-handler");
const { Contact, validateCreateContact } = require("../models/Contact");

/**
 * @description Create new contact submission
 * @route POST /api/contact
 * @access public
 */
const createContact = asyncHandler(async (req, res) => {
    const { error } = validateCreateContact(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const contact = await Contact.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || "",
        message: req.body.message,
        type: req.body.type || "contact",
    });

    res.status(201).json({ contact });
});

/**
 * @description Get all contact submissions
 * @route GET /api/contact
 * @access private (admin only)
 */
const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts });
});

/**
 * @description Get single contact submission
 * @route GET /api/contact/:id
 * @access private (admin only)
 */
const getSingleContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ contact });
});

/**
 * @description Mark contact as read
 * @route PUT /api/contact/:id
 * @access private (admin only)
 */
const markContactAsRead = asyncHandler(async (req, res) => {
    const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { $set: { isRead: true } },
        { new: true }
    );
    if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ contact });
});

/**
 * @description Delete contact submission
 * @route DELETE /api/contact/:id
 * @access private (admin only)
 */
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Contact deleted successfully" });
});

/**
 * @description Get contacts count
 * @route GET /api/contact/count
 * @access private (admin only)
 */
const getContactCount = asyncHandler(async (req, res) => {
    const count = await Contact.countDocuments();
    res.status(200).json({ count });
});

module.exports = {
    createContact,
    getAllContacts,
    getSingleContact,
    markContactAsRead,
    deleteContact,
    getContactCount,
};
