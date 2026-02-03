const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get wishlist items
 *     description: Retrieve all items in user's wishlist, optionally filtered by user ID
 *     tags: [Wishlist]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter wishlist by user ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Successfully retrieved wishlist items
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
 *                     description: User ID
 *                   product:
 *                     type: string
 *                     description: Product ID
 *                   title:
 *                     type: string
 *                     description: Product title
 *                   price:
 *                     type: number
 *                     description: Product price
 *                   image:
 *                     type: string
 *                     description: Product image URL
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - _id: "507f191e810c19729de860ea"
 *                 user: "507f1f77bcf86cd799439011"
 *                 product: "507f191e810c19729de860eb"
 *                 title: "Classic Cotton T-Shirt"
 *                 price: 2500
 *                 image: "https://example.com/tshirt.jpg"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) query.user = userId;

        const items = await Wishlist.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add item to wishlist
 *     description: |
 *       Add a product to user's wishlist.
 *       Checks for duplicates before adding.
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - price
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *                 example: "507f1f77bcf86cd799439011"
 *               productId:
 *                 type: string
 *                 description: Product ID (optional)
 *                 example: "507f191e810c19729de860eb"
 *               title:
 *                 type: string
 *                 description: Product title/name
 *                 example: "Classic Cotton T-Shirt"
 *               price:
 *                 type: number
 *                 description: Product price
 *                 example: 2500
 *               image:
 *                 type: string
 *                 description: Product image URL
 *                 example: "https://example.com/tshirt.jpg"
 *     responses:
 *       201:
 *         description: Item successfully added to wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 product:
 *                   type: string
 *                 title:
 *                   type: string
 *                 price:
 *                   type: number
 *                 image:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Item already in wishlist or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Item already in wishlist"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
    const { userId, productId, title, price, image } = req.body;

    try {
        // Check if already exists
        const exists = await Wishlist.findOne({
            user: userId,
            $or: [{ product: productId }, { title: title }] // loose check
        });

        if (exists) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }

        const newItem = new Wishlist({
            user: userId,
            product: productId,
            title,
            price,
            image
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Remove item from wishlist
 *     description: Delete a specific item from user's wishlist by item ID
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wishlist item ID to delete
 *         example: "507f191e810c19729de860ea"
 *     responses:
 *       200:
 *         description: Item removed from wishlist successfully
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
        const item = await Wishlist.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
