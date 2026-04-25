# Crypto App – Full-Stack Integration (Student Project)

> **DISCLAIMER:** This is a student project for academic purposes only. It is NOT affiliated with, endorsed by, or connected to any real exchange. Do not enter real personal or financial information.

---

## 📋 Assignment Overview

This project implements a full-stack cryptocurrency platform with:

- JWT-based authentication (register, login, logout, protected routes)
- Protected user profile page
- Crypto market data (all assets, top gainers, new listings)
- Add new cryptocurrency (authenticated users only)
- MongoDB database with Mongoose schemas
- React frontend with full routing

---

## 🗂 Project Structure

```
project/
├── backend/               # Node.js + Express + MongoDB API
│   ├── config/db.js       # MongoDB connection
│   ├── controllers/       # Business logic
│   ├── middleware/auth.js  # JWT protection
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/              # React SPA
    ├── public/            # Static files + _redirects
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── context/       # React Context (Auth)
    │   ├── pages/         # Route pages
    │   └── utils/api.js   # Axios instance
    ├── .env
    └── package.json
```

---

## 🚀 Local Setup & Running

### Prerequisites

- Node.js v18+ installed
- MongoDB installed and running locally (`mongod`)
- npm or yarn

---

### 1. Start MongoDB (optional)

If you have MongoDB installed locally you can run it, otherwise the backend will start an in-memory database for development.

```bash
# macOS/Linux
mongod

# Windows (run as administrator)
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```

---

### 2. Backend Setup

```bash
cd coinbase-clone/backend
npm install
# .env is already configured for local dev
npm run dev
```

Backend runs on: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd coinbase-clone/frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

### 4. Seed Sample Data

After both servers are running, click the **"🌱 Seed Sample Data"** button on the homepage, or call:

```
POST http://localhost:5000/api/crypto/seed
```

---

## 📡 API Endpoints

| Method | Endpoint              | Access       | Description            |
| ------ | --------------------- | ------------ | ---------------------- |
| POST   | `/api/auth/register`  | Public       | Register new user      |
| POST   | `/api/auth/login`     | Public       | Login user             |
| GET    | `/api/auth/profile`   | 🔒 Protected | Get user profile       |
| POST   | `/api/auth/logout`    | 🔒 Protected | Logout                 |
| GET    | `/api/crypto`         | Public       | All cryptocurrencies   |
| GET    | `/api/crypto/gainers` | Public       | Top gainers            |
| GET    | `/api/crypto/new`     | Public       | New listings           |
| POST   | `/api/crypto`         | 🔒 Protected | Add new cryptocurrency |
| POST   | `/api/crypto/seed`    | Public       | Seed sample data (dev) |

---

## 🌍 Deployment

### Backend — Render

1. Push the repository to GitHub (backend is in the `backend/` folder).
2. Create new **Web Service** on Render.
3. Use these settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables in Render dashboard (example):
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cryptoapp
   JWT_SECRET=your_production_secret_here
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=https://yourname-crypto-app.netlify.app
   ```

### Frontend — Netlify

1. Push the repository to GitHub (frontend is in the `frontend/` folder).
2. Create new Netlify site from GitHub.
3. Use these settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```
5. Choose a neutral site name (do NOT include "coinbase").

---

## ✅ Compliance Checklist (Netlify)

- [x] Site title: "Crypto App | Student Project" (not "Coinbase")
- [x] Warning banner at top: "STUDENT PROJECT DEMO – NOT affiliated with Coinbase"
- [x] Footer disclaimer: "Demo project – do not enter real personal information"
- [x] Login page notice: "Demo app – do not use your real password"
- [x] Register page notice: "Demo app – do not use your real password or personal information"
- [x] `<meta name="robots" content="noindex, nofollow">` in index.html
- [ ] **You must:** rename Netlify site to avoid "coinbase" in the URL

---

## 🔑 Environment Variables Reference

### Backend `.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cryptoapp
JWT_SECRET=supersecretjwtkey123changeInProduction
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 👨‍💻 Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Context API
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Deployment:** Netlify (frontend), Render (backend), MongoDB Atlas (database)
