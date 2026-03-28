const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String, // e.g., "Men's Wear"
            required: true,
        },
        subCategory: {
            type: String, // e.g., "Casual Wear"
            required: false,
        },
        type: {
            type: String, // e.g., "SHIRTS"
            required: false,
        },
        gender: {
            type: String, // "Men", "Women", "Kids"
            required: false,
        },
        compareAtPrice: {
            type: Number,
            required: false,
        },
        colors: {
            type: [String], // Array of hex codes
            required: false,
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviewsCount: {
            type: Number,
            default: 0,
        },
        featureVector: {
            type: [Number],
            required: false,
            default: []
        },
         occasion: {
                type: String, // e.g., "Casual", "Formal", "Party"
                required: false,
            },
        quantity:{
            type: Number,
            required: false,
            default: 0
        }    
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('products', productSchema);

module.exports = Product;