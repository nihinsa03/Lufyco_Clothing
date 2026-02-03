# Lufyco_Clothing - Backend

My Final Year Project

## Prerequisites
- [Node.js](https://nodejs.org/) (Maintained version recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Installation & Setup

> **IMPORTANT**: If you are moving this project between operating systems (e.g., Mac to Windows), you **MUST** delete the `node_modules` folder and `package-lock.json` file before installing dependencies.

### Windows (PowerShell)
1. Navigate to the backend directory:
   ```powershell
   cd Lufyco_Backend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Set up your `.env` file (ensure `MONGO_URI` is correct).

### Mac OS / Linux (Terminal)
1. Navigate to the backend directory:
   ```bash
   cd Lufyco_Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   *(If you encounter permission errors, use `sudo npm install`, though using a version manager like `nvm` is preferred)*

## Running the Server

### Development Mode
Runs the server with `nodemon` for hot-reloading.
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📚 API Documentation

### Interactive Swagger UI
Once the server is running, access the interactive API documentation at:

🔗 **http://localhost:5001/api-docs**

The Swagger UI provides:
- ✅ Interactive endpoint testing
- ✅ Detailed request/response schemas
- ✅ Example payloads
- ✅ Complete API reference

### Comprehensive API Guide
For detailed documentation including:
- Complete endpoint reference
- Request/response examples
- Data models and schemas
- Error handling
- Common use cases and workflows

See **[API_README.md](./API_README.md)**

### Quick API Overview

**Available Endpoints:**
- **Authentication:** `/api/users` - Register and login
- **Products:** `/api/products` - Browse and manage products
- **Orders:** `/api/orders` - Create and view orders
- **Closet (Cart):** `/api/closet` - Shopping cart management
- **Wishlist:** `/api/wishlist` - Save favorite items

### Offline Login (Development)
For testing without a database connection:
```json
POST /api/users/login
{
  "email": "user",
  "password": "user"
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

