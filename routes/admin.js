const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin credentials — change these to your own!
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('gracious2026', 10);
const JWT_SECRET = 'gracious-property-secret-key';

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ success: false, message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

// POST /api/admin/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
    res.status(200).json({ success: true, token });
});

// GET /api/admin/data — fetch all collections
router.get('/data', verifyToken, async (req, res) => {
    try {
        const Contact = require('mongoose').model('Contact');
        const Newsletter = require('mongoose').model('Newsletter');
        const Booking = require('mongoose').model('Booking');
        const Complaint = require('mongoose').model('Complaint');
        const DigitalBooking = require('mongoose').model('DigitalBooking');
        const Enrollment = require('mongoose').model('Enrollment');

        const [contacts, newsletters, bookings, complaints, digitalBookings, enrollments] = await Promise.all([
            Contact.find().sort({ createdAt: -1 }),
            Newsletter.find().sort({ subscribedAt: -1 }),
            Booking.find().sort({ createdAt: -1 }),
            Complaint.find().sort({ createdAt: -1 }),
            DigitalBooking.find().sort({ createdAt: -1 }),
            Enrollment.find().sort({ createdAt: -1 })
        ]);

        res.status(200).json({ success: true, contacts, newsletters, bookings, complaints, digitalBookings, enrollments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

// PATCH /api/admin/status — update status of any entry
router.patch('/status', verifyToken, async (req, res) => {
    try {
        const { collection, id, status } = req.body;
        const mongoose = require('mongoose');
        const Model = mongoose.model(collection);
        await Model.findByIdAndUpdate(id, { status });
        res.status(200).json({ success: true, message: 'Status updated!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

// DELETE /api/admin/delete — delete any entry
router.delete('/delete', verifyToken, async (req, res) => {
    try {
        const { collection, id } = req.body;
        const mongoose = require('mongoose');
        const Model = mongoose.model(collection);
        await Model.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Entry deleted!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

module.exports = { router, verifyToken };