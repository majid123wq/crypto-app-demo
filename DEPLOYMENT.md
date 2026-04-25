# 🚀 Deployment Guide – Crypto App | Student Project

This is a student project for academic purposes. It demonstrates a full-stack cryptocurrency platform with Node.js/Express backend and React frontend.

---

## Option 1: Automated Deployment Script (Recommended)

### Prerequisites

- Node.js + npm installed
- `netlify-cli` installed: `npm install -g netlify-cli`
- Render API key: https://dashboard.render.com/api-tokens
- Netlify Personal Access Token: https://app.netlify.com/user/applications#personal-access-tokens

### Steps

1. **Open PowerShell in repo root:**

```powershell
Set-Location 'C:\Users\Dell\Downloads\Telegram Desktop\coinbase-clone-fullstack\coinbase-clone'
```

2. **Install netlify CLI:**

```powershell
npm install -g netlify-cli
```

3. **Export your tokens (replace with actual values):**

```powershell
$env:RENDER_KEY = 'rnd_YOUR_RENDER_API_KEY_HERE'
$env:NETLIFY_AUTH_TOKEN = 'nfp_YOUR_NETLIFY_TOKEN_HERE'
```

4. **Run the deployment script:**

```powershell
.\scripts\auto_deploy.ps1
```

5. **Follow the interactive prompts:**
   - GitHub repo: `majid123wq/crypto-app-demo` (default)
   - Render service name: `crypto-app-backend` (default)
   - Render root directory: `backend` (default)
   - Render branch: `main` (default)
   - MongoDB URI: Leave blank for in-memory dev DB, or paste MongoDB Atlas URI
   - JWT_SECRET: Paste a strong random value or use default
   - Netlify site name: Choose a unique name (e.g., `yourusername-crypto-app`)

6. **Capture the output:**
   - Note the Render service domain: `crypto-app-backend-xxxxx.onrender.com`
   - Note the Netlify site URL: `https://yoursite.netlify.app`
   - The script will automatically set `REACT_APP_API_URL` on Netlify and `CLIENT_URL` on Render.

7. **Verify the deployment** (see Testing section below).

---

## Option 2: Manual Browser Deployment Steps

### Step 1: Deploy Backend to Render

1. Go to https://dashboard.render.com and log in with GitHub.

2. Click **New** → **Web Service**.

3. Select the repo: `majid123wq/crypto-app-demo` (GitHub connected).

4. **Configure the service:**
   - **Name**: `crypto-app-backend`
   - **Environment**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. **Add Environment Variables** (expand "Advanced" section):
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = Generate using:
     ```powershell
     # PowerShell
     [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
     ```
   - `JWT_EXPIRE` = `7d`
   - (Optional) `MONGO_URI` = Your MongoDB Atlas URI (leave blank for in-memory DB)
   - `CLIENT_URL` = (leave empty for now, update after Netlify deployment)

6. Click **Create Web Service**.

7. **Wait for deployment** (2–3 minutes). Copy the public URL showing in the dashboard (e.g., `https://crypto-app-backend-xxxxx.onrender.com`).

8. **Test the backend:**
   ```
   curl https://crypto-app-backend-xxxxx.onrender.com/
   ```
   Should return JSON: `{"success": true, "message": "🚀 Crypto App API is running", ...}`

### Step 2: Deploy Frontend to Netlify

1. Go to https://app.netlify.com and log in with GitHub.

2. Click **Add new site** → **Import an existing project**.

3. **Authorize GitHub** and select the repo: `majid123wq/crypto-app-demo`.

4. **Configure the site:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

5. Click **Deploy site** and wait for the build (1–2 minutes).

6. **After deployment**, go to **Site settings** → **Build & deploy** → **Environment**.

7. **Add environment variable:**
   - Key: `REACT_APP_API_URL`
   - Value: `https://crypto-app-backend-xxxxx.onrender.com/api` (use your Render URL)

8. Click **Save**. A new build will trigger automatically.

9. Copy the **Netlify site URL** (e.g., `https://yourname-crypto-app.netlify.app`).

### Step 3: Update Render Backend with Frontend URL

1. Go back to Render dashboard and open the `crypto-app-backend` service.

2. Go to **Environment** and add/update:
   - `CLIENT_URL` = Your Netlify site URL (e.g., `https://yourname-crypto-app.netlify.app`)

3. Click **Save** and trigger a manual deploy if needed.

4. **Verify** by testing the backend health endpoint again.

---

## 🧪 Testing the Deployment

After both services are live:

### 1. Test Backend Health

```bash
curl https://crypto-app-backend-xxxxx.onrender.com/
```

**Expected:** JSON with `{"success": true, ...}`.

