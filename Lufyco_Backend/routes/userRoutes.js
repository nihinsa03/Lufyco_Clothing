const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validator = require('validator');
const { generateOTP, sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Supported email providers
const SUPPORTED_EMAIL_PROVIDERS = [
    '@gmail.com',
    '@yahoo.com',
    '@outlook.com',
    '@hotmail.com',
    '@icloud.com',
    '@protonmail.com',
    '@aol.com'
];

/**
 * Validate email format and provider
 */
const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        return { valid: false, message: 'Invalid email format' };
    }

    const emailLower = email.toLowerCase();
    const hasValidProvider = SUPPORTED_EMAIL_PROVIDERS.some(provider =>
        emailLower.endsWith(provider)
    );

    if (!hasValidProvider) {
        return {
            valid: false,
            message: 'Email must be from a supported provider (Gmail, Yahoo, Outlook, etc.)'
        };
    }

    return { valid: true };
};

// @route   POST /api/users/register
// @desc    Register a new user and send verification email
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ message: emailValidation.message });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password, // Note: Password hashing should be added for production
            verificationOTP: otp,
            otpExpiry: otpExpiry,
            isVerified: false
        });

        if (user) {
            // Send verification email
            const emailResult = await sendVerificationEmail(email, otp);

            if (!emailResult.success) {
                console.error('Failed to send verification email:', emailResult.error);
                // Still return success for user creation, but log the error
            }

            res.status(201).json({
                message: 'User registered successfully. Please check your email for verification code.',
                email: user.email,
                userId: user._id
            });
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
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Check if OTP matches
        if (user.verificationOTP !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Check if OTP has expired
        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({
            message: 'Email verified successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error("Verify Email API Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/users/resend-otp
// @desc    Resend OTP to user's email
// @access  Public
router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        user.verificationOTP = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send verification email
        const emailResult = await sendVerificationEmail(email, otp);

        if (!emailResult.success) {
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        res.json({ message: 'Verification code resent successfully' });
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
                isVerified: true,
                token: 'offline-token-123'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(`Login failed: User not found for ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in',
                requiresVerification: true,
                email: user.email
            });
        }

        if (user.password === password) { // Note: Compare hashed password in production
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified
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

module.exports = router;

