/**
 * scripts/seed_products.js
 * 
 * Seeder script to populate the database with real clothing products and images
 * using Unsplash links. This ensures the Image Search and ML features have data to work with.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '../.env') });

const products = [
    // ── MEN'S WEAR ─────────────────────────────────────────────────
    {
        name: 'Classic White T-Shirt',
        price: 1200,
        description: 'A premium cotton classic white t-shirt for daily wear.',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'T-Shirt', gender: 'Men'
    },
    {
        name: 'Black Graphic Tee',
        price: 1400,
        description: 'Stylish black graphic t-shirt for casual outings.',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'T-Shirt', gender: 'Men'
    },
    {
        name: 'Slim Fit Formal Shirt',
        price: 2200,
        description: 'Elegant slim-fit formal shirt for office and events.',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Shirt', gender: 'Men'
    },
    {
        name: 'Casual Linen Shirt',
        price: 1900,
        description: 'Relaxed linen shirt perfect for beach or casual days.',
        image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Shirt', gender: 'Men'
    },
    {
        name: 'Blue Slim Fit Jeans',
        price: 3500,
        description: 'Durable blue denim slim-fit jeans, everyday comfort.',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Jeans', gender: 'Men'
    },
    {
        name: 'Black Skinny Jeans',
        price: 3800,
        description: 'Trendy black skinny jeans for a sharp modern look.',
        image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Jeans', gender: 'Men'
    },
    {
        name: 'Chino Trousers',
        price: 2800,
        description: 'Classic chino trousers for smart-casual occasions.',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Trousers', gender: 'Men'
    },
    {
        name: 'Men\'s Hoodie',
        price: 3200,
        description: 'Soft fleece hoodie, cozy and comfortable.',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Hoodie', gender: 'Men'
    },
    {
        name: 'Denim Jacket',
        price: 5000,
        description: 'Classic blue denim jacket with metal buttons.',
        image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Jacket', gender: 'Men'
    },
    {
        name: 'Men\'s Blazer',
        price: 7500,
        description: 'Smart grey blazer, perfect for meetings and events.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Jacket', gender: 'Men'
    },
    {
        name: 'Men\'s Sweater',
        price: 2700,
        description: 'Warm knitted sweater for the Winter season.',
        image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Sweater', gender: 'Men'
    },
    {
        name: 'Men\'s Kurta',
        price: 2500,
        description: 'Traditional cotton kurta for festivals and casual wear.',
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
        category: "Men's Wear", type: 'Kurta', gender: 'Men'
    },

    // ── WOMEN'S WEAR ────────────────────────────────────────────────
    {
        name: 'Floral Summer Dress',
        price: 4200,
        description: 'Lovely floral print dress for summer outings.',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Dress', gender: 'Women'
    },
    {
        name: 'Midi Evening Dress',
        price: 5500,
        description: 'Elegant midi evening dress for parties and events.',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Dress', gender: 'Women'
    },
    {
        name: 'Women\'s Crop Top',
        price: 1500,
        description: 'Trendy crop top for casual and semi-formal occasions.',
        image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Top', gender: 'Women'
    },
    {
        name: 'Floral Printed Top',
        price: 1800,
        description: 'Beautiful floral printed top for everyday style.',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Top', gender: 'Women'
    },
    {
        name: 'Women\'s Skinny Jeans',
        price: 3500,
        description: 'Comfortable stretch skinny jeans for women.',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Jeans', gender: 'Women'
    },
    {
        name: 'Women\'s Trousers',
        price: 2900,
        description: 'Smart formal trousers for office and casual wear.',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Trousers', gender: 'Women'
    },
    {
        name: 'Women\'s Jacket',
        price: 5200,
        description: 'Stylish women\'s blazer jacket for all occasions.',
        image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Jacket', gender: 'Women'
    },
    {
        name: 'Women\'s Kurta',
        price: 2200,
        description: 'Beautifully embroidered women\'s kurta for festive occasions.',
        image: 'https://images.unsplash.com/photo-1672991435946-d55fa2bef3f7?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Kurta', gender: 'Women'
    },
    {
        name: 'Silk Saree',
        price: 8000,
        description: 'Gorgeous silk saree for weddings and festivals.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Saree', gender: 'Women'
    },
    {
        name: 'Women\'s Handbag',
        price: 4500,
        description: 'Premium leather handbag for everyday use.',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        category: "Women's Wear", type: 'Handbag', gender: 'Women'
    },

    // ── FOOTWEAR ────────────────────────────────────────────────────
    {
        name: 'White Sneakers',
        price: 6500,
        description: 'Clean white sneakers for everyday casual wear.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        category: 'Footwear', type: 'Casual Shoes', gender: 'Unisex'
    },
    {
        name: 'Men\'s Sports Shoes',
        price: 8000,
        description: 'Performance running shoes for sports and workouts.',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
        category: 'Footwear', type: 'Sports Shoes', gender: 'Men'
    },
    {
        name: 'Women\'s Heels',
        price: 5500,
        description: 'Elegant stiletto heels for formal occasions.',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        category: 'Footwear', type: 'Heels', gender: 'Women'
    },
    {
        name: 'Leather Boots',
        price: 9500,
        description: 'Premium leather boots for a bold fashionable look.',
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
        category: 'Footwear', type: 'Boots', gender: 'Unisex'
    },

    // ── ACCESSORIES ─────────────────────────────────────────────────
    {
        name: 'Leather Belt',
        price: 1500,
        description: 'Classic genuine leather belt with metal buckle.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories', type: 'Belt', gender: 'Unisex'
    },
    {
        name: 'Aviator Sunglasses',
        price: 2500,
        description: 'Trendy aviator sunglasses with UV400 protection.',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories', type: 'Sunglasses', gender: 'Unisex'
    },
    {
        name: 'Luxury Watch',
        price: 18000,
        description: 'Elegant luxury wristwatch for formal and casual occasions.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories', type: 'Watch', gender: 'Unisex'
    },

    // ── JEWELLERY ───────────────────────────────────────────────────
    {
        name: 'Gold Necklace',
        price: 12000,
        description: '18K gold necklace with elegant pendant design.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        category: 'Jewellery', type: 'Necklace', gender: 'Women'
    },
    {
        name: 'Diamond Earrings',
        price: 9500,
        description: 'Beautiful diamond-studded earrings for special occasions.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        category: 'Jewellery', type: 'Earrings', gender: 'Women'
    },
    {
        name: 'Silver Bracelet',
        price: 3500,
        description: 'Shiny silver bracelet, elegant and lightweight.',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
        category: 'Jewellery', type: 'Bracelet', gender: 'Women'
    },
    {
        name: 'Gold Ring',
        price: 6000,
        description: 'Classic 22K gold ring for women.',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        category: 'Jewellery', type: 'Ring', gender: 'Women'
    },
];

const seedDB = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Database cleared.');

        console.log('Seeding products...');
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products.`);

        mongoose.connection.close();
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
