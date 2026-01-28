# Lufyco Clothing Application

A full-stack e-commerce mobile application built with React Native (Expo), Node.js, and Python (AI).

## 🚀 Features

*   **User Authentication**: Secure Login & Signup.
*   **Product Catalog**: Browsable products with categories (Men, Women, Kids, etc.).
*   **AI Stylist**: Weather-based outfit recommendations and image tagging (Powered by **Python/FastAPI**).
*   **Shopping Cart**: Fully functional cart with size/color selection.
*   **Checkout Flow**: Simulation of Cart -> Shipping -> Payment -> Order Success.
*   **Order Management**: Place and track orders.
*   **Modern UI**: Built with React Native and Expo.

## 🛠 Tech Stack

### Frontend
*   **React Native** (Expo)
*   **Zustand** (State Management)
*   **Axios** (API Requests)

### Backend (Main)
*   **Node.js** with **Express**
*   **MongoDB** (Database) with Mongoose

### AI Service
*   **Python**
*   **FastAPI**
*   **TensorFlow / Keras** (Image analysis models)

---

## 🏁 How to Run the Project

To run this application completely, you need to open **THREE separate terminal windows** and run the services in parallel.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [Python](https://www.python.org/) (v3.9+)
*   [Git](https://git-scm.com/)
*   [MongoDB Atlas](https://www.mongodb.com/atlas) Account (or local MongoDB)

---

### Terminal 1: Node.js Backend

1.  Navigate to the backend folder:
    ```bash
    cd Lufyco_Backend
    ```
2.  Install dependencies (first time only):
    ```bash
    npm install
    ```
3.  **Configuration**:
    *   Create a file named `.env` in this folder.
    *   Copy the contents from `.env.example` into `.env`.
    *   Add your MongoDB connection string to `MONGO_URI`.
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster...
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    *You should see: "Server is running on port 5000" and "MongoDB Connected".*

---

### Terminal 2: AI Backend (Python)

1.  Navigate to the AI folder:
    ```bash
    cd Lufyco_AI_Backend
    ```
2.  Install Python dependencies (first time only):
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the AI service:
    ```bash
    python main.py
    ```
    *You should see: "Uvicorn running on http://0.0.0.0:8000".*

---

### Terminal 3: Frontend (Mobile App)

1.  Navigate to the frontend folder:
    ```bash
    cd Lufyco_Frontend
    ```
2.  Install dependencies (first time only):
    ```bash
    npm install
    ```
3.  Start the Expo app:
    ```bash
    npx expo start
    ```
4.  **How to View**:
    *   **Mobile**: Scan the QR code with the **Expo Go** app (iOS/Android).
    *   **Emulator**: Press `a` (Android) or `i` (iOS).
    *   **Web**: Press `w` to run in a browser.

---

## 🔑 Test Credentials

*   **Email**: `test@example.com`
*   **Password**: `password123`
*(Or Register a new account in the app)*

## 📂 Project Structure

*   **/Lufyco_Backend**: Handles Users, Orders, and Database.
*   **/Lufyco_AI_Backend**: Handles Image Analysis and Recommendations.
*   **/Lufyco_Frontend**: The Mobile Application UI.
