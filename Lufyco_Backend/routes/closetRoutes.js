const express = require('express');
const router = express.Router();
const ClosetItem = require('../models/ClosetItem');
const { extractFeatures } = require('../services/mlFeatureExtractor');
const axios = require('axios'); // For fetching image from URL if needed

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
    const { userId, name, category, image, notes, color, occasion, user } = req.body;

    try {
        const newItem = new ClosetItem({
            user: userId, // might be null/undefined if not enforcing auth
            name,
            category,
            image,
            notes,
            color,
            occasion,
            user,
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/closet/:id
// @desc    Update a closet item
router.put('/:id', async (req, res) => {
    try {
        const item = await ClosetItem.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

// @route   POST /api/closet/train
// @desc    Extract visual features for an item (AI Training trigger)
router.post('/train', async (req, res) => {
    try {
        const { itemId } = req.body;
        const item = await ClosetItem.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        console.log(`🤖 Training item: ${item.name} (${itemId})`);

        let buffer;
        if (item.image.startsWith('http')) {
            const response = await axios.get(item.image, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data);
        } else if (item.image.startsWith('data:image')) {
            const base64Data = item.image.split(',')[1];
            buffer = Buffer.from(base64Data, 'base64');
        } else {
            return res.status(400).json({ message: 'Unsupported image format' });
        }

        const features = await extractFeatures(buffer);
        item.featureVector = features;
        await item.save();

        res.json({ success: true, featureVectorDim: features.length });
    } catch (error) {
        console.error('❌ Closet training failed:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
