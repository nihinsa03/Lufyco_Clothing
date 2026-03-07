/**
 * scripts/populate_feature_vectors.js
 * 
 * This script loops through all existing products in the DB, downloads their
 * main image, runs it through the TF.js Image Similarity Model, and saves
 * the resulting feature vector to the product document so that Image Search works.
 * 
 * Run from Lufyco_Backend directory:
 *   node scripts/populate_feature_vectors.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

// Configure dotenv to point to .env in Lufyco_Backend
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Product = require('../models/Product');
const { extractFeatures, loadCustomModel } = require('../services/mlFeatureExtractor');

const populateFeatures = async () => {
    try {
        console.log("Connecting to database...");
        await connectDB();

        console.log("Loading ML model...");
        await loadCustomModel();

        console.log("Fetching products from DB...");
        const products = await Product.find({});
        console.log(`Found ${products.length} products to process.\n`);

        let successCount = 0;
        let skipCount = 0;
        let errCount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            console.log(`[${i + 1}/${products.length}] Processing: ${product.name}`);

            // Skip if it already has a feature vector (optional, but good for resuming)
            // If we want to force re-compute, we can comment this out.
            // if (product.featureVector && product.featureVector.length > 0) {
            //     console.log(`   ⏭  Skipping (features already exist)`);
            //     skipCount++;
            //     continue;
            // }

            try {
                // Determine image URL
                let imageUrl = product.image;
                if (!imageUrl && product.images && product.images.length > 0) {
                    imageUrl = product.images[0];
                }

                if (!imageUrl) {
                    console.log(`   ⚠️  No image URL found. Skipping.`);
                    skipCount++;
                    continue;
                }

                // Download image as buffer
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(response.data);

                // Extract features
                const featureVector = await extractFeatures(imageBuffer);

                // Save to product
                product.featureVector = featureVector;
                await product.save();

                console.log(`   ✅  Features extracted and saved.`);
                successCount++;

            } catch (err) {
                console.error(`   ❌ Failed: ${err.message}`);
                errCount++;
            }
        }

        console.log("\n--- Populate Complete ---");
        console.log(`Total Products: ${products.length}`);
        console.log(`Success: ${successCount}`);
        console.log(`Skipped: ${skipCount}`);
        console.log(`Errors:  ${errCount}`);

    } catch (error) {
        console.error("Critical error:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

populateFeatures();