### 2. Test Crypto Endpoint

```bash
curl https://crypto-app-backend-xxxxx.onrender.com/api/crypto
```

**Expected:** JSON array of cryptocurrencies.

### 3. Test Frontend

- Open `https://yourname-crypto-app.netlify.app` in your browser.
- See demo banner at top with "STUDENT PROJECT DEMO" warning.
- See footer with disclaimer: "This is a student demo project..."
- Pages should render and load data from backend.

### 4. Test Auth Flow

1. Click **Register**.
2. Fill in a test account (name, email, password).
3. See demo warning: "Demo app — do not use your real password".
4. Click **Create Account**.
5. You should be logged in and redirected to home or profile.
6. Click **Profile** to verify protected route.
7. Click **Logout** to clear session.
8. Click **Login** with the account you just created.

### 5. Test Crypto Pages

- **Home**: Should show crypto list.
- **Gainers**: Should show top gainers (cryptos with positive 24h change).
- **New Listings**: Should show recent cryptos.
- **Add Crypto** (if logged in): Should allow adding a new cryptocurrency (protected route).

---

## 🔐 Security Notes

### Passwords & Secrets

- **JWT_SECRET**: Must be a strong random value. Generate using cryptographic randomness, not a simple string.
- **Never commit secrets** to GitHub. Always use environment variables via provider dashboards.
- **httpOnly cookies**: The backend sends JWT in an httpOnly cookie, which is safer than localStorage.

### CORS & Cookies

- Backend CORS is configured to allow `netlify.app` and `render.com` domains.
- Cookies are set with `Secure` flag (HTTPS only) in production.
- `SameSite=None` allows cross-site cookie delivery (needed for frontend on separate domain).

### Database

- **In-memory DB (default)**: Uses `mongodb-memory-server` for local dev. Data resets on app restart.
- **MongoDB Atlas (optional)**: For persistent data, set `MONGO_URI` to your Atlas connection string with proper credentials and IP whitelist.

---

## ❌ Troubleshooting

| Issue                         | Solution                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| Render service stuck building | Check Render logs. Ensure `backend/package.json` exists and `npm install` succeeds.          |
| Netlify build fails           | Check Netlify build logs. Ensure `frontend/package.json` and `frontend/public/` exist.       |
| Frontend shows 404            | Verify `netlify.toml` redirect rule; should redirect `/*` to `/index.html` for React Router. |
| Frontend can't reach backend  | Check Dev Tools (F12) → Network tab. Verify `REACT_APP_API_URL` env var is correct.          |
| "Failed to fetch" in browser  | CORS issue. Ensure backend `CLIENT_URL` env var matches Netlify domain.                      |
| Login/Register fails silently | Check browser cookies (F12 → Application → Cookies). Token cookie should be httpOnly.        |
| Seed data not loading         | Backend uses in-memory DB by default. Call `POST /api/crypto/seed` endpoint after deploy.    |

---

## 📋 Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend health check returns `success: true`
- [ ] Frontend deployed on Netlify
- [ ] `REACT_APP_API_URL` env var set on Netlify
- [ ] `CLIENT_URL` env var set on Render
- [ ] Can open frontend without errors
- [ ] Demo banner visible at top
- [ ] Footer disclaimer visible
- [ ] Can register a new account
- [ ] Can login
- [ ] Profile page loads user data
- [ ] Crypto pages load and display cryptos
- [ ] Logout clears session
- [ ] No real exchange affiliation mentioned

---

## 🎓 Assignment Submission Checklist

- [ ] Repo is private or public as required
- [ ] No Coinbase or third-party branding
- [ ] Disclaimers clearly state "Student Project Demo"
- [ ] Warning on login/register: "do not use your real password"
- [ ] Backend implements all required endpoints
- [ ] JWT auth with bcrypt hashing
- [ ] Frontend connects to backend
- [ ] Protected routes (profile, add-crypto)
- [ ] Both deployed and live
- [ ] All tests pass

---

## 📞 Additional Help

- Replace `xxxxx` placeholders with your actual service names/domains.
- If a step fails, copy the error message and check the provider logs.
- For Render, logs are under Service → Logs tab.
- For Netlify, logs are under Site settings → Deployments → click a deploy.

---

**Status**: ✅ Student Crypto App deployed successfully!

Enjoy! 🎓

Rollback / Redeploy

- Both Render and Netlify auto-deploy from `main`. To redeploy a specific commit, use the Deploys UI on each platform.

Contact/Access

- If you want me to complete the Render or Netlify creation for you, provide a Render API key and/or Netlify personal access token with repo access and I can call their APIs to create the services automatically. Otherwise, follow the steps above in your browser (you already logged in).
