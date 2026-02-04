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
