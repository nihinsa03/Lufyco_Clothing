const tf = require('@tensorflow/tfjs-node-gpu');
const fs = require('fs');
const path = require('path');

let customModel = null;
const MODEL_PATH = path.join(__dirname, '../models/fashion-similarity-model/model.json');

/**
 * Load custom trained model
 * @returns {Promise<void>}
 */
const loadCustomModel = async () => {
    if (customModel) return; // Model already loaded

    try {
        // Check if custom model exists
        if (fs.existsSync(MODEL_PATH)) {
            console.log('🎯 Loading custom trained fashion model...');
            customModel = await tf.loadLayersModel(`file://${MODEL_PATH}`);
            console.log('✅ Custom fashion model loaded successfully');
        } else {
            console.log('⚠️ Custom model not found, falling back to pre-trained MobileNet');
            console.log(`Expected path: ${MODEL_PATH}`);
            console.log('Run training script: node scripts/trainModel.js');

            // Fallback to pre-trained model
            customModel = await tf.loadGraphModel(
                'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/3/default/1',
                { fromTFHub: true }
            );
            console.log('✅ Pre-trained MobileNet v2 loaded as fallback');
        }
    } catch (error) {
        console.error('❌ Error loading model:', error);
        throw error;
    }
};

/**
 * Extract feature vector from image buffer using custom or pre-trained model
 * @param {Buffer} imageBuffer - Image buffer from uploaded file
 * @returns {Promise<Array>} Feature vector
 */
const extractFeaturesCustom = async (imageBuffer) => {
    try {
        // Ensure model is loaded
        await loadCustomModel();

        // Decode image from buffer
        const imageTensor = tf.node.decodeImage(imageBuffer, 3);

        // Resize to 224x224
        const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);

        // Normalize pixel values to [0, 1]
        const normalized = resized.div(255.0);

        // Add batch dimension
        const batched = normalized.expandDims(0);

        // Get feature vector from model
        const features = customModel.predict(batched);

        // Convert to array
        const featureArray = await features.data();
        const featureVector = Array.from(featureArray);

        // Cleanup tensors
        imageTensor.dispose();
        resized.dispose();
        normalized.dispose();
        batched.dispose();
        features.dispose();

        return featureVector;
    } catch (error) {
        console.error('Feature extraction error:', error);
        throw error;
    }
};

/**
 * Calculate cosine similarity between two feature vectors
 * @param {Array} vector1 - First feature vector
 * @param {Array} vector2 - Second feature vector
 * @returns {Number} Similarity score (0-100)
 */
const cosineSimilarity = (vector1, vector2) => {
    if (vector1.length !== vector2.length) {
        throw new Error('Vectors must have same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
        norm1 += vector1[i] * vector1[i];
        norm2 += vector2[i] * vector2[i];
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));

    // Convert to 0-100 scale
    return Math.round((similarity + 1) * 50); // Cosine ranges from -1 to 1
};

/**
 * Find similar products based on feature vector
 * @param {Array} queryVector - Feature vector of query image
 * @param {Array} products - Array of products with featureVectors
 * @param {Number} topK - Number of top results to return
 * @returns {Array} Ranked similar products
 */
const findSimilarProducts = (queryVector, products, topK = 10) => {
    const results = products
        .filter(p => p.featureVector && p.featureVector.length > 0)
        .map(product => ({
            product,
            similarity: cosineSimilarity(queryVector, product.featureVector)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);

    return results;
};

/**
 * Get model info
 * @returns {Object} Model information
 */
const getModelInfo = () => {
    return {
        isCustomModel: fs.existsSync(MODEL_PATH),
        modelPath: MODEL_PATH,
        backend: tf.getBackend(),
        memory: tf.memory()
    };
};

module.exports = {
    loadCustomModel,
    extractFeatures: extractFeaturesCustom,
    cosineSimilarity,
    findSimilarProducts,
    getModelInfo
};
