const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { verifyUser } = require('./users');

// File upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Payment Schema
const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    month: { type: Number, required: true }, // 1-6
    monthLabel: { type: String, required: true }, // e.g "Month 1-2", "Month 3" etc
    receiptPath: { type: String },
    status: { type: String, default: 'Pending' }, // Pending, Approved, Rejected
    uploadedAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// GET /api/payments/:bookingId — get all payments for a booking
router.get('/:bookingId', verifyUser, async (req, res) => {
    try {
        const payments = await Payment.find({ bookingId: req.params.bookingId });
        res.status(200).json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
});

// POST /api/payments/upload — upload a receipt
router.post('/upload', verifyUser, upload.single('receipt'), async (req, res) => {
    try {
        const { bookingId, month, monthLabel, fullName, email } = req.body;
        const receiptPath = req.file ? req.file.path.replace(/\\/g, '/') : '';

        // Check if payment for this month already exists
        const existing = await Payment.findOne({ bookingId, month });

        if (existing) {
            // Update existing
            existing.receiptPath = receiptPath;
            existing.status = 'Pending';
            existing.uploadedAt = new Date();
            await existing.save();
        } else {
            // Create new
            const newPayment = new Payment({
                bookingId,
                userId: req.user.id,
                fullName,
                email,
                month,
                monthLabel,
                receiptPath
            });
            await newPayment.save();
        }

        res.status(200).json({ success: true, message: 'Receipt uploaded successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
});

module.exports = router;