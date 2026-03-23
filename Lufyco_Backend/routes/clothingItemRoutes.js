const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');

// @route   GET /api/clothing-items
// @desc    Get all clothing items from clothing_items collection
router.get('/', async (req, res) => {
    try {
        const { category, gender, subCategory, type, isSale, isNewArrival, search } = req.query;
        let query = {};

        if (category)    query.category     = { $regex: category,    $options: 'i' };
        if (gender)      query.gender       = { $regex: gender,      $options: 'i' };
        if (subCategory) query.sub_category = { $regex: subCategory, $options: 'i' };
        if (type)        query.type         = { $regex: type,        $options: 'i' };
        if (isSale === 'true')       query.is_sale       = true;
        if (isNewArrival === 'true') query.is_new_arrival = true;

        if (search) {
            query.$or = [
                { image_title:  { $regex: search, $options: 'i' } },
                { description:  { $regex: search, $options: 'i' } },
                { category:     { $regex: search, $options: 'i' } },
                { sub_category: { $regex: search, $options: 'i' } },
                { type:         { $regex: search, $options: 'i' } },
            ];
        }

        const items = await ClothingItem.find(query);

        const hostUrl = `${req.protocol}://${req.get('host')}`;

        const mapped = items.map(item => {
            let imageUrl = '';
            if (item.file_path && item.file_path.startsWith('Images/')) {
                imageUrl = `${hostUrl}/${item.file_path}`;
            } else {
                const fileName = item.image_file_name || (item.file_path ? item.file_path.split('/').pop() : '');
                imageUrl = `${hostUrl}/uploads/products/${fileName}`;
            }

            return {
                id:           item._id.toString(),
                title:        item.image_title || item.image_file_name || `${item.category} Item`,
                name:         item.image_title || item.image_file_name || `${item.category} Item`,
                price:        item.price || 0,
                description:  item.description || '',
                images:       [imageUrl],
                categoryId:   item.category,
                category:     item.category,
                subCategory:  item.sub_category,
                type:         item.type,
                gender:       item.gender,
                occasion:     item.occasion,
                tags:         [
                    item.category,
                    item.type,
                    item.occasion,
                ].filter(Boolean).map(t => t.toLowerCase()),
                colors:       item.color ? [item.color] : ['#000000'],
                sizes:        item.size  ? item.size.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL'],
                rating:       item.rating || 4.5,
                reviews:      Math.floor(Math.random() * 80) + 20,
                isNewArrival: item.is_new_arrival || false,
                isSale:       item.is_sale       || false,
                qty:          item.qty          || 0,
            };
        });

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
        
        let imageUrl = '';
        if (item.file_path && item.file_path.startsWith('Images/')) {
            imageUrl = `${hostUrl}/${item.file_path}`;
        } else {
            const fileName = item.image_file_name || (item.file_path ? item.file_path.split('/').pop() : '');
            imageUrl = `${hostUrl}/uploads/products/${fileName}`;
        }

        res.json({
            id:           item._id.toString(),
            title:        item.image_title || item.image_file_name || `${item.category} Item`,
            name:         item.image_title || item.image_file_name || `${item.category} Item`,
            price:        item.price || 0,
            description:  item.description || '',
            images:       [imageUrl],
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
            reviews:      Math.floor(Math.random() * 80) + 20,
            isNewArrival: item.is_new_arrival || false,
            isSale:       item.is_sale       || false,
            qty:          item.qty          || 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
