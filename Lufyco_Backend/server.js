const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const os = require('os');

// Detect LAN IP for image URL construction
const getLanIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const LAN_IP = process.env.HOST_IP || getLanIP();
app.locals.serverBaseUrl = `http://${LAN_IP}:${PORT}`;
console.log(`🌐 Server base URL for images: ${app.locals.serverBaseUrl}`);

// Connect to Database
const connectDB = require('./config/db');
console.log('Attempting to connect to MongoDB...');
connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded product images and dataset images as static files
// DB stores paths as /uploads/products/... or Images/...
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/Images', express.static(path.join(__dirname, 'public', 'Images')));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`);
    next();
});

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const closetRoutes = require('./routes/closetRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const aiRoutes = require('./routes/aiRoutes');
const clothingItemRoutes = require('./routes/clothingItemRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/closet', closetRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/clothing-items', clothingItemRoutes);

app.get('/', (req, res) => {
    res.send('Lufyco Clothing Backend is running!');
});

// Final Error Handler
app.use((err, req, res, next) => {
    // Catch JSON parsing errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Invalid JSON received:', err.message);
        return res.status(400).json({ message: 'Invalid JSON', error: err.message });
    }

    console.error("Global Server Error:", err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
