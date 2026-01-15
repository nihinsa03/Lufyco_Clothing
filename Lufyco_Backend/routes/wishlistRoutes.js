const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// @route   GET /api/wishlist
// @desc    Get all wishlist items for a user
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

// @route   POST /api/wishlist
// @desc    Add item to wishlist
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

// @route   DELETE /api/wishlist/:id
// @desc    Remove from wishlist
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
