const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Complaint Schema
const complaintSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String },
    category: { type: String, required: true },
    complaint: { type: String, required: true },
    status: { type: String, default: 'Open' },
    createdAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// POST route — save complaint
router.post('/', async (req, res) => {
    try {
        const { fullName, email, location, category, complaint } = req.body;

        const newComplaint = new Complaint({ fullName, email, location, category, complaint });
        await newComplaint.save();

        res.status(200).json({ success: true, message: 'Complaint submitted successfully!' });
   } catch (error) {
        console.log('Complaint Error:', error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;