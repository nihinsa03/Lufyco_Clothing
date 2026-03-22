const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create new order (called from frontend on checkout)
// @access  Private (user ID passed in body)
router.post('/', async (req, res) => {
    const {
        user,
        orderItems,   // [{ name, qty, image, price, product }]
        shippingAddress, // { fullName, phone, address, city, postalCode, country }
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    if (!user) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const order = new Order({
            user,
            orderItems,
            shippingAddress: {
                address: shippingAddress.address || shippingAddress.addressLine || '',
                city: shippingAddress.city || '',
                postalCode: shippingAddress.postalCode || '',
                country: shippingAddress.country || '',
            },
            paymentMethod: typeof paymentMethod === 'object'
                ? (paymentMethod.method || 'cash')
                : paymentMethod,
            taxPrice: taxPrice || 0,
            shippingPrice: shippingPrice || 0,
            totalPrice: totalPrice || 0,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Order creation error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private (Simulated with queryString userId)
router.get('/myorders', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
