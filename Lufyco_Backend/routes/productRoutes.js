const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: |
 *       Retrieve all products with optional filtering, searching, and sorting capabilities.
 *       Supports filtering by gender, category, subcategory, type, and sale status.
 *       Includes text search across product names and descriptions.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [men, women, unisex]
 *         description: Filter by gender
 *         example: men
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *         example: Clothing
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Filter by subcategory
 *         example: T-Shirts
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by type
 *         example: Casual
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name or description (case-insensitive)
 *         example: cotton
 *       - in: query
 *         name: isSale
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filter products on sale (compareAtPrice > price)
 *         example: 'true'
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_low_to_high, price_high_to_low, whats_new, popularity]
 *         description: Sort products
 *         example: price_low_to_high
 *     responses:
 *       200:
 *         description: Successful retrieval of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 name: "Classic Cotton T-Shirt"
 *                 price: 2500
 *                 compareAtPrice: 3500
 *                 description: "Comfortable cotton t-shirt"
 *                 image: "https://example.com/tshirt.jpg"
 *                 gender: "men"
 *                 category: "Clothing"
 *                 subCategory: "T-Shirts"
 *                 type: "Casual"
 *                 sizes: ["S", "M", "L", "XL"]
 *                 colors: ["Black", "White"]
 *                 rating: 4.5
 *                 reviewsCount: 128
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: |
 *       Create a new product in the catalog.
 *       **Note:** This endpoint should be admin-protected in production.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: Summer Casual Shirt
 *               price:
 *                 type: number
 *                 description: Product price in LKR
 *                 example: 3500
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: Lightweight and breathable summer shirt
 *               image:
 *                 type: string
 *                 description: Product image URL
 *                 example: https://example.com/images/shirt.jpg
 *               category:
 *                 type: string
 *                 description: Product category
 *                 example: Clothing
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - Invalid product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
