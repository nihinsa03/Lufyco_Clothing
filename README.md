# Lufyco Clothing Application

A full-stack e-commerce mobile application built with React Native (Expo) and Node.js.

## 🚀 Features

*   **User Authentication**: Secure Login & Signup (JWT/AsyncStorage).
*   **Product Catalog**: Rich product listing with categories (Men, Women, Kids, Shoes, Accessories) using **Mock Data** for instant feedback.
*   **AI Stylist**: Weather-based outfit recommendations and "Plan My Look" feature.
*   **Shopping Cart**: Fully functional cart with size/color selection (powered by **Zustand**).
*   **Checkout Flow**: Complete simulation: Cart -> Shipping -> Payment -> Review -> Order Success.
*   **Order Management**: Place orders and track status.
*   **Modern UI**: Sleek, responsive design for iOS, Android, and Web.

## 🛠 Tech Stack

### Frontend
*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Navigation**: React Navigation (Stack & Tabs)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Cart, Products, Auth)
*   **Styling**: StyleSheet / Custom UI Components
*   **Data**: Local Mock Data (for Products) + Axios (for Auth/User)

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
*   **ODM**: Mongoose

---

## 🏁 Getting Started

To run this project, you will need to open **two separate terminals**.

### 1. Start the Backend Server (Optional for UI dev)
*The backend handles Auth and User data. Product browsing currently works with mock data even if backend is off.*

```powershell
cd Lufyco_Backend
npm install  # Install dependencies (only first time)
npm start
```
*You should see "Server is running on port 5000" and "MongoDB Connected".*

### 2. Start the Frontend Application

The frontend connects to the backend at `http://localhost:5000` but falls back to mock data for products.

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

### Products (Mock Data)
*   User interface uses local `MOCK_PRODUCTS` for speed and reliability during development.

### Orders
*   `POST /orders` - Create a new order
*   `GET /orders/myorders` - Get logged-in user's orders

## 📂 Project Structure

*   **/Lufyco_Backend**: Server code, API routes, Models.
*   **/Lufyco_Frontend**: React Native App.
    *   `/app/screens`: All application screens (Home, Cart, Checkout, etc.).
    *   `/app/store`: Zustand stores (`useCartStore`, `useShopStore`, etc.).
    *   `/app/data`: Mock data files.
