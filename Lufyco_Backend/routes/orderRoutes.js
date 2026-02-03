const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: |
 *       Create a new order with order items, shipping address, and payment details.
 *       **Note:** Currently simulates authentication by accepting userId in request body.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *               - totalPrice
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID who created the order
 *                 example: "507f1f77bcf86cd799439011"
 *               orderItems:
 *                 type: array
 *                 description: Array of ordered items
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     name:
 *                       type: string
 *                       description: Product name
 *                     quantity:
 *                       type: number
 *                       description: Quantity ordered
 *                     price:
 *                       type: number
 *                       description: Price per unit
 *                     size:
 *                       type: string
 *                       description: Selected size
 *                     color:
 *                       type: string
 *                       description: Selected color
 *                 example:
 *                   - product: "507f191e810c19729de860ea"
 *                     name: "Cotton T-Shirt"
 *                     quantity: 2
 *                     price: 2500
 *                     size: "M"
 *                     color: "Black"
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *                 example:
 *                   address: "123 Main Street"
 *                   city: "Colombo"
 *                   postalCode: "00100"
 *                   country: "Sri Lanka"
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method used
 *                 example: "Cash on Delivery"
 *               itemsPrice:
 *                 type: number
 *                 description: Total items price
 *                 example: 5000
 *               taxPrice:
 *                 type: number
 *                 description: Tax amount
 *                 example: 500
 *               shippingPrice:
 *                 type: number
 *                 description: Shipping cost
 *                 example: 300
 *               totalPrice:
 *                 type: number
 *                 description: Total order price
 *                 example: 5800
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - No order items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "No order items"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
    const {
        user, // Assuming user ID is passed in body for now
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        try {
            const order = new Order({
                user,
                orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();

            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get user's orders
 *     description: |
 *       Retrieve all orders for a specific user.
 *       **Note:** Currently simulates authentication using userId query parameter.
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to fetch orders for
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Successfully retrieved user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - User ID required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "User ID is required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/myorders', async (req, res) => {
    const { userId } = req.query; // Expecting ?userId=...

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const orders = await Order.find({ user: userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
