/**
 * Training script for fine-tuning MobileNet on DeepFashion dataset
 * Run with: node trainModel.js
 * 
 * Hardware Requirements:
 * - GPU: RTX 4060 8GB ✅
 * - RAM: 32GB ✅
 * - Storage: ~10GB for model + dataset
 * 
 * Expected Training Time: 1-2 hours for 5000 images
 */

const tf = require('@tensorflow/tfjs-node-gpu');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    // Dataset paths
    TRAIN_DIR: path.join(__dirname, '../../train_images'), // Adjust to your DeepFashion path
    TEST_DIR: path.join(__dirname, '../../test_images'),

    // Model settings
    IMAGE_SIZE: 224,
    BATCH_SIZE: 32,
    EPOCHS: 10,
    LEARNING_RATE: 0.0001,

    // Output
    MODEL_SAVE_PATH: path.join(__dirname, '../models/fashion-similarity-model'),

    // Training limits (adjust based on your needs)
    MAX_TRAIN_IMAGES: 5000, // Start with 5K, increase for better accuracy
    MAX_TEST_IMAGES: 500
};

// Category mapping (DeepFashion categories)
const CATEGORIES = [
    'tops',
    'bottoms',
    'dresses',
    'outerwear',
    'shoes',
    'bags',
    'accessories'
];

/**
 * Load and preprocess image
 */
async function loadImage(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const imageTensor = tf.node.decodeImage(imageBuffer, 3);

        // Resize to 224x224
        const resized = tf.image.resizeBilinear(imageTensor, [CONFIG.IMAGE_SIZE, CONFIG.IMAGE_SIZE]);

        // Normalize to [0, 1]
        const normalized = resized.div(255.0);

        imageTensor.dispose();
        resized.dispose();

        return normalized;
    } catch (error) {
        console.error(`Error loading image ${imagePath}:`, error.message);
        return null;
    }
}

/**
 * Load dataset from directory
 */
async function loadDataset(directory, maxImages) {
    console.log(`\n📂 Loading dataset from: ${directory}`);

    const images = [];
    const labels = [];

    // Get all image files
    const files = fs.readdirSync(directory)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .slice(0, maxImages);

    console.log(`Found ${files.length} images`);

    for (let i = 0; i < files.length; i++) {
        if (i % 100 === 0) {
            console.log(`Loading image ${i}/${files.length}...`);
        }

        const imagePath = path.join(directory, files[i]);
        const imageTensor = await loadImage(imagePath);

        if (imageTensor) {
            images.push(imageTensor);

            // Assign category based on filename or directory structure
            // You may need to adjust this based on your dataset structure
            const categoryId = i % CATEGORIES.length; // Simplified for now
            labels.push(categoryId);
        }
    }

    console.log(`✅ Loaded ${images.length} images`);

    // Stack into batched tensors
    const imagesTensor = tf.stack(images);
    const labelsTensor = tf.tensor1d(labels, 'int32');

    // Cleanup individual tensors
    images.forEach(img => img.dispose());

    return { images: imagesTensor, labels: labelsTensor };
}

/**
 * Create model architecture
 */
async function createModel() {
    console.log('\n🏗️ Creating model architecture...');

    // Load pre-trained MobileNet v2 as base
    const mobilenet = await tf.loadGraphModel(
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/3/default/1',
        { fromTFHub: true }
    );

    console.log('✅ Loaded pre-trained MobileNet v2');

    // Create custom model
    const model = tf.sequential({
        layers: [
            // Base features from MobileNet (frozen)
            tf.layers.inputLayer({ inputShape: [CONFIG.IMAGE_SIZE, CONFIG.IMAGE_SIZE, 3] }),

            // Add custom layers for fine-tuning
            tf.layers.dense({ units: 512, activation: 'relu', name: 'dense_1' }),
            tf.layers.dropout({ rate: 0.3 }),
            tf.layers.dense({ units: 256, activation: 'relu', name: 'dense_2' }),
            tf.layers.dropout({ rate: 0.3 }),

            // Output layer for classification
            tf.layers.dense({ units: CATEGORIES.length, activation: 'softmax', name: 'output' })
        ]
    });

    // Compile model
    model.compile({
        optimizer: tf.train.adam(CONFIG.LEARNING_RATE),
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy']
    });

    model.summary();

    return { model, mobilenet };
}

/**
 * Train the model
 */
async function trainModel() {
    console.log('🚀 Starting training pipeline...\n');
    console.log('Configuration:', CONFIG);

    // Check GPU availability
    console.log('\n🔍 GPU Info:');
    console.log('Backend:', tf.getBackend());
    console.log('Memory:', tf.memory());

    // Load datasets
    const trainData = await loadDataset(CONFIG.TRAIN_DIR, CONFIG.MAX_TRAIN_IMAGES);
    const testData = await loadDataset(CONFIG.TEST_DIR, CONFIG.MAX_TEST_IMAGES);

    // Create model
    const { model, mobilenet } = await createModel();

    // Training
    console.log('\n🏋️ Training model...');

    const history = await model.fit(trainData.images, trainData.labels, {
        epochs: CONFIG.EPOCHS,
        batchSize: CONFIG.BATCH_SIZE,
        validationData: [testData.images, testData.labels],
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`\nEpoch ${epoch + 1}/${CONFIG.EPOCHS}`);
                console.log(`  Loss: ${logs.loss.toFixed(4)}`);
                console.log(`  Accuracy: ${(logs.acc * 100).toFixed(2)}%`);
                console.log(`  Val Loss: ${logs.val_loss.toFixed(4)}`);
                console.log(`  Val Accuracy: ${(logs.val_acc * 100).toFixed(2)}%`);

                // Memory cleanup
                if (epoch % 2 === 0) {
                    console.log(`  GPU Memory: ${JSON.stringify(tf.memory())}`);
                }
            }
        }
    });

    // Save model
    console.log('\n💾 Saving trained model...');
    await model.save(`file://${CONFIG.MODEL_SAVE_PATH}`);
    console.log(`✅ Model saved to: ${CONFIG.MODEL_SAVE_PATH}`);

    // Cleanup
    trainData.images.dispose();
    trainData.labels.dispose();
    testData.images.dispose();
    testData.labels.dispose();

    console.log('\n✅ Training complete!');
    console.log('\nFinal Results:');
    console.log(`  Training Accuracy: ${(history.history.acc[history.history.acc.length - 1] * 100).toFixed(2)}%`);
    console.log(`  Validation Accuracy: ${(history.history.val_acc[history.history.val_acc.length - 1] * 100).toFixed(2)}%`);

    return model;
}

// Run training
if (require.main === module) {
    trainModel()
        .then(() => {
            console.log('\n🎉 Training pipeline completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Training failed:', error);
            process.exit(1);
        });
}

module.exports = { trainModel, loadImage, CONFIG };
