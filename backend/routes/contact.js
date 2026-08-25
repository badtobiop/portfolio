const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { saveMessage, getMessages } = require('../db');

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Optional: Nodemailer transporter for email alerts
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

/**
 * POST /api/contact
 * Handles contact form submissions
 */
router.post('/contact', async (req, res) => {
    try {
        let { name, email, message } = req.body;

        // 1. Sanitize & trim inputs
        name = (name || '').trim();
        email = (email || '').trim().toLowerCase();
        message = (message || '').trim();

        // 2. Validate inputs
        const errors = [];
        if (!name || name.length < 2) {
            errors.push('Name must be at least 2 characters long.');
        }
        if (!email || !EMAIL_REGEX.test(email)) {
            errors.push('Please provide a valid email address.');
        }
        if (!message || message.length < 5) {
            errors.push('Message must be at least 5 characters long.');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // 3. Extract IP address
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

        // 4. Save message to SQLite database
        const savedRecord = await saveMessage(name, email, message, ip);
        console.log(`📩 New message received from ${name} (${email}) [ID: ${savedRecord.id}]`);

        // 5. Send Email Alert (if configured)
        if (transporter && process.env.NOTIFICATION_EMAIL) {
            try {
                await transporter.sendMail({
                    from: `"Portfolio Alert" <${process.env.SMTP_USER}>`,
                    to: process.env.NOTIFICATION_EMAIL,
                    subject: `🚀 New Contact Form Submission: ${name}`,
                    text: `Name: ${name}\nEmail: ${email}\nDate: ${savedRecord.created_at}\n\nMessage:\n${message}`,
                    html: `
                        <h3>New Contact Message</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Date:</strong> ${savedRecord.created_at}</p>
                        <hr/>
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    `
                });
                console.log(`✉️ Email alert sent to ${process.env.NOTIFICATION_EMAIL}`);
            } catch (mailErr) {
                console.error('⚠️ Could not send email notification:', mailErr.message);
                // Non-blocking: DB entry was still saved successfully
            }
        }

        // 6. Return success response
        return res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been received successfully.',
            data: {
                id: savedRecord.id,
                name: savedRecord.name,
                created_at: savedRecord.created_at
            }
        });
    } catch (err) {
        console.error('❌ Error handling contact submission:', err);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while processing your message.'
        });
    }
});

/**
 * GET /api/messages
 * Retrieve messages list (Protected with an optional Admin API Key in header)
 */
router.get('/messages', async (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'] || req.query.key;
        const configuredKey = process.env.ADMIN_SECRET_KEY || 'admin123';

        if (adminKey !== configuredKey) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid admin key. Provide ?key=admin123 or x-admin-key header.'
            });
        }

        const messages = await getMessages(100);
        return res.json({
            success: true,
            count: messages.length,
            messages: messages
        });
    } catch (err) {
        console.error('❌ Error fetching messages:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve messages.'
        });
    }
});

module.exports = router;
