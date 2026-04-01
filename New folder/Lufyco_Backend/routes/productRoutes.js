const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { extractFeatures } = require('../services/mlFeatureExtractor');
const axios = require('axios');
const buildImageUrl = require("../utils/buildImageUrl");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "67f123abc456def789gh012"
 *         title:
 *           type: string
 *           example: "Classic Men's T-Shirt"
 *         name:
 *           type: string
 *           example: "Classic Men's T-Shirt"
 *         price:
 *           type: number
 *           example: 2500
 *         description:
 *           type: string
 *           example: "A comfortable classic t-shirt for men."
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "https://example.com/image.jpg"
 *         categoryId:
 *           type: string
 *           example: "Men"
 *         category:
 *           type: string
 *           example: "Men"
 *         subCategory:
 *           type: string
 *           example: "Tops"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["men", "t-shirt"]
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["#000000", "#FFFFFF"]
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["S", "M", "L", "XL"]
 *         isNewArrival:
 *           type: boolean
 *           example: true
 *         isPopular:
 *           type: boolean
 *           example: true
 *         rating:
 *           type: number
 *           example: 4.5
 *         reviews:
 *           type: number
 *           example: 12
 *         oldPrice:
 *           type: number
 *           example: 3000
 *         featureVector:
 *           type: array
 *           items:
 *             type: number
 *         occasion:
 *           type: string
 *           example: "casual"
 *         quantity:
 *           type: number
 *           example: 18
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - image
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: "Classic Men's T-Shirt"
 *         price:
 *           type: number
 *           example: 2500
 *         description:
 *           type: string
 *           example: "A comfortable classic t-shirt for men."
 *         image:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         category:
 *           type: string
 *           example: "Men"
 *
 *     ProductsListResponse:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductResponse'
 *
 *     CategoriesResponse:
 *       type: object
 *       properties:
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Men", "Women", "Kids"]
 *
 *     DynamicCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cat_dyn_0"
 *         name:
 *           type: string
 *           example: "Men"
 *         image:
 *           type: string
 *           example: "https://example.com/cat.jpg"
 *         gender:
 *           type: string
 *           example: "men"
 *
 *     DynamicCategoriesResponse:
 *       type: object
 *       properties:
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DynamicCategory'
 *
 *     GroupedProductsResponse:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           example: "Men"
 *         groups:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               occasion:
 *                 type: string
 *                 example: "casual"
 *               products:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductResponse'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering, search, and sorting
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: Filter by gender
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Filter by sub category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: isSale
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter sale items only
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_low_to_high, price_high_to_low, whats_new, popularity]
 *         description: Sort products
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsListResponse'
 *       500:
 *         description: Server error
 */
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
        console.log('Product query:', query, 'Sort:', sort);
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
                id: p._id,
                title: p.name,
                name: p.name,
                price: p.price,
                description: p.description,
                images: buildImageUrl(p.image), // Wrap string in array for frontend carousel and logic
                categoryId: p.category, 
                category: p.category,
                tags: [p.category.toLowerCase(), p.type ? p.type.toLowerCase() : 'fashion'],
                colors: p.colors && p.colors.length > 0 ? p.colors : ['#000000', '#FFFFFF'],
                sizes: ['S', 'M', 'L', 'XL'],
                isNewArrival: true, // Defaulting flags to true to populate "Latest Products"
                isPopular: p.reviewsCount > 5 || p.price > 2000, 
                rating: p.rating || 4.5,
                reviews: p.reviewsCount || Math.floor(Math.random() * 50) + 10,
                oldPrice: p.compareAtPrice,
                featureVector: p.featureVector,
                occasion: p.occasion || 'Uncategorized',
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
 *         description: All products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsListResponse'
 *       500:
 *         description: Server error
 */
