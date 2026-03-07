require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Working replacement Unsplash URL for Women's Kurta
const KURTA_URL = 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80';

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const res = await Product.findOneAndUpdate(
        { name: "Women's Kurta" },
        { image: KURTA_URL },
        { new: true }
    );
    console.log('Updated:', res.name, '->', res.image);
    process.exit();
});
