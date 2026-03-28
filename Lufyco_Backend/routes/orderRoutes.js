const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Blue Shirt"
 *         qty:
 *           type: integer
 *           example: 2
 *         image:
 *           type: string
 *           example: "https://example.com/shirt.jpg"
 *         price:
 *           type: number
 *           example: 4500
 *         product:
 *           type: string
 *           example: "67f123abc456def789gh123"
 *
 *     ShippingAddress:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "Nihinsa Bandara"
 *         phone:
 *           type: string
 *           example: "0771234567"
 *         address:
 *           type: string
 *           example: "123 Main Street"
 *         addressLine:
 *           type: string
 *           example: "123 Main Street"
 *         city:
 *           type: string
 *           example: "Colombo"
 *         postalCode:
 *           type: string
 *           example: "10100"
 *         country:
 *           type: string
 *           example: "Sri Lanka"
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "67f123abc456def789gh123"
 *         user:
 *           type: string
 *           example: "67f111aaa222bbb333ccc444"
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         paymentMethod:
 *           type: string
 *           example: "cash"
 *         taxPrice:
 *           type: number
 *           example: 0
 *         shippingPrice:
 *           type: number
 *           example: 350
 *         totalPrice:
 *           type: number
 *           example: 9350
 *         createdAt:
 *           type: string
 *           example: "2026-03-28T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2026-03-28T10:05:00.000Z"
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - user
 *         - orderItems
 *         - shippingAddress
 *         - paymentMethod
 *       properties:
 *         user:
 *           type: string
 *           example: "67f111aaa222bbb333ccc444"
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         paymentMethod:
 *           oneOf:
 *             - type: string
 *               example: "cash"
 *             - type: object
 *               properties:
 *                 method:
 *                   type: string
 *                   example: "cash"
 *         taxPrice:
 *           type: number
 *           example: 0
 *         shippingPrice:
 *           type: number
 *           example: 350
 *         totalPrice:
 *           type: number
 *           example: 9350
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Order not found"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Something went wrong"
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order from checkout data sent by the frontend.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Missing user ID or no order items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while creating order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// @route   POST /api/orders
// @desc    Create new order (called from frontend on checkout)
// @access  Private (user ID passed in body)
router.post('/', async (req, res) => {
    const {
        user,
        orderItems,
        shippingAddress,
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

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get orders of a specific user
 *     description: Returns all orders for the provided userId query parameter.
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to fetch orders for
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: User ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while fetching orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error while fetching order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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