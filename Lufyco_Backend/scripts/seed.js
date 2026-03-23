const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Setup connection string (will use process.env.MONGO_URI if available)
const uri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/";
const client = new MongoClient(uri);

async function run() {
  try {
    // 1. Connect to the cluster
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("Successfully connected to Atlas!");

    // 2. Access the database and collection
    const db = client.db("lufyco_clothing");
    const collection = db.collection("products");

    // 3. Read products.json mock data
    const productsPath = path.join(__dirname, '../data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    // 4. Format the data to match strict schema defaults (rating, featureVector)
    const formattedProducts = productsData.map(product => {
        return {
            ...product,
            rating: product.rating || 0,
            reviewsCount: product.reviewsCount || 0,
            featureVector: product.featureVector || []
        };
    });

    console.log(`Found ${formattedProducts.length} mock products to insert.`);

    // Optional: Clear existing data to prevent duplicates on rerun
    console.log("Clearing existing products...");
    await collection.deleteMany({});

    // 5. Insert the data
    const result = await collection.insertMany(formattedProducts);
    console.log(`✅ Success! Inserted ${result.insertedCount} products into lufyco_clothing > products.`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // 6. Close the connection
    await client.close();
    console.log("Connection closed.");
  }
}

run().catch(console.dir);
