# Lufyco Clothing API Documentation

Complete REST API documentation for the Lufyco Clothing e-commerce platform.

## 📚 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Interactive Documentation](#interactive-documentation)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [User Authentication](#user-authentication)
  - [Products](#products)
  - [Orders](#orders)
  - [Closet (Shopping Cart)](#closet-shopping-cart)
  - [Wishlist](#wishlist)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Common Use Cases](#common-use-cases)

---

## Overview

The Lufyco Clothing API is a RESTful API that provides endpoints for managing an e-commerce clothing platform. It supports user authentication, product browsing, shopping cart management, wishlists, and order processing.

**Base URL:** `http://localhost:5001` (Development)

**API Version:** 1.0.0

**Response Format:** JSON

---

## Getting Started

### Starting the Server

```bash
cd Lufyco_Backend
npm install
npm run dev
```

The server will start on port 5001 (or the port specified in your `.env` file).

### Making Your First Request

Test the API with a simple product listing request:

```bash
curl http://localhost:5001/api/products
```

---

## Interactive Documentation

Access the **Swagger UI** for interactive API documentation:

🔗 **http://localhost:5001/api-docs**

Features:
- ✅ Try out endpoints directly in the browser
- ✅ View detailed request/response schemas
- ✅ See example payloads
- ✅ Understand error responses

---

## Authentication

### Current Implementation

> **⚠️ Development Mode**
> The API currently does not enforce JWT authentication. User ID is passed as part of requests for user-specific operations.

### Offline Login Feature

For development and testing without a database connection, use the special offline login:

**Endpoint:** `POST /api/users/login`

**Credentials:**
```json
{
  "email": "user",
  "password": "user"
}
```

**Response:**
```json
{
  "_id": "dummy_user_id",
  "name": "Offline User",
  "email": "user",
  "isAdmin": false,
  "token": "offline-token-123"
}
```

> **Note:** Email is case-insensitive ("user", "USER", "User" all work), but password is case-sensitive.

---

## API Endpoints

### User Authentication

#### Register New User

Create a new user account.

**Endpoint:** `POST /api/users/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "mySecurePassword123"
}
```

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "isAdmin": false
}
```

**Error Responses:**
- `400` - User already exists
- `500` - Server error

---

#### Login User

Authenticate a user and get user data.

**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "mySecurePassword123"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "isAdmin": false
}
```

**Error Responses:**
- `401` - Invalid email or password
- `500` - Server error

---

### Products

#### Get All Products

Retrieve products with optional filtering, searching, and sorting.

**Endpoint:** `GET /api/products`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `gender` | string | Filter by gender (men, women, unisex) | `men` |
| `category` | string | Filter by category | `Clothing` |
| `subCategory` | string | Filter by subcategory | `T-Shirts` |
| `type` | string | Filter by type | `Casual` |
| `search` | string | Search in name/description | `cotton` |
| `isSale` | string | Filter sale items ('true'/'false') | `true` |
| `sort` | string | Sort order (see sorting options below) | `price_low_to_high` |

**Sorting Options:**
- `price_low_to_high` - Sort by price ascending
- `price_high_to_low` - Sort by price descending
- `whats_new` - Sort by newest first
- `popularity` - Sort by review count

**Example Request:**
```bash
GET /api/products?gender=men&category=Clothing&sort=price_low_to_high
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Classic Cotton T-Shirt",
    "price": 2500,
    "compareAtPrice": 3500,
    "description": "Comfortable cotton t-shirt",
    "image": "https://example.com/tshirt.jpg",
    "gender": "men",
    "category": "Clothing",
    "subCategory": "T-Shirts",
    "type": "Casual",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Black", "White"],
    "rating": 4.5,
    "reviewsCount": 128,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

#### Create Product

Add a new product to the catalog.

**Endpoint:** `POST /api/products`

> **⚠️ Note:** This should be admin-protected in production

**Request Body:**
```json
{
  "name": "Summer Casual Shirt",
  "price": 3500,
  "description": "Lightweight and breathable summer shirt",
  "image": "https://example.com/images/shirt.jpg",
  "category": "Clothing"
}
```

**Success Response (201):**
```json
{
  "_id": "507f191e810c19729de860ea",
  "name": "Summer Casual Shirt",
  "price": 3500,
  "description": "Lightweight and breathable summer shirt",
  "image": "https://example.com/images/shirt.jpg",
  "category": "Clothing",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Orders

#### Create Order

Create a new order with items and shipping information.

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "user": "507f1f77bcf86cd799439011",
  "orderItems": [
    {
      "product": "507f191e810c19729de860ea",
      "name": "Cotton T-Shirt",
      "quantity": 2,
      "price": 2500,
      "size": "M",
      "color": "Black"
    }
  ],
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "Colombo",
    "postalCode": "00100",
    "country": "Sri Lanka"
  },
  "paymentMethod": "Cash on Delivery",
  "itemsPrice": 5000,
  "taxPrice": 500,
  "shippingPrice": 300,
  "totalPrice": 5800
}
```

**Success Response (201):**
```json
{
  "_id": "507f191e810c19729de860ec",
  "user": "507f1f77bcf86cd799439011",
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "Cash on Delivery",
  "totalPrice": 5800,
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400` - No order items
- `500` - Server error

---

#### Get User Orders

Retrieve all orders for a specific user.

**Endpoint:** `GET /api/orders/myorders`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID to fetch orders for |

**Example Request:**
```bash
GET /api/orders/myorders?userId=507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
[
  {
    "_id": "507f191e810c19729de860ec",
    "user": "507f1f77bcf86cd799439011",
    "orderItems": [...],
    "totalPrice": 5800,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Closet (Shopping Cart)

#### Get Closet Items

Retrieve items in user's shopping cart.

**Endpoint:** `GET /api/closet`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | string | Filter by user ID |
| `category` | string | Filter by category |
| `search` | string | Search by item name |

**Example Request:**
```bash
GET /api/closet?userId=507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
[
  {
    "_id": "507f191e810c19729de860ed",
    "user": "507f1f77bcf86cd799439011",
    "name": "Classic T-Shirt",
    "category": "Clothing",
    "image": "https://example.com/product.jpg",
    "notes": "Size M, Black color",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

#### Add Item to Closet

Add a product to the shopping cart.

**Endpoint:** `POST /api/closet`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "name": "Classic T-Shirt",
  "category": "Clothing",
  "image": "https://example.com/product.jpg",
  "notes": "Size M, Black color"
}
```

**Success Response (201):**
```json
{
  "_id": "507f191e810c19729de860ed",
  "user": "507f1f77bcf86cd799439011",
  "name": "Classic T-Shirt",
  "category": "Clothing",
  "image": "https://example.com/product.jpg",
  "notes": "Size M, Black color",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### Remove Item from Closet

Delete an item from the shopping cart.

**Endpoint:** `DELETE /api/closet/:id`

**Example Request:**
```bash
DELETE /api/closet/507f191e810c19729de860ed
```

**Success Response (200):**
```json
{
  "message": "Item removed"
}
```

**Error Responses:**
- `404` - Item not found
- `500` - Server error

---

### Wishlist

#### Get Wishlist Items

Retrieve all items in user's wishlist.

**Endpoint:** `GET /api/wishlist`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | string | Filter by user ID |

**Example Request:**
```bash
GET /api/wishlist?userId=507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": "507f1f77bcf86cd799439011",
    "product": "507f191e810c19729de860eb",
    "title": "Classic Cotton T-Shirt",
    "price": 2500,
    "image": "https://example.com/tshirt.jpg",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

#### Add Item to Wishlist

Save a product to the wishlist.

**Endpoint:** `POST /api/wishlist`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "productId": "507f191e810c19729de860eb",
  "title": "Classic Cotton T-Shirt",
  "price": 2500,
  "image": "https://example.com/tshirt.jpg"
}
```

**Success Response (201):**
```json
{
  "_id": "507f191e810c19729de860ea",
  "user": "507f1f77bcf86cd799439011",
  "product": "507f191e810c19729de860eb",
  "title": "Classic Cotton T-Shirt",
  "price": 2500,
  "image": "https://example.com/tshirt.jpg",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400` - Item already in wishlist
- `500` - Server error

---

#### Remove Item from Wishlist

Delete an item from the wishlist.

**Endpoint:** `DELETE /api/wishlist/:id`

**Example Request:**
```bash
DELETE /api/wishlist/507f191e810c19729de860ea
```

**Success Response (200):**
```json
{
  "message": "Item removed"
}
```

---

## Data Models

### User Schema

```typescript
{
  _id: string,
  name: string,
  email: string,       // Unique
  password: string,    // Currently plain text (⚠️ add hashing in production)
  isAdmin: boolean     // Default: false
}
```

### Product Schema

```typescript
{
  _id: string,
  name: string,
  price: number,       // Price in LKR
  compareAtPrice?: number,  // Original price (for sales)
  description?: string,
  image?: string,
  gender: 'men' | 'women' | 'unisex',
  category: string,
  subCategory?: string,
  type?: string,
  sizes?: string[],
  colors?: string[],
  rating?: number,     // 0-5
  reviewsCount?: number,
  createdAt: Date
}
```

### Order Schema

```typescript
{
  _id: string,
  user: string,        // User ID
  orderItems: [{
    product: string,   // Product ID
    name: string,
    quantity: number,
    price: number,
    size?: string,
    color?: string
  }],
  shippingAddress: {
    address: string,
    city: string,
    postalCode: string,
    country: string
  },
  paymentMethod: string,
  itemsPrice: number,
  taxPrice: number,
  shippingPrice: number,
  totalPrice: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: Date
}
```

---

## Error Handling

### Standard Error Format

All errors return a JSON object with a `message` field:

```json
{
  "message": "Error description here"
}
```

In development mode, additional error details may be included:

```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST creating resource |
| 400 | Bad Request | Invalid data or missing required fields |
| 401 | Unauthorized | Authentication failed |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Common Use Cases

### 1. User Registration & Login Flow

```javascript
// 1. Register new user
POST /api/users/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePass123"
}

// 2. Login
POST /api/users/login
{
  "email": "jane@example.com",
  "password": "securePass123"
}

// Store the returned user ID for subsequent requests
```

### 2. Browse Products

```javascript
// Get all men's clothing
GET /api/products?gender=men&category=Clothing

// Search for cotton t-shirts
GET /api/products?search=cotton&subCategory=T-Shirts

// Get sale items sorted by price
GET /api/products?isSale=true&sort=price_low_to_high
```

### 3. Shopping Cart Workflow

```javascript
// 1. Add item to cart
POST /api/closet
{
  "userId": "USER_ID",
  "name": "Cotton T-Shirt",
  "category": "Clothing",
  "image": "image_url",
  "notes": "Size M, Black"
}

// 2. View cart
GET /api/closet?userId=USER_ID

// 3. Remove item
DELETE /api/closet/ITEM_ID
```

### 4. Place an Order

```javascript
// Create order from cart items
POST /api/orders
{
  "user": "USER_ID",
  "orderItems": [/* cart items */],
  "shippingAddress": {/* address */},
  "paymentMethod": "Cash on Delivery",
  "totalPrice": 5800
}

// View order history
GET /api/orders/myorders?userId=USER_ID
```

### 5. Manage Wishlist

```javascript
// Add to wishlist
POST /api/wishlist
{
  "userId": "USER_ID",
  "productId": "PRODUCT_ID",
  "title": "Product Name",
  "price": 2500,
  "image": "image_url"
}

// View wishlist
GET /api/wishlist?userId=USER_ID

// Remove from wishlist
DELETE /api/wishlist/ITEM_ID
```

---

## Development Notes

### Security Considerations

> **⚠️ Important for Production**
> 
> - **Password Hashing:** Currently passwords are stored in plain text. Implement bcrypt hashing before production.
> - **JWT Authentication:** Add JWT token-based authentication for protected routes.
> - **Input Validation:** Add comprehensive validation for all endpoints.
> - **Rate Limiting:** Implement rate limiting to prevent abuse.
> - **CORS:** Configure CORS properly for production domain.

### Database Connection

The API gracefully handles database connection failures. If MongoDB is unavailable:
- The server will still start
- Use the offline login feature (`user/user`)
- Check server logs for connection status

### Environment Variables

Required environment variables in `.env`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

---

## Support & Contact

For issues, questions, or contributions:
- **Project:** Lufyco Clothing
- **Version:** 1.0.0
- **License:** ISC

**Interactive Documentation:** Visit `/api-docs` for the Swagger UI interface!
