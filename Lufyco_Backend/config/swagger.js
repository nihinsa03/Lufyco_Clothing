const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Lufyco Clothing API',
            version: '1.0.0',
            description: 'A comprehensive REST API for the Lufyco Clothing e-commerce platform',
            contact: {
                name: 'Lufyco Development Team',
                email: 'dev@lufyco.com'
            },
            license: {
                name: 'ISC',
                url: 'https://opensource.org/licenses/ISC'
            }
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server'
            },
            {
                url: 'https://api.lufyco.com',
                description: 'Production server (when deployed)'
            }
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'User registration and authentication endpoints'
            },
            {
                name: 'Products',
                description: 'Product catalog and management'
            },
            {
                name: 'Orders',
                description: 'Order creation and management'
            },
            {
                name: 'Closet',
                description: 'Shopping cart management (called "Closet" in this app)'
            },
            {
                name: 'Wishlist',
                description: 'User wishlist management'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID',
                            example: '507f1f77bcf86cd799439011'
                        },
                        name: {
                            type: 'string',
                            description: 'User full name',
                            example: 'John Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                            example: 'john.doe@example.com'
                        },
                        password: {
                            type: 'string',
                            description: 'User password (plain text in current implementation)',
                            example: 'password123'
                        },
                        isAdmin: {
                            type: 'boolean',
                            description: 'Admin privilege flag',
                            default: false
                        }
                    }
                },
                Product: {
                    type: 'object',
                    required: ['name', 'price', 'gender', 'category'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Product ID',
                            example: '507f1f77bcf86cd799439011'
                        },
                        name: {
                            type: 'string',
                            description: 'Product name',
                            example: 'Classic Cotton T-Shirt'
                        },
                        price: {
                            type: 'number',
                            description: 'Product price in LKR',
                            example: 2500
                        },
                        compareAtPrice: {
                            type: 'number',
                            description: 'Original price (for sale items)',
                            example: 3500
                        },
                        description: {
                            type: 'string',
                            description: 'Product description',
                            example: 'Comfortable and stylish cotton t-shirt'
                        },
                        image: {
                            type: 'string',
                            description: 'Product image URL',
                            example: 'https://example.com/images/tshirt.jpg'
                        },
                        gender: {
                            type: 'string',
                            enum: ['men', 'women', 'unisex'],
                            description: 'Target gender',
                            example: 'men'
                        },
                        category: {
                            type: 'string',
                            description: 'Product category',
                            example: 'Clothing'
                        },
                        subCategory: {
                            type: 'string',
                            description: 'Product subcategory',
                            example: 'T-Shirts'
                        },
                        type: {
                            type: 'string',
                            description: 'Product type',
                            example: 'Casual'
                        },
                        sizes: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Available sizes',
                            example: ['S', 'M', 'L', 'XL']
                        },
                        colors: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Available colors',
                            example: ['Black', 'White', 'Navy']
                        },
                        rating: {
                            type: 'number',
                            description: 'Average product rating',
                            minimum: 0,
                            maximum: 5,
                            example: 4.5
                        },
                        reviewsCount: {
                            type: 'number',
                            description: 'Number of reviews',
                            example: 128
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Product creation timestamp'
                        }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Order ID'
                        },
                        user: {
                            type: 'string',
                            description: 'User ID who placed the order'
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    product: {
                                        type: 'string',
                                        description: 'Product ID'
                                    },
                                    quantity: {
                                        type: 'number',
                                        description: 'Quantity ordered'
                                    },
                                    size: {
                                        type: 'string',
                                        description: 'Selected size'
                                    },
                                    color: {
                                        type: 'string',
                                        description: 'Selected color'
                                    }
                                }
                            }
                        },
                        totalPrice: {
                            type: 'number',
                            description: 'Total order price'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
                            description: 'Order status'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'Invalid email or password'
                        },
                        error: {
                            type: 'string',
                            description: 'Detailed error information (development only)',
                            example: 'User not found in database'
                        }
                    }
                }
            },
            responses: {
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'Resource not found'
                            }
                        }
                    }
                },
                BadRequest: {
                    description: 'Bad request - Invalid input',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'Invalid input data'
                            }
                        }
                    }
                },
                Unauthorized: {
                    description: 'Unauthorized - Authentication required',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'Invalid email or password'
                            }
                        }
                    }
                },
                ServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                message: 'Internal Server Error'
                            }
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT authentication (to be implemented)'
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
