const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
const connectDB = require('./config/db');
console.log('Attempting to connect to MongoDB...');
connectDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Lufyco Clothing API Docs'
}));

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const closetRoutes = require('./routes/closetRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/closet', closetRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Lufyco Clothing API</title></head>
            <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
                <h1>🛍️ Lufyco Clothing Backend API</h1>
                <p>Welcome to the Lufyco Clothing REST API!</p>
                <h2>📚 API Documentation</h2>
                <p>Access our interactive API documentation here:</p>
                <a href="/api-docs" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    View API Documentation (Swagger UI)
                </a>
                <h2>🔗 Available Endpoints</h2>
                <ul>
                    <li><strong>Authentication:</strong> /api/users</li>
                    <li><strong>Products:</strong> /api/products</li>
                    <li><strong>Orders:</strong> /api/orders</li>
                    <li><strong>Closet (Cart):</strong> /api/closet</li>
                    <li><strong>Wishlist:</strong> /api/wishlist</li>
                </ul>
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                    Version 1.0.0 | Development Mode
                </p>
            </body>
        </html>
    `);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Server Error:", err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
