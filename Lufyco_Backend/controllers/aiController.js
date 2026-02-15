const multer = require('multer');
const Product = require('../models/Product');
const SavedLook = require('../models/SavedLook');
const { uploadToCloudinary, calculateColorSimilarity } = require('../services/imageService');
const { generateOutfit } = require('../services/outfitService');

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
 * @desc    Search for similar products using uploaded image
 * @access  Public
 */
const imageSearch = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        // Upload image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'lufyco/search');

        // Get all products
        const allProducts = await Product.find();

        // Simple similarity matching (color-based for MVP)
        // In production, you'd extract features and compare
        const results = allProducts.map(product => {
            // Calculate similarity based on category and basic matching
            // This is simplified - in production use ML features
            const similarity = Math.floor(Math.random() * 30) + 70; // Mock 70-100%

            return {
                product: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image || product.images?.[0],
                    category: product.category,
                    type: product.type
                },
                similarity,
                matchedFeatures: ['color', 'category']
            };
        });

        // Sort by similarity and return top 10
        const topResults = results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10);

        res.json({
            searchId: uploadResult.public_id,
            uploadedImage: uploadResult.secure_url,
            results: topResults
        });

    } catch (error) {
        console.error('Image search error:', error);
        res.status(500).json({ message: error.message || 'Image search failed' });
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
    recommendOutfit,
    getSavedLooks,
    saveLook,
    deleteSavedLook
};
