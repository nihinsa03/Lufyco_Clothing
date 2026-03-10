const express = require('express');
const router = express.Router();
const {
    upload,
    imageSearch,
    extractImageDetails,
    recommendOutfit,
    getSavedLooks,
    saveLook,
    deleteSavedLook
} = require('../controllers/aiController');

// @route   POST /api/ai/image-search
// @desc    Search products by uploaded image
// @access  Public
router.post('/image-search', upload.single('image'), imageSearch);

// @route   POST /api/ai/extract-details
// @desc    Extract features from image
// @access  Private
router.post('/extract-details', upload.single('image'), extractImageDetails);

// @route   POST /api/ai/recommend-outfit
// @desc    Generate outfit recommendation
// @access  Private (userId in body for now)
router.post('/recommend-outfit', recommendOutfit);

// @route   GET /api/ai/saved-looks
// @desc    Get user's saved outfits
// @access  Private
router.get('/saved-looks', getSavedLooks);

// @route   POST /api/ai/saved-looks
// @desc    Save outfit combination
// @access  Private
router.post('/saved-looks', saveLook);

// @route   DELETE /api/ai/saved-looks/:id
// @desc    Delete saved outfit
// @access  Private
router.delete('/saved-looks/:id', deleteSavedLook);

module.exports = router;
