/**
 * Seed database from a structured JSON file.
 * Run with: node scripts/seed-db.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');
const CATEGORIES_FILE = path.join(__dirname, '../data/categories.json');

const seedDB = async () => {
    try {
        await mongoose.connect((process.env.MONGO_URI || 'mongodb://localhost:27017/lufyco').trim());
        console.log('📦 Connected to MongoDB');

        // --- SEED CATEGORIES ---
        if (fs.existsSync(CATEGORIES_FILE)) {
            const categoriesContent = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
            const categoriesData = JSON.parse(categoriesContent);
            console.log(`🔍 Found ${categoriesData.length} categories to seed...`);
            
            console.log('🗑️  Clearing existing categories...');
            await Category.deleteMany({});
            
            for (const item of categoriesData) {
                const newCat = new Category(item);
                await newCat.save();
            }
            console.log('✅ Categories seeded successfully.');
        }

        // --- SEED PRODUCTS ---
        if (fs.existsSync(PRODUCTS_FILE)) {
            const productsContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
            const productsData = JSON.parse(productsContent);
            console.log(`🔍 Found ${productsData.length} products to seed...`);

            console.log('🗑️  Clearing existing products...');
            await Product.deleteMany({}); 

            let addedCount = 0;
            for (const item of productsData) {
                const newProduct = new Product({
                    ...item,
                    featureVector: [] // Initialize for ML search compatibility
                });

                await newProduct.save();
                addedCount++;
            }
            console.log(`✅ Products seeded successfully. Added ${addedCount} items.`);
        }

        console.log('\n🎉 Full database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
