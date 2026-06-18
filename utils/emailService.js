const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Send email helper
async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: `"Gracious Property" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.log('Email error:', error);
    }
}

// ===== EMAIL TEMPLATES =====

// Contact form
async function sendContactEmails(data) {
    // To admin
    await sendEmail(
        process.env.ADMIN_EMAIL,
        '📩 New Contact Message — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">New Contact Message</h2>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Message:</strong> ${data.message}</p>
        </div>`
    );

    // To customer
    await sendEmail(
        data.email,
        '✅ We received your message — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">Thank you, ${data.fullName}!</h2>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong> ${data.message}</p>
            <br>
            <p style="color:#94a3b8">Gracious Property Team</p>
        </div>`
    );
}

// Apartment booking
async function sendBookingEmails(data) {
    await sendEmail(
        process.env.ADMIN_EMAIL,
        '🏠 New Apartment Booking — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">New Apartment Booking</h2>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Room Type:</strong> ${data.roomType}</p>
            <p><strong>Occupation:</strong> ${data.occupation}</p>
        </div>`
    );

    await sendEmail(
        data.email,
        '✅ Booking Request Received — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">Booking Request Received!</h2>
            <p>Dear ${data.fullName},</p>
            <p>Thank you for your apartment booking request. We will review your application and contact you within <strong>24-48 hours</strong> with approval status and payment details.</p>
            <br>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Room Type:</strong> ${data.roomType}</p>
            <br>
            <p style="color:#94a3b8">Gracious Property Team</p>
        </div>`
    );
}

// Digital services booking
async function sendDigitalBookingEmails(data) {
    await sendEmail(
        process.env.ADMIN_EMAIL,
        '💻 New Digital Service Booking — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">New Digital Service Booking</h2>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Date:</strong> ${data.date || 'Not specified'}</p>
            <p><strong>Time:</strong> ${data.time || 'Not specified'}</p>
            <p><strong>Details:</strong> ${data.details || 'None'}</p>
        </div>`
    );

    await sendEmail(
        data.email,
        '✅ Service Booking Confirmed — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">Booking Request Received!</h2>
            <p>Dear ${data.fullName},</p>
            <p>Thank you for booking our <strong>${data.service}</strong> service. We will contact you within <strong>24 hours</strong> to confirm your booking.</p>
            <br>
            <p style="color:#94a3b8">Gracious Property Team</p>
        </div>`
    );
}

// Course enrollment
async function sendEnrollmentEmails(data) {
    await sendEmail(
        process.env.ADMIN_EMAIL,
        '🎓 New Course Enrollment — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">New Course Enrollment</h2>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Course:</strong> ${data.course}</p>
            <p><strong>Schedule:</strong> ${data.schedule}</p>
            <p><strong>Mode:</strong> ${data.mode}</p>
            <p><strong>Experience:</strong> ${data.experience}</p>
        </div>`
    );

    await sendEmail(
        data.email,
        '✅ Enrollment Received — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">Enrollment Request Received!</h2>
            <p>Dear ${data.fullName},</p>
            <p>Thank you for enrolling in our <strong>${data.course}</strong> course. We will contact you within <strong>24 hours</strong> with further details and payment instructions.</p>
            <br>
            <p style="color:#94a3b8">Gracious Property Team</p>
        </div>`
    );
}

// Complaint
async function sendComplaintEmails(data) {
    await sendEmail(
        process.env.ADMIN_EMAIL,
        '⚠️ New Complaint Submitted — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#ef4444">New Complaint</h2>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Location:</strong> ${data.location || 'Not specified'}</p>
            <p><strong>Category:</strong> ${data.category}</p>
            <p><strong>Complaint:</strong> ${data.complaint}</p>
        </div>`
    );

    await sendEmail(
        data.email,
        '✅ Complaint Received — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">Complaint Received</h2>
            <p>Dear ${data.fullName},</p>
            <p>We have received your complaint and will respond within <strong>24 hours</strong>. We take all complaints seriously and will work to resolve your issue as quickly as possible.</p>
            <br>
            <p style="color:#94a3b8">Gracious Property Team</p>
        </div>`
    );
}

// User registration confirmation
async function sendRegistrationEmail(data) {
    await sendEmail(
        data.email,
        '🎉 Welcome to Gracious Property!',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">Welcome, ${data.fullName}! 🎉</h2>
            <p>Thank you for creating an account with Gracious Property. Your account has been successfully created!</p>
            <br>
            <div style="background:#1e293b;padding:1.5rem;border-radius:10px;border-left:4px solid #3b82f6">
                <p><strong>Your Account Details:</strong></p>
                <p>📧 Email: ${data.email}</p>
                <p>📱 Phone: ${data.phone}</p>
            </div>
            <br>
            <p>You can now:</p>
            <ul style="color:#94a3b8;line-height:2">
                <li>Book an apartment</li>
                <li>Book digital services</li>
                <li>Enroll in computer training courses</li>
                <li>Track all your bookings in your dashboard</li>
            </ul>
            <br>
            <p style="color:#94a3b8">If you did not create this account, please ignore this email.</p>
            <br>
            <p style="color:#94a3b8">Gracious Property Team</p>
        </div>`
    );

    // Notify admin of new registration
    await sendEmail(
        process.env.ADMIN_EMAIL,
        '👤 New User Registration — Gracious Property',
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:#3b82f6">New User Registered</h2>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
        </div>`
    );
}

// Status update email
async function sendStatusUpdateEmail(entry, collection, status) {
    const statusEmoji = status === 'Approved' ? '✅' : status === 'Rejected' ? '❌' : '⏳';
    const statusColor = status === 'Approved' ? '#10b981' : status === 'Rejected' ? '#ef4444' : '#f59e0b';

    let subject = '';
    let details = '';

    if (collection === 'Booking') {
        subject = `${statusEmoji} Apartment Booking ${status} — Gracious Property`;
        details = `<p><strong>Location:</strong> ${entry.location}</p>
                   <p><strong>Room Type:</strong> ${entry.roomType}</p>`;
    } else if (collection === 'DigitalBooking') {
        subject = `${statusEmoji} Service Booking ${status} — Gracious Property`;
        details = `<p><strong>Service:</strong> ${entry.service}</p>
                   <p><strong>Date:</strong> ${entry.date || 'Not specified'}</p>`;
    } else if (collection === 'Enrollment') {
        subject = `${statusEmoji} Course Enrollment ${status} — Gracious Property`;
        details = `<p><strong>Course:</strong> ${entry.course}</p>
                   <p><strong>Schedule:</strong> ${entry.schedule}</p>`;
    } else if (collection === 'Complaint') {
        subject = `${statusEmoji} Complaint ${status} — Gracious Property`;
        details = `<p><strong>Category:</strong> ${entry.category}</p>`;
    }

    let message = '';
    if (status === 'Approved' && collection === 'Booking') {
        message = `We are pleased to inform you that your apartment booking request has been <strong style="color:#10b981">approved</strong>! 
        <br><br>
        If you are still interested in proceeding, please make your payment to the following account:
        <br><br>
        <div style="background:#1e293b;padding:1.5rem;border-radius:10px;border-left:4px solid #10b981">
            <p><strong>Bank:</strong> Opay</p>
            <p><strong>Account Number:</strong> 9068846924</p>
            <p><strong>Account Name:</strong> Gracious Property</p>
            <p><strong>Amount:</strong> As shown in your payment summary</p>
        </div>
        <br>
        After payment, please log in to your dashboard at <a href="http://localhost:3000/user-dashboard.html" style="color:#3b82f6">Gracious Property Dashboard</a> and upload your receipt for the respective month you are paying for.`;
    } else if (status === 'Approved') {
        message = 'We are pleased to inform you that your request has been <strong style="color:#10b981">approved</strong>! We will be in touch shortly with further details.';
    } else if (status === 'Rejected') {
        message = 'We regret to inform you that your request has been <strong style="color:#ef4444">rejected</strong>. Please contact us for more information.';
    } else if (status === 'Resolved') {
        message = 'We are pleased to inform you that your complaint has been <strong style="color:#10b981">resolved</strong>. Thank you for your patience.';
    } else {
        message = 'Your request status has been updated to <strong>' + status + '</strong>.';
    }

    await sendEmail(
        entry.email,
        subject,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:2rem;border-radius:12px">
            <h2 style="color:${statusColor}">Booking Update</h2>
            <p>Dear ${entry.fullName},</p>
            <p>${message}</p>
            <br>
            ${details}
            <br>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <br>
            <p style="color:#94a3b8">Gracious Property Team</p>
        </div>`
    );
}

module.exports = {
    sendContactEmails,
    sendBookingEmails,
    sendDigitalBookingEmails,
    sendEnrollmentEmails,
    sendComplaintEmails,
    sendRegistrationEmail,
    sendStatusUpdateEmail
};