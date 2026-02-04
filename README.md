# Lufyco Clothing Application

This repository contains the source code for the Lufyco Clothing application, including the Backend (Node.js/Express) and Frontend (Expo/React Native).

## Project Structure

- **Lufyco_Backend**: Node.js & Express server connecting to MongoDB.
- **Lufyco_Frontend**: React Native application using Expo.

## Key Features

✨ **Email Authentication System**
- Email validation (supports Gmail, Yahoo, Outlook, and more)
- OTP-based email verification
- 6-digit verification codes sent via email
- Secure signup and login flow

---

## Prerequisites

Before running the application, ensure you have the following installed:

1.  **Node.js**: [Download & Install Node.js](https://nodejs.org/) (LTS version recommended).
2.  **Git**: [Download Git](https://git-scm.com/).
3.  **MongoDB**: Ensure you have a MongoDB connection string (local or Atlas).
4.  **Gmail Account** (for email verification): Optional but recommended for full functionality.

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
3.  Create a `.env` file in the `Lufyco_Backend` directory with your configuration:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5001
    JWT_SECRET=your_jwt_secret
    
    # Email Configuration (Optional - for email verification)
    EMAIL_SERVICE=gmail
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASSWORD=your-gmail-app-password
    ```
    
    > **Note**: To enable email verification, you need a Gmail app password. See [Email Setup Guide](#email-verification-setup) below.

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

## Email Verification Setup

The application includes email-based OTP verification for user signups.

### Quick Setup (Gmail)

1.  **Enable 2-Factor Authentication** on your Gmail account
2.  **Generate App Password**:
    - Go to [Google Account Security](https://myaccount.google.com/security)
    - Click "App passwords" (under 2-Step Verification)
    - Select "Mail" and generate a password
    - Copy the 16-character password

3.  **Update `.env` file**:
    ```env
    EMAIL_SERVICE=gmail
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASSWORD=paste-16-char-password-here
    ```

4.  **Restart the backend server** for changes to take effect

### Testing Without Email

The system works without email credentials configured. OTP codes will be printed in the backend console logs, which you can use for testing.

### Supported Email Providers

The signup system validates emails from:
- Gmail (@gmail.com)
- Yahoo (@yahoo.com)
- Outlook (@outlook.com)
- Hotmail (@hotmail.com)
- iCloud (@icloud.com)
- ProtonMail (@protonmail.com)
- AOL (@aol.com)

---

## Running the Application

### For Windows Users

1.  **Backend Terminal**:
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

## API Endpoints

### Authentication

- `POST /api/users/register` - Register new user (sends OTP email)
- `POST /api/users/verify-email` - Verify email with OTP code
- `POST /api/users/resend-otp` - Resend verification code
- `POST /api/users/login` - Login (requires verified email)

### Other Endpoints

- `GET /api/products` - Get all products
- `POST /api/cart` - Add to cart
- `GET /api/orders` - Get user orders
- And more...

---

## User Flow

1. **Signup** → User enters name, email (validated), and password
2. **OTP Sent** → 6-digit code sent to email (valid for 10 minutes)
3. **Verification** → User enters OTP code
4. **Login** → User can now login with verified account

---

## Troubleshooting

### Common Issues

-   **MongoDB Connection Error**: Ensure your IP is whitelisted in MongoDB Atlas or your local MongoDB service is running. Check your `MONGO_URI` in `.env`.
-   **Node Modules Issues**: If you encounter errors about missing modules, delete the `node_modules` folder and `package-lock.json`, then run `npm install` again.
-   **Port Conflicts**: If port 5001 or 8081 is in use, modify the port in your `.env` or configuration.

### Email-Related Issues

-   **Email Not Received**: Check spam folder, verify EMAIL_USER and EMAIL_PASSWORD are correct
-   **Invalid Login Error**: Make sure you're using the Gmail app password, not your regular password
-   **OTP Not Working**: Check backend console logs for the generated OTP code
-   **Email Provider Not Supported**: Use an email from one of the supported providers listed above

### Offline Testing

Use these test credentials to login without email verification:
- **Email**: `user`
- **Password**: `user`

---

## Dependencies

### Backend
- Express.js - Web framework
- MongoDB & Mongoose - Database
- Nodemailer - Email sending
- Validator - Email validation
- CORS - Cross-origin resource sharing
- dotenv - Environment variables

### Frontend
- React Native - Mobile framework
- Expo - Development platform
- Zustand - State management
- React Navigation - Navigation
- Axios - HTTP client

---

## License

This is a Final Year Project for educational purposes.
