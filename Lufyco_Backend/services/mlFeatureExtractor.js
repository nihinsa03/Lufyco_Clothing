const tf = require('@tensorflow/tfjs-node-gpu');

let model = null;

/**
 * Load pre-trained MobileNet model for feature extraction
 * Using MobileNet instead of ResNet50 for faster inference
 * @returns {Promise<void>}
 */
const loadModel = async () => {
    if (model) return; // Model already loaded

    try {
        console.log('Loading MobileNet model for GPU inference...');

        // Load MobileNet v2 from TensorFlow Hub
        model = await tf.loadGraphModel(
            'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/3/default/1',
            { fromTFHub: true }
        );

        console.log('✅ MobileNet model loaded successfully on GPU');
    } catch (error) {
        console.error('❌ Error loading model:', error);
        throw error;
    }
};

/**
 * Extract feature vector from image buffer
 * @param {Buffer} imageBuffer - Image buffer from uploaded file
 * @returns {Promise<Array>} 1280-dimensional feature vector
 */
const extractFeatures = async (imageBuffer) => {
    try {
        // Ensure model is loaded
        await loadModel();

        // Decode image from buffer
        const imageTensor = tf.node.decodeImage(imageBuffer, 3);

        // Resize to 224x224 (MobileNet input size)
        const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);

        // Normalize pixel values to [0, 1]
        const normalized = resized.div(255.0);

        // Add batch dimension
        const batched = normalized.expandDims(0);

        // Get feature vector from model
        const features = model.predict(batched);

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
 * Batch extract features from multiple images
 * @param {Array} imageBuffers - Array of image buffers
 * @returns {Promise<Array>} Array of feature vectors
 */
const batchExtractFeatures = async (imageBuffers) => {
    const features = [];

    for (const buffer of imageBuffers) {
        const vector = await extractFeatures(buffer);
        features.push(vector);
    }

    return features;
};

/**
 * Get GPU memory info
 * @returns {Object} GPU memory stats
 */
const getGPUInfo = () => {
    return {
        backend: tf.getBackend(),
        numTensors: tf.memory().numTensors,
        numDataBuffers: tf.memory().numDataBuffers,
        numBytes: tf.memory().numBytes
    };
};

module.exports = {
    loadModel,
    extractFeatures,
    cosineSimilarity,
    findSimilarProducts,
    batchExtractFeatures,
    getGPUInfo
};
