const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
    api_key: process.env.CLOUDINARY_API_KEY || 'demo',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} imageBuffer - Image buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (imageBuffer, folder = 'lufyco/search') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        uploadStream.end(imageBuffer);
    });
};

/**
 * Extract dominant colors from image URL
 * @param {String} imageUrl - Cloudinary image URL
 * @returns {Promise<Array>} Array of dominant colors
 */
const extractColors = async (imageUrl) => {
    try {
        // Use Cloudinary's auto_color feature
        const analysis = await cloudinary.api.resource(imageUrl, {
            colors: true,
            max_results: 5
        });

        return analysis.colors || [];
    } catch (error) {
        console.error('Color extraction error:', error);
        return [];
    }
};

/**
 * Calculate color similarity between two color arrays
 * @param {Array} colors1 - First color array
 * @param {Array} colors2 - Second color array
 * @returns {Number} Similarity score (0-100)
 */
const calculateColorSimilarity = (colors1, colors2) => {
    if (!colors1?.length || !colors2?.length) return 0;

    let totalSimilarity = 0;
    let comparisons = 0;

    colors1.slice(0, 3).forEach(color1 => {
        colors2.slice(0, 3).forEach(color2 => {
            // Simple hex color comparison
            const similarity = compareHexColors(color1, color2);
            totalSimilarity += similarity;
            comparisons++;
        });
    });

    return comparisons > 0 ? Math.round(totalSimilarity / comparisons) : 0;
};

/**
 * Compare two hex colors for similarity
 * @param {String} hex1 - First hex color
 * @param {String} hex2 - Second hex color
 * @returns {Number} Similarity score (0-100)
 */
const compareHexColors = (hex1, hex2) => {
    // Convert hex to RGB
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    if (!rgb1 || !rgb2) return 0;

    // Calculate Euclidean distance
    const distance = Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );

    // Normalize to 0-100 (max distance is ~441)
    return Math.max(0, 100 - (distance / 441) * 100);
};

/**
 * Convert hex color to RGB
 * @param {String} hex - Hex color code
 * @returns {Object} RGB object {r, g, b}
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

module.exports = {
    uploadToCloudinary,
    extractColors,
    calculateColorSimilarity,
    compareHexColors
};
