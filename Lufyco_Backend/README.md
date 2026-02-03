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
