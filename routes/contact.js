const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Contact Schema — defines what a contact message looks like in the database
const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST route — receives and saves the contact message
router.post('/', async (req, res) => {
    try {
        const { fullName, email, phone, service, message } = req.body;

        // Create and save to database
        const newContact = new Contact({ fullName, email, phone, service, message });
        await newContact.save();

        const { sendContactEmails } = require('../utils/emailService');
        await sendContactEmails({ fullName, email, phone, service, message });

        res.status(200).json({ success: true, message: 'Message received successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;