# Lufyco Clothing Application

This repository contains the source code for the Lufyco Clothing application, including the Backend (Node.js/Express) and Frontend (Expo/React Native).

## Project Structure

- **Lufyco_Backend**: Node.js & Express server connecting to MongoDB.
- **Lufyco_Frontend**: React Native application using Expo.

---

## Requirements / Dependencies

### Backend (Node.js)

| Package | Version |
|---------|---------|
| @tensorflow/tfjs | ^4.22.0 |
| axios | ^1.13.5 |
| cloudinary | ^2.9.0 |
| cors | ^2.8.5 |
| dotenv | ^17.2.3 |
| express | ^5.2.1 |
| mongoose | ^9.1.3 |
| multer | ^2.0.2 |
| nodemailer | ^7.0.13 |
| sharp | ^0.34.5 |
| validator | ^13.15.26 |

**Dev Dependencies:**

| Package | Version |
|---------|---------|
| nodemon | ^3.1.11 |

### Python (ML Model Training)

| Package | Version |
|---------|---------|
| tensorflow-gpu | >=2.13.0 |
| tensorflowjs | >=4.0.0 |
| numpy | >=1.24.0 |
| Pillow | >=10.0.0 |
| matplotlib | >=3.7.0 |

### Frontend (Expo / React Native)

| Package | Version |
|---------|---------|
| @expo/vector-icons | ^14.0.2 |
| @react-native-async-storage/async-storage | ^2.2.0 |
| @react-navigation/bottom-tabs | ^7.2.0 |
| @react-navigation/native | ^7.0.14 |
| @react-navigation/stack | ^7.1.1 |
| axios | ^1.7.9 |
| dayjs | ^1.11.18 |
| expo | ^52.0.47 |
| expo-blur | ~14.0.3 |
| expo-constants | ~17.0.5 |
| expo-device | ^8.0.10 |
| expo-font | ~13.0.3 |
| expo-haptics | ~14.0.1 |
| expo-image-picker | ~16.0.6 |
| expo-linking | ~7.0.5 |
| expo-location | ~18.0.10 |
| expo-notifications | ^0.32.16 |
| expo-router | ~4.0.17 |
| expo-splash-screen | ~0.29.21 |
| expo-status-bar | ~2.0.1 |
| expo-symbols | ~0.2.2 |
| expo-system-ui | ~4.0.8 |
| expo-web-browser | ~14.0.2 |
| react | 18.3.1 |
| react-dom | 18.3.1 |
| react-native | 0.76.7 |
| react-native-gesture-handler | ~2.20.2 |
| react-native-pager-view | ^6.7.0 |
| react-native-reanimated | ~3.16.1 |
| react-native-safe-area-context | ^4.12.0 |
| react-native-screens | ~4.4.0 |
| react-native-ui-datepicker | ^3.1.2 |
| react-native-vector-icons | ^10.2.0 |
| react-native-web | ~0.19.13 |
| react-native-webview | 13.12.5 |
| zustand | ^5.0.10 |

**Dev Dependencies:**

| Package | Version |
|---------|---------|
| @babel/core | ^7.25.2 |
| @types/jest | ^29.5.12 |
| @types/react | ~18.3.12 |
| @types/react-test-renderer | ^18.3.0 |
| jest | ^29.2.1 |
| jest-expo | ~52.0.3 |
| react-test-renderer | 18.3.1 |
| typescript | ^5.3.3 |

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
    PORT=5001
    JWT_SECRET=your_jwt_secret
    
    # Email Configuration (REQUIRED for email verification)
    # For Gmail: Enable 2FA and create an app-specific password
    # Visit: https://myaccount.google.com/apppasswords
    EMAIL_SERVICE=gmail
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASSWORD=your-app-specific-password
    ```
    
    **Email Setup (Important):**
    - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
    - Enable 2-Factor Authentication if not already enabled
    - Generate a new app password for "Mail"
    - Copy the 16-character password and paste it as `EMAIL_PASSWORD`
    - Use your actual Gmail address as `EMAIL_USER`
4.  Start the backend server:
    ```bash
    npm run dev
    ```
    *The server normally runs on `http://localhost:5001`.*

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

## Features

### 🔐 Email Authentication & Verification

The application includes a comprehensive email authentication system with OTP (One-Time Password) verification:

#### Supported Email Providers
Users can sign up with the following email providers:
- **Gmail** (gmail.com)
- **Yahoo** (yahoo.com)
- **Outlook/Hotmail** (outlook.com, hotmail.com)
- **iCloud** (icloud.com)
- **ProtonMail** (protonmail.com)
- **AOL** (aol.com)
- **Mail.com** (mail.com)
- **Zoho** (zoho.com)

#### How It Works

1. **Signup:**
   - User enters name, email, password
   - Email is validated against supported providers
   - Real-time validation with visual feedback (green checkmark for valid emails)
   - 6-digit OTP is generated and sent to the email
   - User is redirected to verification screen

2. **Email Verification:**
   - User receives verification code via email
   - Enters code using numeric keypad interface
   - OTP expires after 10 minutes
   - Can request a new code using "Resend Code" button

3. **Login:**
   - Users must verify their email before logging in
   - Login attempts with unverified emails show helpful error message
   - Once verified, users can login normally

#### Email Validation Rules

**During Signup:**
- ✅ Only emails from supported providers are accepted
- ✅ Email format is validated (must be valid RFC 5322 format)
- ❌ Invalid formats or unsupported providers are rejected with clear error messages

**During Login:**
- ✅ Any previously verified email can login
- ❌ Unverified accounts receive error: "Please verify your email before logging in"

---

## Troubleshooting

-   **MongoDB Connection Error**: Ensure your IP is whitelisted in MongoDB Atlas or your local MongoDB service is running. Check your `MONGO_URI` in `.env`.
-   **Node Modules Issues**: If you encounter errors about missing modules, delete the `node_modules` folder and `package-lock.json`, then run `npm install` again.
-   **Port Conflicts**: If port 5001 or 8081 is in use, modify the port in your `.env` or configuration.
-   **Email Not Sending**: 
    - Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correctly set in `.env`
    - Ensure you're using an app-specific password, not your regular Gmail password
    - Check that 2-Factor Authentication is enabled on your Gmail account
    - Restart the backend server after updating `.env` file
-   **Email Verification Fails**:
    - Check your spam/junk folder for verification emails
    - OTP codes expire after 10 minutes - request a new code if expired
    - Ensure the email address entered matches exactly (case-sensitive)

---

## Default Test Account

For offline testing without database connection:
- **Username**: user
- **Password**: user

> **Note:** This bypasses email verification and database checks.