// @route   GET /api/products/getAllProducts
// @desc    Get all products without any filters
router.get('/getAllProducts', async (req, res) => {
    try {
        const products = await Product.find({});

        const mappedProducts = products.map(p => {

            return {
                id: p._id,
                title: p.name,
                name: p.name,
                price: p.price,
                description: p.description,
                images: buildImageUrl(p.image),
                categoryId: p.category, 
                category: p.category,
                tags: [p.category.toLowerCase(), p.type ? p.type.toLowerCase() : 'fashion'],
                colors: p.colors && p.colors.length > 0 ? p.colors : ['#000000', '#FFFFFF'],
                sizes: ['S', 'M', 'L', 'XL'],
                isNewArrival: true,
                isPopular: p.reviewsCount > 5 || p.price > 2000, 
                rating: p.rating || 4.5,
                reviews: p.reviewsCount || Math.floor(Math.random() * 50) + 10,
                oldPrice: p.compareAtPrice,
                featureVector: p.featureVector,
                occasion: p.occasion || 'Uncategorized',
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
 * /api/products/byCategory:
 *   get:
 *     summary: Get products for a category grouped by occasion
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: Grouped products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupedProductsResponse'
 *       400:
 *         description: Missing category parameter
 *       500:
 *         description: Server error
 */
// @route   GET /api/products/byCategory
// @desc    Get products for a category grouped by subCategory
// @query   ?category=<categoryName>
router.get('/byCategory', async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) {
            return res.status(400).json({ message: 'Missing category parameter' });
        }

        const products = await Product.find({ category });

        const mappedProducts = products.map(p => {

            return {
                id: p._id,
                title: p.name,
                name: p.name,
                price: p.price,
                description: p.description,
                images: buildImageUrl(p.image),
                categoryId: p.category,
                category: p.category,
                subCategory: p.subCategory,
                tags: [p.category.toLowerCase(), p.type ? p.type.toLowerCase() : 'fashion'],
                colors: p.colors && p.colors.length > 0 ? p.colors : ['#000000', '#FFFFFF'],
                sizes: ['S', 'M', 'L', 'XL'],
                isNewArrival: true,
                isPopular: p.reviewsCount > 5 || p.price > 2000,
                rating: p.rating || 4.5,
                reviews: p.reviewsCount || Math.floor(Math.random() * 50) + 10,
                oldPrice: p.compareAtPrice,
                featureVector: p.featureVector,
                occasion: p.occasion || 'Uncategorized',
                quantity: p.quantity || 0
            };
        });

        const groupedBySubCategory = mappedProducts.reduce((acc, product) => {
            const key = product.occasion || 'Uncategorized';
            if (!acc[key]) acc[key] = [];
            acc[key].push(product);
            return acc;
        }, {});

        const grouped = Object.entries(groupedBySubCategory).map(([occasion, items]) => ({
            occasion,
            products: items,
        }));

        res.json({ category, groups: grouped });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/getCategories:
 *   get:
 *     summary: Get all distinct product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesResponse'
 *       500:
 *         description: Server error
 */
// @route   GET /api/products/getCategories
// @desc    Get all distinct categories from products
router.get('/getCategories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        
        res.json({ categories: categories.filter(cat => cat !== null && cat !== undefined) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get dynamically aggregated categories from products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Dynamic categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DynamicCategoriesResponse'
 *       500:
 *         description: Server error
 */
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


            return {
                id: `cat_dyn_${index}`, // Unique dynamic ID
                name: cat._id || 'Uncategorized',
                image: buildImageUrl(cat.image),
                gender: cat.gender ? cat.gender.toLowerCase() : 'unisex'
            };
        });

        // Filter out null names if any
        res.json({ categories: mappedCategories.filter(c => c.name !== 'Uncategorized') });
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
 *         description: Invalid request
 */
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


router.get('/byCategoryUpdate', async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ message: 'Missing category parameter' });
        }

        // Fetch products
        const products = await Product.find({ category });

        const hostUrl = `${req.protocol}://${req.get('host')}`;

        // Map products
        const mappedProducts = products.map(p => {
            const isLocal = p.image && p.image.startsWith('/uploads');
            const fullImageUrl = isLocal ? `${hostUrl}${p.image}` : p.image;

            return {
                id: p._id,
                title: p.name,
                name: p.name,
                price: p.price,
                description: p.description,
                images: buildImageUrl(p.image),
                categoryId: p.category,
                category: p.category,
                subCategory: p.subCategory,
                tags: [
                    p.category?.toLowerCase(),
                    p.type ? p.type.toLowerCase() : 'fashion'
                ],
                colors: p.colors && p.colors.length > 0 ? p.colors : ['#000000', '#FFFFFF'],
                sizes: ['S', 'M', 'L', 'XL'],
                isNewArrival: true,
                isPopular: p.reviewsCount > 5 || p.price > 2000,
                rating: p.rating || 4.5,
                reviews: p.reviewsCount || Math.floor(Math.random() * 50) + 10,
                oldPrice: p.compareAtPrice,
                featureVector: p.featureVector,
                occasion: p.occasion || 'Uncategorized',
                quantity: p.quantity || 0
            };
        });

        // 🔥 GROUPING: Occasion → SubCategory
        const groupedByOccasion = mappedProducts.reduce((acc, product) => {
            const occasionKey = product.occasion || 'Uncategorized';
            const subCategoryKey = product.subCategory || 'Others';

            if (!acc[occasionKey]) {
                acc[occasionKey] = {};
            }

            if (!acc[occasionKey][subCategoryKey]) {
                acc[occasionKey][subCategoryKey] = [];
            }

            acc[occasionKey][subCategoryKey].push(product);

            return acc;
        }, {});

        // Convert to structured response
        let grouped = Object.entries(groupedByOccasion).map(([occasion, subCategories]) => ({
            occasion,
            subCategories: Object.entries(subCategories).map(([subCategory, items]) => ({
                subCategory,
                products: items
            }))
        }));

        // ✅ OPTIONAL: Sort occasions
        const OCCASION_ORDER = ['Casual', 'Formal', 'Party'];

        grouped.sort((a, b) => {
            const iA = OCCASION_ORDER.indexOf(a.occasion);
            const iB = OCCASION_ORDER.indexOf(b.occasion);

            return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB);
        });

        // ✅ OPTIONAL: Sort subcategories alphabetically
        grouped.forEach(group => {
            group.subCategories.sort((a, b) =>
                a.subCategory.localeCompare(b.subCategory)
            );
        });

        // Final response
        res.json({
            category,
            totalProducts: mappedProducts.length,
            groups: grouped
        });

    } catch (error) {
        console.error('❌ Error in /byCategory:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
