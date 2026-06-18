const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// User Schema
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Middleware to verify user token
function verifyUser(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ success: false, message: 'Please login to continue' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
    }
}

// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // Check if email already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ fullName, email, phone, password: hashedPassword });
        await newUser.save();

        // Generate token
        const token = jwt.sign({ id: newUser._id, fullName: newUser.fullName, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ success: true, token, user: { fullName: newUser.fullName, email: newUser.email, phone: newUser.phone } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id, fullName: user.fullName, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ success: true, token, user: { fullName: user.fullName, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

// GET /api/users/profile
router.get('/profile', verifyUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
});

// PATCH /api/users/profile
router.patch('/profile', verifyUser, async (req, res) => {
    try {
        const { fullName, phone, password } = req.body;
        const updates = { fullName, phone };

        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
});

// GET /api/users/bookings — get user's bookings and enrollments
router.get('/bookings', verifyUser, async (req, res) => {
    try {
        const Booking = mongoose.model('Booking');
        const DigitalBooking = mongoose.model('DigitalBooking');
        const Enrollment = mongoose.model('Enrollment');

        const user = await User.findById(req.user.id);

        const [bookings, digitalBookings, enrollments] = await Promise.all([
            Booking.find({ email: user.email }).sort({ createdAt: -1 }),
            DigitalBooking.find({ email: user.email }).sort({ createdAt: -1 }),
            Enrollment.find({ email: user.email }).sort({ createdAt: -1 })
        ]);

        res.status(200).json({ success: true, bookings, digitalBookings, enrollments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
});

// PATCH /api/users/cancel/:id — cancel a booking
router.patch('/cancel/:id', verifyUser, async (req, res) => {
    try {
        const { collection } = req.body;
        const mongoose = require('mongoose');
        const Model = mongoose.model(collection);
        await Model.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
        res.status(200).json({ success: true, message: 'Booking cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
});

module.exports = { router, verifyUser };