# Lufyco Clothing Application

A full-stack e-commerce mobile application built with React Native (Expo) and Node.js.

## 🚀 Features

*   **User Authentication**: Secure Login & Signup (JWT/AsyncStorage).
*   **Product Catalog**: Dynamic product listing fetched from MongoDB.
*   **Order Management**: Place orders and view order history.
*   **Shopping Cart**: Manage cart items (Context API).
*   **Modern UI**: Sleek, responsive design for iOS, Android, and Web.

## 🛠 Tech Stack

### Frontend
*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Navigation**: React Navigation (Stack & Tabs)
*   **State Management**: Context API
*   **Styling**: StyleSheet / Custom UI Components
*   **API Client**: Axios

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
*   **ODM**: Mongoose

---

## 🏁 Getting Started

To run this project, you will need to open **two separate terminals**.

### 1. Start the Backend Server

The backend handles the API and database connection.

```powershell
cd Lufyco_Backend
npm install  # Install dependencies (only first time)
npm start
```
*You should see "Server is running on port 5000" and "MongoDB Connected".*

### 2. Start the Frontend Application

The frontend connects to the backend running at `http://localhost:5000`.

```powershell
cd Lufyco_Frontend
npm install  # Install dependencies (only first time)
npm run web -- --clear
```
*The app should open in your default browser at `http://localhost:8081`.*

---

## 🔑 Test Credentials

You can use this pre-created user to log in, or sign up for a new account in the app.

*   **Email**: `test@example.com`
*   **Password**: `password123`

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Users
*   `POST /users/register` - Register a new user
*   `POST /users/login` - Authenticate user

### Products
*   `GET /products` - Get all products
*   `POST /products` - Create a product (Admin)

### Orders
*   `POST /orders` - Create a new order
*   `GET /orders/myorders` - Get logged-in user's orders

## 📂 Project Structure

*   **/Lufyco_Backend**: Server code, API routes, Models.
*   **/Lufyco_Frontend**: React Native App, Screens, Components.
