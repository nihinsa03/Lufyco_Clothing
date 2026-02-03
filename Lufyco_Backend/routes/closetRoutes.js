const express = require('express');
const router = express.Router();
const ClosetItem = require('../models/ClosetItem');

/**
 * @swagger
 * /api/closet:
 *   get:
 *     summary: Get closet (cart) items
 *     description: |
 *       Retrieve all items in user's closet (shopping cart).
 *       Supports filtering by user, category, and search.
 *     tags: [Closet]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (use 'All' for no filter)
 *         example: "Clothing"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by item name (case-insensitive)
 *         example: "shirt"
 *     responses:
 *       200:
 *         description: Successfully retrieved closet items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   image:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
    try {
        const { userId, category, search } = req.query;
        let query = {};

        if (userId) query.user = userId;
        if (category && category !== 'All') query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const items = await ClosetItem.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/closet:
 *   post:
 *     summary: Add item to closet (cart)
 *     description: Add a new item to the user's closet/shopping cart
 *     tags: [Closet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID (optional if not enforcing auth)
 *                 example: "507f1f77bcf86cd799439011"
 *               name:
 *                 type: string
 *                 description: Item name
 *                 example: "Classic T-Shirt"
 *               category:
 *                 type: string
 *                 description: Item category
 *                 example: "Clothing"
 *               image:
 *                 type: string
 *                 description: Item image URL
 *                 example: "https://example.com/product.jpg"
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *                 example: "Size M, Black color"
 *     responses:
 *       201:
 *         description: Item added to closet successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 name:
 *                   type: string
 *                 category:
 *                   type: string
 *                 image:
 *                   type: string
 *                 notes:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
    const { userId, name, category, image, notes } = req.body;

    try {
        const newItem = new ClosetItem({
            user: userId, // might be null/undefined if not enforcing auth
            name,
            category,
            image,
            notes
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/closet/{id}:
 *   delete:
 *     summary: Remove item from closet
 *     description: Delete a specific item from the user's closet by item ID
 *     tags: [Closet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Closet item ID to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item removed"
 *       404:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Item not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', async (req, res) => {
    try {
        const item = await ClosetItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
