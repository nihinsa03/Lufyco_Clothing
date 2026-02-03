const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with name, email, and password. Returns user data without password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (must be unique)
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User's password (currently stored as plain text - hashing to be added)
 *                 example: mySecurePassword123
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: MongoDB generated user ID
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                   description: Admin privilege flag (default false)
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               isAdmin: false
 *       400:
 *         description: Bad request - User already exists or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userExists:
 *                 value:
 *                   message: "User already exists"
 *               invalidData:
 *                 value:
 *                   message: "Invalid user data"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, // Note: Password hashing should be added for production
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Register API Error:", error);
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user and login
 *     description: |
 *       Login with email and password. Returns user data on successful authentication.
 *       
 *       **Special Feature: Offline Login**
 *       - Use email: "user" (case insensitive)
 *       - Use password: "user" (case sensitive)
 *       - This allows development/testing without database connection
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address (or "user" for offline login)
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User's password (or "user" for offline login)
 *                 example: mySecurePassword123
 *           examples:
 *             normalLogin:
 *               summary: Normal user login
 *               value:
 *                 email: "john.doe@example.com"
 *                 password: "mySecurePassword123"
 *             offlineLogin:
 *               summary: Offline/Development login
 *               value:
 *                 email: "user"
 *                 password: "user"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 isAdmin:
 *                   type: boolean
 *                   description: Admin privilege flag
 *                 token:
 *                   type: string
 *                   description: Authentication token (only for offline login currently)
 *             examples:
 *               normalUser:
 *                 value:
 *                   _id: "507f1f77bcf86cd799439011"
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   isAdmin: false
 *               offlineUser:
 *                 value:
 *                   _id: "dummy_user_id"
 *                   name: "Offline User"
 *                   email: "user"
 *                   isAdmin: false
 *                   token: "offline-token-123"
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid email or password"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

        if (user && user.password === password) { // Note: Compare hashed password in production
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

module.exports = router;
