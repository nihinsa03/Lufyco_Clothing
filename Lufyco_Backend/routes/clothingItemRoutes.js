const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');

/**
 * @route   GET /api/clothing-items
 * @desc    Get clothing items with optional filters
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      category,
      gender,
      color,
      size,
      isSale,
      isNewArrival,
      search,
      sortBy,
      limit,
    } = req.query;

    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by gender
    if (gender) {
      query.gender = gender;
    }

    // Filter by color
    if (color) {
      query.color = color;
    }

    // Filter by size
    if (size) {
      query.size = size;
    }

    // Fix: use snake_case fields because DB/model uses these
    if (isSale === 'true') {
      query.is_sale = true;
    }

    if (isNewArrival === 'true') {
      query.is_new_arrival = true;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { image_title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sub_category: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOptions = { created_at: -1 };

    if (sortBy === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'rating_desc') {
      sortOptions = { rating: -1 };
    } else if (sortBy === 'newest') {
      sortOptions = { created_at: -1 };
    }

    let dbQuery = ClothingItem.find(query).sort(sortOptions);

    // Optional limit
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        dbQuery = dbQuery.limit(parsedLimit);
      }
    }

    const items = await dbQuery;

    // Consistent response mapping
    const formattedItems = items.map((item) => ({
      _id: item._id,
      image_title: item.image_title || '',
      image_name: item.image_name || '',
      image_file_name: item.image_file_name || '',
      file_path: item.file_path || '',
      description: item.description || '',
      category: item.category || '',
      sub_category: item.sub_category || '',
      type: item.type || '',
      gender: item.gender || '',
      occasion: item.occasion || '',
      color: item.color || '',
      size: item.size || '',
      price: item.price || 0,
      qty: item.qty || 0,
      rating: item.rating || 0,
      is_sale: item.is_sale || false,
      is_new_arrival: item.is_new_arrival || false,
      created_at: item.created_at || null,
      updated_at: item.updated_at || null,
    }));

    res.status(200).json(formattedItems);
  } catch (error) {
    console.error('Error fetching clothing items:', error.message);
    res.status(500).json({
      message: 'Failed to fetch clothing items',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/clothing-items/:id
 * @desc    Get single clothing item by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }

    res.status(200).json({
      _id: item._id,
      image_title: item.image_title || '',
      image_name: item.image_name || '',
      image_file_name: item.image_file_name || '',
      file_path: item.file_path || '',
      description: item.description || '',
      category: item.category || '',
      sub_category: item.sub_category || '',
      type: item.type || '',
      gender: item.gender || '',
      occasion: item.occasion || '',
      color: item.color || '',
      size: item.size || '',
      price: item.price || 0,
      qty: item.qty || 0,
      rating: item.rating || 0,
      is_sale: item.is_sale || false,
      is_new_arrival: item.is_new_arrival || false,
      created_at: item.created_at || null,
      updated_at: item.updated_at || null,
    });
  } catch (error) {
    console.error('Error fetching clothing item:', error.message);
    res.status(500).json({
      message: 'Failed to fetch clothing item',
      error: error.message,
    });
  }
});

module.exports = router;