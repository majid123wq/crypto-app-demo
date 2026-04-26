# Crypto App | Student Project — Final Deployment Guide

## Status: Ready for Production Deploy ✅

Your crypto app is **fully built and tested locally**. This guide walks you through the final steps to deploy to Render (backend) and Netlify (frontend).

---

## Quick Summary

| Component       | Status                     | Location                                                     |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| **Backend**     | ✅ Ready                   | GitHub: `backend/`                                           |
| **Frontend**    | ✅ Ready                   | GitHub: `frontend/`                                          |
| **Code Repo**   | ✅ Pushed                  | https://github.com/majid123wq/crypto-app-demo                |
| **Backend API** | ✅ Tested Locally          | http://localhost:5000                                        |
| **Market Data** | ✅ CoinGecko Integration   | GET `/api/market` (50 top coins)                             |
| **Auth**        | ✅ JWT in httpOnly Cookies | `/api/auth/register`, `/api/auth/login`, `/api/auth/profile` |

---

## What's Deployed Locally (Verified)

✅ Backend REST API (Express + Node.js)

- Health endpoint: `GET /` → returns JSON success
- Market data: `GET /api/market` → 50 live crypto prices from CoinGecko
- Auth: `/api/auth/{register, login, logout, profile}`
- Crypto data: `/api/crypto`, `/api/crypto/gainers`, `/api/crypto/new`
- Fallback: In-memory MongoDB with sample seed data

✅ Frontend (React + Create React App)

- Configured to use `REACT_APP_API_URL` env var
- Fetches market data from backend `/api/market` endpoint
- Cookie-based auth (httpOnly secure tokens)
- Responsive UI with dark theme

✅ Environment Setup

- Backend: `.env.example` with all required variables
- Frontend: `.env.example` and `.env` with Render backend URL

---

## Deployment Steps

### Step 1: Set Up Render Backend (Your Render Service ID)

**Your Render Service ID:** `srv-d7n4ctho3t8c73efm8q0`

#### Option A: Use Deploy Helper (Recommended)

Run this locally on your machine (Windows PowerShell):

```powershell
$env:RENDER_KEY = "your_render_api_key_here"
$env:NETLIFY_AUTH_TOKEN = "your_netlify_token_here"
$env:RENDER_SERVICE_ID = "srv-d7n4ctho3t8c73efm8q0"

node deploy.js
```

This script will:

1. Set environment variables on your Render service
2. Create/configure Netlify site
3. Output live URLs when complete

#### Option B: Manual Render UI Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your service: `srv-d7n4ctho3t8c73efm8q0`
3. **Settings → Root Directory:** Change from `Backend` to `backend` (lowercase)
4. **Settings → Environment:** Add these variables:
   ```
   NODE_ENV = production
   JWT_SECRET = (generate: openssl rand -base64 32 OR use random value)
   JWT_EXPIRE = 7d
   CLIENT_URL = https://your-netlify-domain.netlify.app
   MONGO_URI = (leave blank for in-memory DB demo, or paste MongoDB Atlas URI)
   COIN_API_KEY = (optional, for external providers)
   ```
5. **Deployments:** Click "Deploy Latest" or wait for auto-deploy
6. Copy your backend domain: `https://crypto-app-demo.onrender.com` (example)

---

### Step 2: Configure & Deploy Frontend to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Find your site (or create new: `Deploy from Git` → select your GitHub repo)
3. **Settings → Build & Deploy → Environment:**
   - Add `REACT_APP_API_URL = https://crypto-app-demo.onrender.com/api`
   - (Replace with YOUR Render domain)
4. **Deployments:** Trigger manual deploy or wait for auto-deploy from git
5. Copy your frontend URL: `https://your-site.netlify.app`

---

### Step 3: Verify Live Endpoints

Once both services are deployed, test these in your browser or terminal:

```powershell
# Backend health
curl https://crypto-app-demo.onrender.com/

# Market data (50 top cryptos)
curl https://crypto-app-demo.onrender.com/api/market

# Frontend
open https://your-netlify-site.netlify.app
```

Expected responses:

- Backend `/` → `{ "success": true, "message": "🚀 Crypto App API is running" }`
- Backend `/api/market` → `{ "success": true, "data": [...50 cryptos...] }`
- Frontend → Crypto Markets page with live prices

---

## Local Development Reference

If you want to run both locally again later:

```powershell
# Terminal 1: Backend
cd backend
npm install
npm run dev
# Listens on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm install
npm start
# Listens on http://localhost:3000
# Auto-reads REACT_APP_API_URL from .env
```

