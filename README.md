# Lufyco Clothing Application

This repository contains the source code for the Lufyco Clothing application, including the Backend (Node.js/Express) and Frontend (Expo/React Native).

## Project Structure

- **Lufyco_Backend**: Node.js & Express server connecting to MongoDB.
- **Lufyco_Frontend**: React Native application using Expo.

---

## Prerequisites

Before running the application, ensure you have the following installed:

1.  **Node.js**: [Download & Install Node.js](https://nodejs.org/) (LTS version recommended).
2.  **Git**: [Download Git](https://git-scm.com/).
3.  **MongoDB**: Ensure you have a MongoDB connection string (local or Atlas).

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Lufyco_Clothing
```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd Lufyco_Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Lufyco_Backend` directory with your Mongo URI and other secrets:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    JWT_SECRET=your_jwt_secret
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```
    *The server normally runs on `http://localhost:5000`.*

### 3. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd Lufyco_Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Expo development server:
    ```bash
    npx expo start
    ```

---

## Running the Application

### For Windows Users

1.  **Backend Termnial**:
    - Open Command Prompt or PowerShell.
    - `cd Lufyco_Backend`
    - `npm install` (Only first time)
    - `npm run dev`
2.  **Frontend Terminal**:
    - Open a new Command Prompt or PowerShell window.
    - `cd Lufyco_Frontend`
    - `npm install` (Only first time)
    - `npx expo start`
    - Press `w` to run in Web Browser, or scan the QR code with the Expo Go app on Android.

### For Mac Users

1.  **Backend Terminal**:
    - Open Terminal.
    - `cd Lufyco_Backend`
    - `npm install` (Only first time)
    - `npm run dev`
2.  **Frontend Terminal**:
    - Open a new Terminal tab/window.
    - `cd Lufyco_Frontend`
    - `npm install` (Only first time)
    - `npx expo start`
    - Press `i` to run in iOS Simulator (requires Xcode), `w` for Web, or scan the QR code with the Expo Go app.

---

## Troubleshooting

-   **MongoDB Connection Error**: Ensure your IP is whitelisted in MongoDB Atlas or your local MongoDB service is running. Check your `MONGO_URI` in `.env`.
-   **Node Modules Issues**: If you encounter errors about missing modules, delete the `node_modules` folder and `package-lock.json`, then run `npm install` again.
-   **Port Conflicts**: If port 5000 or 8081 is in use, modify the port in your `.env` or configuration.
