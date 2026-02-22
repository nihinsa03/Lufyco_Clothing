const mongoose = require('mongoose');
const ClosetItem = require('./models/ClosetItem');
const dotenv = require('dotenv');

dotenv.config();

const closetItems = [
    {
        name: "Blue Shirt",
        category: "Outerwear",
        color: "#0000FF",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "Red Dress",
        category: "Dresses",
        color: "#FF0000",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "Black Heels",
        category: "Shoes",
        color: "#000000",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "Denim Jeans",
        category: "Bottoms",
        color: "#1F2937",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "White Top",
        category: "Tops",
        color: "#FFFFFF",
        image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "Leather Bag",
        category: "Accessories",
        color: "#8B4513",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "Gray Hoodie",
        category: "Tops",
        color: "#808080",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "Running Shoes",
        category: "Shoes",
        color: "#FF0000",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "Casual Sneakers",
        category: "Shoes",
        color: "#FFFFFF",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=500"
    },
    {
        name: "Black Jacket",
        category: "Outerwear",
        color: "#000000",
        image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=500"
    },
];

const seedCloset = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing closet items
        await ClosetItem.deleteMany({});
        console.log('Existing closet items cleared');

        await ClosetItem.insertMany(closetItems);
        console.log(`${closetItems.length} closet items inserted successfully!`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCloset();
