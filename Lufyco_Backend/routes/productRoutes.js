const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { extractFeatures } = require('../services/mlFeatureExtractor');
const axios = require('axios');

// @route   GET /api/products
// @desc    Get all products with filtering, search, and sorting
router.get('/', async (req, res) => {
    try {
        const { gender, category, subCategory, type, search, isSale, sort } = req.query;
        let query = {};

        if (gender) query.gender = gender;
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;
        if (type) query.type = type;

        // Search in name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sale filter: if isSale=true, ensure compareAtPrice exists and is > price
        if (isSale === 'true') {
            query.compareAtPrice = { $gt: 0 }; // simplified check, ideal is strictly > price
            query.$expr = { $gt: ["$compareAtPrice", "$price"] };
        }

        let productsQuery = Product.find(query);

        // Sorting
        if (sort) {
            if (sort === 'price_low_to_high') productsQuery = productsQuery.sort({ price: 1 });
            else if (sort === 'price_high_to_low') productsQuery = productsQuery.sort({ price: -1 });
            else if (sort === 'whats_new') productsQuery = productsQuery.sort({ createdAt: -1 });
            else if (sort === 'popularity') productsQuery = productsQuery.sort({ reviewsCount: -1 });
        }

        const products = await productsQuery;

        // Map to match Expo Frontend Product Interface
        const hostUrl = `${req.protocol}://${req.get('host')}`;
        
        const mappedProducts = products.map(p => {
            const isLocal = p.image && p.image.startsWith('/uploads');
            const fullImageUrl = isLocal ? `${hostUrl}${p.image}` : p.image;

            return {
                id: p._id.toString(),
                title: p.name,
                name: p.name,
                price: p.price,
                description: p.description,
                images: [fullImageUrl], // Wrap string in array for frontend carousel and logic
                categoryId: p.category, 
                category: p.category,
                tags: [p.category.toLowerCase(), p.type ? p.type.toLowerCase() : 'fashion'],
                colors: p.colors && p.colors.length > 0 ? p.colors : ['#000000', '#FFFFFF'],
                sizes: ['S', 'M', 'L', 'XL'],
                isNewArrival: p.isNewArrival || false,
                isPopular: p.reviewsCount > 5 || p.price > 2000, 
                rating: p.rating || 4.5,
                reviews: p.reviewsCount || Math.floor(Math.random() * 50) + 10,
                oldPrice: p.compareAtPrice,
                featureVector: p.featureVector
            };
        });

        res.json({ products: mappedProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/categories
// @desc    Get dynamically aggregated categories from products
router.get('/categories', async (req, res) => {
    try {
        const hostUrl = `${req.protocol}://${req.get('host')}`;
        
        const categories = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    image: { $first: "$image" },
                    gender: { $first: "$gender" }
                }
            }
        ]);

        const mappedCategories = categories.map((cat, index) => {
            const isLocal = cat.image && cat.image.startsWith('/uploads');
            const fullImageUrl = isLocal ? `${hostUrl}${cat.image}` : cat.image;

            return {
                id: `cat_dyn_${index}`, // Unique dynamic ID
                name: cat._id || 'Uncategorized',
                image: fullImageUrl,
                gender: cat.gender ? cat.gender.toLowerCase() : 'unisex'
            };
        });

        // Filter out null names if any
        res.json({ categories: mappedCategories.filter(c => c.name !== 'Uncategorized') });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const p = await Product.findById(req.params.id);
        if (!p) return res.status(404).json({ message: 'Product not found' });

        const hostUrl = `${req.protocol}://${req.get('host')}`;
        const isLocal = p.image && p.image.startsWith('/uploads');
        const fullImageUrl = isLocal ? `${hostUrl}${p.image}` : p.image;

        res.json({
            id: p._id.toString(),
            title: p.name,
            name: p.name,
            price: p.price,
            description: p.description,
            images: [fullImageUrl],
            categoryId: p.category,
            category: p.category,
            subCategory: p.subCategory,
            type: p.type,
            gender: p.gender,
            tags: [p.category.toLowerCase(), p.type ? p.type.toLowerCase() : 'fashion'],
            colors: p.colors && p.colors.length > 0 ? p.colors : ['#000000', '#FFFFFF'],
            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL'],
            isNewArrival: p.isNewArrival || false,
            isPopular: p.reviewsCount > 5 || p.price > 2000,
            rating: p.rating || 4.5,
            reviews: p.reviewsCount || 0,
            reviewsCount: p.reviewsCount || 0,
            oldPrice: p.compareAtPrice,
            featureVector: p.featureVector
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products
// @desc    Create a product
router.post('/', async (req, res) => {
    const { name, price, description, image, category } = req.body;

    try {
        const product = new Product({
            name,
            price,
            description,
            image,
            category,
        });

        // Extract features for AI similarity search
        if (image && image.startsWith('http')) {
            try {
                const response = await axios.get(image, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data);
                const features = await extractFeatures(buffer);
                product.featureVector = features;
                console.log(`🤖 Auto-indexed new product: ${name}`);
            } catch (err) {
                console.warn(`⚠️ Failed to auto-index new product ${name}:`, err.message);
            }
        }

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
