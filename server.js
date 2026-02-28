const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// Routes
const contactRoute = require('./routes/contact');
const newsletterRoute = require('./routes/newsletter');
const bookingsRoute = require('./routes/bookings');
const complaintsRoute = require('./routes/complaints');

app.use('/api/contact', contactRoute);
app.use('/api/newsletter', newsletterRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/complaints', complaintsRoute);

// Test route
app.get('/', (req, res) => {
    res.send('Gracious Property Server is Running!');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/graciousDB')
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});