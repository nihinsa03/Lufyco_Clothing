const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { extractFeatures } = require('../services/mlFeatureExtractor');
const axios = require('axios');

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product browsing, filtering, and management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "67f123abc456def789gh123"
 *         name:
 *           type: string
 *           example: "Blue Shirt"
 *         price:
 *           type: number
 *           example: 3500
 *         description:
 *           type: string
 *           example: "Stylish cotton shirt"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *           example: "Men"
 *         rating:
 *           type: number
 *           example: 4.5
 *         reviews:
 *           type: number
 *           example: 25
 *         oldPrice:
 *           type: number
 *           example: 4500
 *         quantity:
 *           type: number
 *           example: 10
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           example: "Blue Shirt"
 *         price:
 *           type: number
 *           example: 3500
 *         description:
 *           type: string
 *           example: "Stylish cotton shirt"
 *         image:
 *           type: string
 *           example: "https://example.com/shirt.jpg"
 *         category:
 *           type: string
 *           example: "Men"
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Something went wrong"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filters and sorting
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isSale
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: price_low_to_high
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       500:
 *         description: Server error
 */
// GET /api/products
router.get('/', async (req, res) => {
    try {
        const { gender, category, subCategory, type, search, isSale, sort } = req.query;
        let query = {};

        if (gender) query.gender = gender;
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;
        if (type) query.type = type;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (isSale === 'true') {
            query.compareAtPrice = { $gt: 0 };
            query.$expr = { $gt: ["$compareAtPrice", "$price"] };
        }

        let productsQuery = Product.find(query);

        if (sort) {
            if (sort === 'price_low_to_high') productsQuery = productsQuery.sort({ price: 1 });
            else if (sort === 'price_high_to_low') productsQuery = productsQuery.sort({ price: -1 });
            else if (sort === 'whats_new') productsQuery = productsQuery.sort({ createdAt: -1 });
            else if (sort === 'popularity') productsQuery = productsQuery.sort({ reviewsCount: -1 });
        }

        const products = await productsQuery;

        const hostUrl = `${req.protocol}://${req.get('host')}`;

        const mappedProducts = products.map(p => {
            const isLocal = p.image && p.image.startsWith('/uploads');
            const fullImageUrl = isLocal ? `${hostUrl}${p.image}` : p.image;

            return {
                id: p._id,
                name: p.name,
                price: p.price,
                description: p.description,
                images: [fullImageUrl],
                category: p.category,
                rating: p.rating || 4.5,
                reviews: p.reviewsCount || 0,
                oldPrice: p.compareAtPrice,
                quantity: p.quantity || 0
            };
        });

        res.json({ products: mappedProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/getAllProducts:
 *   get:
 *     summary: Get all products without filters
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: All products fetched
 */
// GET ALL
router.get('/getAllProducts', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/byCategory:
 *   get:
 *     summary: Get products grouped by category
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products grouped successfully
 *       400:
 *         description: Missing category
 */
// BY CATEGORY
router.get('/byCategory', async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) {
            return res.status(400).json({ message: 'Missing category parameter' });
        }

        const products = await Product.find({ category });
        res.json({ category, products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/getCategories:
 *   get:
 *     summary: Get all unique categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Categories fetched
 */
router.get('/getCategories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get dynamic categories with images
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Dynamic categories fetched
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    image: { $first: "$image" },
                    gender: { $first: "$gender" }
                }
            }
        ]);

        res.json({ categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */
// CREATE PRODUCT
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

        if (image && image.startsWith('http')) {
            try {
                const response = await axios.get(image, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data);
                const features = await extractFeatures(buffer);
                product.featureVector = features;
            } catch (err) {
                console.warn(`Feature extraction failed:`, err.message);
            }
        }

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;