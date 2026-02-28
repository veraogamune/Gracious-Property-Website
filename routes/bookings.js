const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// File upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Booking Schema
const bookingSchema = new mongoose.Schema({
    // Location & Room
    location: { type: String, required: true },
    roomType: { type: String, required: true },

    // Personal Info
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    sex: { type: String, required: true },
    dob: { type: String, required: true },
    stateOfOrigin: { type: String },
    localGovernmentArea: { type: String },
    religion: { type: String },
    healthConditions: { type: String },
    doctorInfo: { type: String },
    occupation: { type: String, required: true },

    // Student/Work fields
    schoolName: { type: String },
    schoolAddress: { type: String },
    workplaceName: { type: String },
    workplaceAddress: { type: String },
    workplaceRole: { type: String },
    profession: { type: String },
    officeNumber: { type: String },
    yearsWorked: { type: String },

    // Address & Emergency
    address: { type: String, required: true },
    emergencyName: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    emergencyRelation: { type: String, required: true },

    // Guarantors
    guarantorName1: { type: String, required: true },
    guarantorPhone1: { type: String, required: true },
    guarantorName2: { type: String, required: true },
    guarantorPhone2: { type: String, required: true },

    // Documents
    idCardPath: { type: String },
    photoPath: { type: String },

    // Status
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// POST route — save apartment booking
router.post('/', upload.fields([
    { name: 'idUpload', maxCount: 1 },
    { name: 'photoUpload', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = req.body;

        const newBooking = new Booking({
            ...data,
            idCardPath: req.files['idUpload'] ? req.files['idUpload'][0].path : '',
            photoPath: req.files['photoUpload'] ? req.files['photoUpload'][0].path : ''
        });

        await newBooking.save();

        res.status(200).json({ success: true, message: 'Booking request submitted successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;