/**
 * Category Products Seeder
 * Usage: node scripts/seed-categories.js
 * 
 * Reads from scripts/data/products-seed.json and inserts all products into MongoDB.
 * Skips duplicates (matched by name).
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const DATA_FILE = path.join(__dirname, 'data', 'products-seed.json');

const seedProducts = async () => {
    try {
        // Connect
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lufyco');
        console.log('📦 Connected to MongoDB');

        // Load your JSON file
        if (!fs.existsSync(DATA_FILE)) {
            console.error(`❌ Data file not found: ${DATA_FILE}`);
            console.log('👉 Create the file at: scripts/data/products-seed.json');
            process.exit(1);
        }

        const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        console.log(`📋 Found ${products.length} products to seed\n`);

        let added = 0;
        let skipped = 0;

        for (const p of products) {
            // Skip duplicates by name
            const exists = await Product.findOne({ name: p.name });
            if (exists) {
                console.log(`⏩ Skip (exists): ${p.name}`);
                skipped++;
                continue;
            }

            await Product.create({
                name: p.name,
                price: p.price,
                compareAtPrice: p.compareAtPrice || null,
                description: p.description || `${p.name} - quality product.`,
                image: p.image,
                category: p.category,
                subCategory: p.subCategory || '',
                type: p.type || '',
                gender: p.gender || 'Unisex',
                colors: p.colors || ['#000000', '#FFFFFF'],
                sizes: p.sizes || ['S', 'M', 'L', 'XL'],
                isNewArrival: p.isNewArrival || false,
                rating: p.rating || 4.5,
                reviewsCount: p.reviewsCount || 0,
            });

            console.log(`✅ Added: [${p.type || p.category}] ${p.name} — LKR ${p.price}`);
            added++;
        }

        console.log(`\n🎉 Done! Added: ${added}, Skipped: ${skipped}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

seedProducts();
