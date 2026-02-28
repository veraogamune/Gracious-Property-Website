const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// POST route — save subscriber
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'This email is already subscribed!' });
        }

        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        res.status(200).json({ success: true, message: 'Subscribed successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;