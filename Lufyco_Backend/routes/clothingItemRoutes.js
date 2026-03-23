const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');

// @route   GET /api/clothing-items
// @desc    Get all clothing items from clothing_items collection
router.get('/', async (req, res) => {
    try {
        const { category, gender, isSale, isNewArrival, search } = req.query;
        let query = {};

        if (category)     query.category = { $regex: category, $options: 'i' };
        if (gender)       query.gender   = { $regex: gender,   $options: 'i' };
        if (isSale === 'true')       query.isSale       = true;
        if (isNewArrival === 'true') query.isNewArrival = true;

        if (search) {
            query.$or = [
                { image_name:   { $regex: search, $options: 'i' } },
                { description:  { $regex: search, $options: 'i' } },
                { category:     { $regex: search, $options: 'i' } },
                { sub_category: { $regex: search, $options: 'i' } },
                { type:         { $regex: search, $options: 'i' } },
            ];
        }

        const items = await ClothingItem.find(query);

        const hostUrl = `${req.protocol}://${req.get('host')}`;

        const mapped = items.map(item => ({
            id:           item._id.toString(),
            title:        item.image_name || `${item.category} Item`,
            name:         item.image_name || `${item.category} Item`,
            price:        item.price || 0,
            description:  item.description || '',
            images:       [`${hostUrl}/images/clothing/${item.image_name}`],
            categoryId:   item.category,
            category:     item.category,
            subCategory:  item.sub_category,
            type:         item.type,
            gender:       item.gender,
            occasion:     item.occasion,
            tags:         [
                item.category  ? item.category.toLowerCase()  : '',
                item.type      ? item.type.toLowerCase()      : '',
                item.occasion  ? item.occasion.toLowerCase()  : '',
            ].filter(Boolean),
            colors:       item.color ? [item.color] : ['#000000'],
            sizes:        item.size  ? item.size.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL'],
            rating:       item.rating || 4.5,
            reviews:      Math.floor(Math.random() * 50) + 10,
            isNewArrival: item.isNewArrival || false,
            isSale:       item.isSale       || false,
            qty:          item.qty          || 0,
        }));

        res.json({ products: mapped, total: mapped.length });
    } catch (error) {
        console.error('[ClothingItems] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/clothing-items/:id
// @desc    Get single clothing item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await ClothingItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const hostUrl = `${req.protocol}://${req.get('host')}`;

        res.json({
            id:           item._id.toString(),
            title:        item.image_name || `${item.category} Item`,
            name:         item.image_name || `${item.category} Item`,
            price:        item.price || 0,
            description:  item.description || '',
            images:       [`${hostUrl}/images/clothing/${item.image_name}`],
            categoryId:   item.category,
            category:     item.category,
            subCategory:  item.sub_category,
            type:         item.type,
            gender:       item.gender,
            occasion:     item.occasion,
            tags:         [item.category, item.type, item.occasion].filter(Boolean).map(t => t.toLowerCase()),
            colors:       item.color ? [item.color] : ['#000000'],
            sizes:        item.size  ? item.size.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL'],
            rating:       item.rating || 4.5,
            reviews:      0,
            isNewArrival: item.isNewArrival || false,
            isSale:       item.isSale       || false,
            qty:          item.qty          || 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
