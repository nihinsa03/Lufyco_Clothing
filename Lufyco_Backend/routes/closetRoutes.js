const express = require('express');
const router = express.Router();
const ClosetItem = require('../models/ClosetItem');

// @route   GET /api/closet
// @desc    Get all closet items (optionally filter by user if we passed userId in query)
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

// @route   POST /api/closet
// @desc    Add item to closet
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

// @route   DELETE /api/closet/:id
// @desc    Delete closet item
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
