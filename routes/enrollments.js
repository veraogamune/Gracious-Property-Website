const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    schedule: { type: String, required: true },
    mode: { type: String, required: true },
    experience: { type: String, required: true },
    occupation: { type: String },
    reason: { type: String },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// POST route — save enrollment
router.post('/', async (req, res) => {
    try {
        const { fullName, email, phone, course, schedule, mode, experience, occupation, reason } = req.body;

        const newEnrollment = new Enrollment({ 
            fullName, email, phone, course, schedule, mode, experience, occupation, reason 
        });
        await newEnrollment.save();

        const { sendEnrollmentEmails } = require('../utils/emailService');
        await sendEnrollmentEmails({ fullName, email, phone, course, schedule, mode, experience });

        res.status(200).json({ success: true, message: 'Enrollment submitted successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;