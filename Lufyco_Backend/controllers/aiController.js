const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/Product');
const SavedLook = require('../models/SavedLook');
const { uploadToCloudinary, extractDominantColorLocal } = require('../services/imageService');
const { generateOutfit } = require('../services/outfitService');
const { extractFeatures, findSimilarProducts } = require('../services/mlFeatureExtractor');

/**
 * Guess clothing category from image using pixel region analysis via sharp.
 * Samples the top-third vs bottom-third of the image.
 * Estimates whether the photo shows a top, bottom, dress etc.
 * @param {Buffer} imageBuffer
 * @returns {Promise<string>} category name
 */
const guessCategoryFromImage = async (imageBuffer) => {
    try {
        const { data, info } = await sharp(imageBuffer)
            .resize(100, 150, { fit: 'fill' })
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixels = data;
        const width = info.width;
        const height = info.height;
        const channels = 3;

        // Helper: is pixel approximately skin tone?
        const isSkin = (r, g, b) =>
            r > 80 && g > 50 && b > 30 &&
            r > g && r > b &&
            (r - g) > 10 &&
            r < 250;

        let topSkin = 0, topCloth = 0, botSkin = 0, botCloth = 0;
        const third = Math.floor(height / 3);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * channels;
                const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
                const skin = isSkin(r, g, b);

                if (y < third) {
                    skin ? topSkin++ : topCloth++;
                } else if (y >= height - third) {
                    skin ? botSkin++ : botCloth++;
                }
            }
        }

        const topTotal = topSkin + topCloth || 1;
        const botTotal = botSkin + botCloth || 1;
        const topSkinRatio = topSkin / topTotal;
        const botSkinRatio = botSkin / botTotal;

        // Classify based on where clothing is dominant
        if (topSkinRatio < 0.3 && botSkinRatio > 0.3) {
            // Top region is mostly clothing, bottom is mostly skin → Tops (shirt etc.)
            return "Men's Wear"; // could be tops/shirt
        }
        if (botSkinRatio < 0.3 && topSkinRatio > 0.3) {
            // Bottom is mostly clothing, top is skin → Bottoms
            return "Women's Wear";
        }
        if (topSkinRatio < 0.3 && botSkinRatio < 0.3) {
            // Both sections are mostly clothing → Dress/Outerwear
            return "Women's Wear";
        }

        // Default
        return "Men's Wear";
    } catch (err) {
        console.warn('⚠️ Category guess failed:', err.message);
        return "Men's Wear";
    }
};

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

        // Run color extraction and category guessing in parallel for speed
        const [color, pixelCategory] = await Promise.all([
            extractDominantColorLocal(req.file.buffer).catch(err => {
                console.warn('⚠️ Color extraction failed:', err.message);
                return '#000000';
            }),
            guessCategoryFromImage(req.file.buffer).catch(err => {
                console.warn('⚠️ Category guess failed:', err.message);
                return "Men's Wear";
            })
        ]);

        console.log(`🎨 Detected color: ${color}`);
        console.log(`👕 Pixel-based category guess: ${pixelCategory}`);

        // Try ML product similarity as an optional override
        let category = pixelCategory;
        try {
            const queryFeatures = await extractFeatures(req.file.buffer);
            const allProducts = await Product.find({ featureVector: { $exists: true, $not: { $size: 0 } } }).lean();
            if (allProducts.length > 0) {
                const similarProducts = findSimilarProducts(queryFeatures, allProducts, 3);
                // Only override if it's a genuine ML result (not fallback random)
                if (similarProducts.length > 0 && !similarProducts[0].fallback && similarProducts[0].product.category) {
                    category = similarProducts[0].product.category;
                    console.log(`🤖 ML override category: ${category}`);
                }
            }
        } catch (mlError) {
            console.warn('⚠️ ML extraction skipped:', mlError.message);
        }

        res.json({
            category,
            color,
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
