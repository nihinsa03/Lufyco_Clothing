const multer = require('multer');
const Product = require('../models/Product');
const SavedLook = require('../models/SavedLook');
const { uploadToCloudinary, extractDominantColorLocal } = require('../services/imageService');
const { generateOutfit } = require('../services/outfitService');
const { extractFeatures, findSimilarProducts } = require('../services/mlFeatureExtractor');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
        }
    }
});

/**
 * @route   POST /api/ai/image-search
 * @desc    Search for similar products using ML-powered image similarity
 * @access  Public
 */
const imageSearch = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        console.log('🔍 Processing image search...');

        // Optional: Try to upload image to Cloudinary (for logging/reference only)
        let uploadedImageUrl = null;
        let searchId = `search_${Date.now()}`;
        try {
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'lufyco/search');
            uploadedImageUrl = uploadResult.secure_url;
            searchId = uploadResult.public_id;
            console.log('✅ Image uploaded to Cloudinary');
        } catch (uploadErr) {
            console.warn('⚠️ Cloudinary upload skipped:', uploadErr.message);
        }

        // Get all products
        const allProducts = await Product.find().lean();
        console.log(`📦 Searching across ${allProducts.length} products`);

        if (allProducts.length === 0) {
            return res.json({
                searchId,
                uploadedImage: uploadedImageUrl,
                results: [],
                method: 'no_products',
                message: 'No products in the database to search against.'
            });
        }

        let queryFeatures = [];
        let method = 'fallback';

        // Try ML feature extraction (may fail if TF not properly loaded)
        try {
            queryFeatures = await extractFeatures(req.file.buffer);
            console.log(`✅ Extracted ${queryFeatures.length}-dim feature vector`);
            method = 'ml_features';
        } catch (mlError) {
            console.warn('⚠️ ML feature extraction failed, using fallback:', mlError.message);
        }

        // Find similar products (has built-in fallback if no feature vectors)
        const similarProducts = findSimilarProducts(queryFeatures, allProducts, 5);

        // Format results
        const results = similarProducts.map(item => ({
            product: {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image || item.product.images?.[0],
                category: item.product.category,
                type: item.product.type
            },
            similarity: item.similarity,
            matchedFeatures: item.fallback ? ['category_match'] : ['visual_features', 'deep_learning']
        }));

        const fs = require('fs');
        fs.appendFileSync('search_debug.log', `[${new Date().toISOString()}] Search complete. Found ${results.length} products. Method: ${method}\n`);

        console.log(`✅ Found ${results.length} similar products (method: ${method})`);

        res.json({
            searchId,
            uploadedImage: uploadedImageUrl,
            results,
            method,
            featureVectorDim: queryFeatures.length
        });

    } catch (error) {
        require('fs').appendFileSync('search_debug.log', `[${new Date().toISOString()}] ERROR: ${error.message}\n${error.stack}\n`);
        console.error('❌ Image search error:', error);
        res.status(500).json({ message: error.message || 'Image search failed' });
    }
};

/**
 * @route   POST /api/ai/extract-details
 * @desc    Extract category and color from uploaded image for closet
 * @access  Private
 */
const extractImageDetails = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        console.log('🔍 Extracting image details for closet...');

        // 1. Try ML feature extraction
        let queryFeatures = [];
        let category = 'Tops'; // Default fallback
        let color = '#000000'; // Default fallback

        try {
            queryFeatures = await extractFeatures(req.file.buffer);

            // Find similar products to guess category
            const allProducts = await Product.find().lean();
            if (allProducts.length > 0) {
                const similarProducts = findSimilarProducts(queryFeatures, allProducts, 3);
                if (similarProducts.length > 0 && similarProducts[0].product.category) {
                    category = similarProducts[0].product.category;
                }
            }
        } catch (mlError) {
            console.warn('⚠️ ML extraction failed for details:', mlError.message);
        }

        // 2. Exact color extraction using sharp
        try {
            color = await extractDominantColorLocal(req.file.buffer);
            console.log(`🎨 Extracted exact map color: ${color}`);
        } catch (colorErr) {
            console.warn('⚠️ Color extraction failed, using default:', colorErr.message);
        }

        res.json({
            category,
            color,
            featureVector: queryFeatures
        });

    } catch (error) {
        console.error('❌ Extract details error:', error);
        res.status(500).json({ message: error.message || 'Details extraction failed' });
    }
};

/**
 * @route   POST /api/ai/recommend-outfit
 * @desc    Generate AI outfit recommendation
 * @access  Private
 */
const recommendOutfit = async (req, res) => {
    try {
        const { userId, mood, occasion, weather, preferredColors, selectedDate } = req.body;

        if (!occasion) {
            return res.status(400).json({ message: 'Occasion is required' });
        }

        // Generate outfit
        const outfit = await generateOutfit({
            mood,
            occasion,
            weather,
            userId
        });

        res.json({
            outfitId: `outfit_${Date.now()}`,
            ...outfit
        });

    } catch (error) {
        console.error('Outfit recommendation error:', error);
        res.status(500).json({ message: error.message || 'Failed to generate outfit' });
    }
};

/**
 * @route   GET /api/ai/saved-looks
 * @desc    Get user's saved outfits
 * @access  Private
 */
const getSavedLooks = async (req, res) => {
    try {
        const { userId, occasion, upcoming } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        let query = { user: userId };

        // Filter by occasion
        if (occasion) {
            query.occasion = occasion;
        }

        // Filter upcoming events only
        if (upcoming === 'true') {
            query.eventDate = { $gte: new Date() };
        }

        const savedLooks = await SavedLook.find(query)
            .populate('items')
            .sort({ eventDate: 1, createdAt: -1 });

        res.json(savedLooks);

    } catch (error) {
        console.error('Get saved looks error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch saved looks' });
    }
};

/**
 * @route   POST /api/ai/saved-looks
 * @desc    Save outfit combination
 * @access  Private
 */
const saveLook = async (req, res) => {
    try {
        const { userId, outfitName, occasion, items, eventDate, weather, mood, notes } = req.body;

        if (!userId || !outfitName || !occasion || !items?.length) {
            return res.status(400).json({
                message: 'User ID, outfit name, occasion, and items are required'
            });
        }

        const savedLook = new SavedLook({
            user: userId,
            outfitName,
            occasion,
            items,
            eventDate,
            weather,
            mood,
            notes
        });

        await savedLook.save();

        const populated = await SavedLook.findById(savedLook._id).populate('items');

        res.status(201).json(populated);

    } catch (error) {
        console.error('Save look error:', error);
        res.status(500).json({ message: error.message || 'Failed to save look' });
    }
};

/**
 * @route   DELETE /api/ai/saved-looks/:id
 * @desc    Delete saved outfit
 * @access  Private
 */
const deleteSavedLook = async (req, res) => {
    try {
        const { id } = req.params;

        const look = await SavedLook.findById(id);
        if (!look) {
            return res.status(404).json({ message: 'Saved look not found' });
        }

        await look.deleteOne();

        res.json({ message: 'Look deleted successfully' });

    } catch (error) {
        console.error('Delete look error:', error);
        res.status(500).json({ message: error.message || 'Failed to delete look' });
    }
};

module.exports = {
    upload,
    imageSearch,
    extractImageDetails,
    recommendOutfit,
    getSavedLooks,
    saveLook,
    deleteSavedLook
};
