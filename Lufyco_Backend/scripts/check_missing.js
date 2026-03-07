require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const failed = await Product.find({ $or: [{ featureVector: { $size: 0 } }, { featureVector: { $exists: false } }] });
    console.log(`Products missing feature vectors: ${failed.length}`);
    failed.forEach(p => console.log(' -', p.name));
    process.exit();
});
