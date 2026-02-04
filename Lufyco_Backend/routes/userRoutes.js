const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validator = require('validator');
const { generateOTP, sendVerificationEmail } = require('../utils/emailService');

// Supported email providers
const SUPPORTED_PROVIDERS = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'protonmail.com',
    'aol.com',
    'mail.com',
    'zoho.com',
];

// Validate email provider
const isValidEmailProvider = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return SUPPORTED_PROVIDERS.includes(domain);
};

// @route   POST /api/users/register
// @desc    Register a new user and send verification email
// @access  Public
router.post('/register', async (req, res) => {
    const { name, phone, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Check if email provider is supported
        if (!isValidEmailProvider(email)) {
            return res.status(400).json({
                message: 'Email provider not supported. Please use Gmail, Yahoo, Outlook, or other common email providers.'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            // If user exists but not verified, allow resending OTP
            if (!userExists.isVerified) {
                const otp = generateOTP();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

                userExists.verificationOTP = otp;
                userExists.otpExpiry = otpExpiry;
                await userExists.save();

                // Send verification email
                try {
                    await sendVerificationEmail(email, otp);
                    return res.status(200).json({
                        message: 'User already exists but not verified. A new verification code has been sent to your email.',
                        requiresVerification: true
                    });
                } catch (emailError) {
                    console.error('Email sending failed:', emailError);
                    return res.status(500).json({
                        message: 'Failed to send verification email. Please check your email configuration.'
                    });
                }
            }
            return res.status(400).json({ message: 'User already exists and is verified. Please login.' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create new user
        const user = await User.create({
            name,
            phone,
            email,
            password, // Note: In production, hash the password with bcrypt
            isVerified: false,
            verificationOTP: otp,
            otpExpiry: otpExpiry,
        });

        if (user) {
            // Send verification email
            try {
                await sendVerificationEmail(email, otp);

                res.status(201).json({
                    message: 'Registration successful! A verification code has been sent to your email.',
                    requiresVerification: true,
                    email: user.email,
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Delete the user if email fails
                await User.deleteOne({ _id: user._id });
                return res.status(500).json({
                    message: 'Failed to send verification email. Please check your email configuration and try again.'
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Register API Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post('/verify-email', async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified. Please login.' });
        }

        // Check if OTP matches
        if (user.verificationOTP !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Check if OTP has expired
        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({
            message: 'Email verified successfully! You can now login.',
            verified: true,
        });
    } catch (error) {
        console.error("Verify Email API Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/resend-otp
// @desc    Resend OTP to email
// @access  Public
router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified. Please login.' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.verificationOTP = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, otp);
            res.json({ message: 'A new verification code has been sent to your email.' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({
                message: 'Failed to send verification email. Please try again later.'
            });
        }
    } catch (error) {
        console.error("Resend OTP API Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Offline / Backdoor Login
        // Allows login with user/user (case insensitive for username)
        if (email && email.toLowerCase() === 'user' && password === 'user') {
            console.log('Offline login used');
            return res.json({
                _id: 'dummy_user_id',
                name: 'Offline User',
                email: 'user',
                isAdmin: false,
                token: 'offline-token-123'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in. Check your inbox for the verification code.',
                requiresVerification: true
            });
        }

        if (user.password === password) { // Note: Compare hashed password in production
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            console.log(`Login failed: Invalid credentials for ${email}`);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login API Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/forgot-password
// @desc    Send password reset OTP to email
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Generate 6-digit OTP for password reset
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.verificationOTP = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send password reset email
        try {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: `"Fashion - Lufyco Clothing" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Password Reset - Lufyco Clothing',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; }
                            .content { padding: 40px 30px; text-align: center; }
                            .otp-box { background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; margin: 30px 0; display: inline-block; }
                            .otp { font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 12px; }
                            .message { color: #555; line-height: 1.6; margin: 20px 0; }
                            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                            .warning { color: #e74c3c; font-size: 14px; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🔒 Password Reset</h1>
                                <p>Lufyco Clothing</p>
                            </div>
                            <div class="content">
                                <h2>Reset Your Password</h2>
                                <p class="message">
                                    We received a request to reset your password. Use the 6-digit code below to continue:
                                </p>
                                <div class="otp-box">
                                    <div class="otp">${otp}</div>
                                </div>
                                <p class="message">
                                    This code will expire in <strong>10 minutes</strong>.
                                </p>
                                <p class="warning">
                                    ⚠️ If you didn't request this, please ignore this email and your password will remain unchanged.
                                </p>
                            </div>
                            <div class="footer">
                                <p>© 2026 Lufyco Clothing. All rights reserved.</p>
                                <p>This is an automated email, please do not reply.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Password reset OTP sent to ${email}`);

            res.json({
                message: 'A 6-digit verification code has been sent to your email.',
                email: email
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({
                message: 'Failed to send password reset email. Please try again later.'
            });
        }
    } catch (error) {
        console.error("Forgot Password API Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/verify-reset-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post('/verify-reset-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP matches
        if (user.verificationOTP !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Check if OTP has expired
        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        res.json({
            message: 'OTP verified successfully. You can now reset your password.',
            verified: true,
        });
    } catch (error) {
        console.error("Verify Reset OTP API Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/reset-password
// @desc    Reset password after OTP verification
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify OTP one more time
        if (user.verificationOTP !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        // Update password and clear OTP
        user.password = newPassword; // Note: Should hash password in production
        user.verificationOTP = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({
            message: 'Password reset successfully! You can now login with your new password.',
            success: true,
        });
    } catch (error) {
        console.error("Reset Password API Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


