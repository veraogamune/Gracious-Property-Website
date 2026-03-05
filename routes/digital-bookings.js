const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Digital Booking Schema
const digitalBookingSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String },
    time: { type: String },
    details: { type: String },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const DigitalBooking = mongoose.model('DigitalBooking', digitalBookingSchema);

// POST route — save digital service booking
router.post('/', async (req, res) => {
    try {
        const { fullName, email, phone, service, date, time, details } = req.body;

        const newBooking = new DigitalBooking({ fullName, email, phone, service, date, time, details });
        await newBooking.save();

        const { sendDigitalBookingEmails } = require('../utils/emailService');
        await sendDigitalBookingEmails({ fullName, email, phone, service, date, time, details });

        res.status(200).json({ success: true, message: 'Booking request submitted successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;