---

## Environment Variables Explained

### Backend (.env)

| Variable       | Example                        | Purpose                                     |
| -------------- | ------------------------------ | ------------------------------------------- |
| `PORT`         | `5000`                         | Server port                                 |
| `NODE_ENV`     | `production`                   | Enables production mode (CORS strict, etc.) |
| `JWT_SECRET`   | `random_string_32_chars`       | Signing JWT tokens (keep secret!)           |
| `JWT_EXPIRE`   | `7d`                           | How long tokens stay valid                  |
| `CLIENT_URL`   | `https://yoursite.netlify.app` | Frontend domain for CORS                    |
| `MONGO_URI`    | empty or MongoDB URI           | Database connection (empty = in-memory)     |
| `COIN_API_KEY` | (optional)                     | External crypto API key                     |

### Frontend (.env)

| Variable            | Example                                    | Purpose           |
| ------------------- | ------------------------------------------ | ----------------- |
| `REACT_APP_API_URL` | `https://crypto-app-demo.onrender.com/api` | Backend API URL   |
| `NODE_ENV`          | `production`                               | Build environment |

---

## What Each Endpoint Does

### Auth

- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Login (receives JWT cookie)
- `GET /api/auth/profile` — Get logged-in user (requires cookie)
- `POST /api/auth/logout` — Clear session

### Market Data

- `GET /api/market` — Top 50 cryptos by market cap (live from CoinGecko)
- `GET /api/market/coins` — List of 200+ coins

### Crypto DB

- `GET /api/crypto` — All cryptos in database
- `GET /api/crypto/gainers` — Sort by 24h gain
- `GET /api/crypto/new` — New listings
- `POST /api/crypto` — Add new crypto (protected)
- `POST /api/crypto/seed` — Seed demo data

---

## Troubleshooting

### "Domain not found" on Render

- Render takes 2-5 min to provision first time
- Check Render dashboard Deployments tab for build logs
- Ensure Root Directory is `backend` (not `Backend`)

### Frontend shows "API Error"

- Verify `REACT_APP_API_URL` is set in Netlify env vars
- Redeploy frontend after setting env var
- Check browser console for CORS errors

### "Too many redirects" or CORS error

- Ensure `CLIENT_URL` on backend matches your Netlify domain
- Check frontend `.env` has correct backend URL

### No market data showing

- Backend `/api/market` falls back to sample data if CoinGecko is down
- Always shows at least 2 sample coins (Bitcoin, Ethereum)

---

## Project Structure

```
coinbase-clone/
├── backend/
│   ├── server.js              # Express entrypoint
│   ├── package.json           # Node deps
│   ├── .env.example           # Env template
│   ├── config/
│   │   └── db.js              # MongoDB config + in-memory fallback
│   ├── controllers/
│   │   ├── authController.js  # JWT + httpOnly cookies
│   │   ├── cryptoController.js # Crypto CRUD
│   │   └── marketController.js # CoinGecko integration
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cryptoRoutes.js
│   │   └── marketRoutes.js
│   └── middleware/
│       └── auth.js            # JWT verification
├── frontend/
│   ├── package.json
│   ├── public/index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── utils/
│   │   │   └── api.js         # Axios instance (reads REACT_APP_API_URL)
│   │   ├── pages/
│   │   │   └── Home.js        # Fetches /api/market, displays table
│   │   ├── components/
│   │   │   └── CryptoTable.js # Data display
│   │   └── context/
│   │       └── AuthContext.js # User & JWT state
│   ├── .env        # Local override (gitignored)
│   └── .env.example
├── render.yaml       # Render IaC config
├── netlify.toml      # Netlify config
├── deploy.js         # CLI helper (set env vars + deploy)
├── scripts/
│   └── auto_deploy.ps1  # PowerShell automation
└── README.md

```

---

## Support & Next Steps

1. **Deploy using the helper script** (Option A above) or manually via Render/Netlify UI (Option B)
2. **Get your live URLs** and test endpoints
3. **Verify frontend loads** and market data displays
4. **Submit your assignment** with:
   - GitHub repo: https://github.com/majid123wq/crypto-app-demo
   - Live backend URL: `https://crypto-app-demo.onrender.com`
   - Live frontend URL: `https://your-netlify-site.netlify.app`

**All code is pushed to GitHub. You're ready to deploy!** 🚀

---

_Last updated: 26 April 2026_  
_Project: Crypto App | Student Project_  
_Stack: Node.js + Express + React + Render + Netlify_
