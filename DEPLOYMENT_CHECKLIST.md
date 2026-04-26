# ✅ Deployment Checklist

## Pre-Deployment (Completed ✓)

- [x] Backend code written and tested locally
- [x] Frontend code written and tested locally
- [x] Auth endpoints working (register, login, profile)
- [x] Market data endpoint fetching live CoinGecko data
- [x] Environment variables configured (.env.example, .env)
- [x] CORS configured for production
- [x] GitHub repo pushed: https://github.com/majid123wq/crypto-app-demo
- [x] Render service created: `srv-d7n4ctho3t8c73efm8q0`
- [x] Netlify site created and linked
- [x] Deploy helper scripts ready (deploy.js)

## Deployment Tasks (Your Turn)

### Task 1: Fix Render Root Directory & Set Env Vars

- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] Find service: `srv-d7n4ctho3t8c73efm8q0`
- [ ] Settings → Root Directory: **Change to `backend`** (lowercase!)
- [ ] Settings → Environment → Add:
  - [ ] `NODE_ENV = production`
  - [ ] `JWT_SECRET = <generate random string>`
  - [ ] `JWT_EXPIRE = 7d`
  - [ ] `CLIENT_URL = https://<YOUR_NETLIFY_URL>.netlify.app`
  - [ ] `MONGO_URI = (leave blank for demo)`
- [ ] Deployments → Click "Deploy Latest"
- [ ] Wait 2–5 minutes for build & deployment
- [ ] Copy your backend domain (e.g., `https://crypto-app-demo.onrender.com`)

### Task 2: Configure Frontend on Netlify

- [ ] Go to [Netlify Dashboard](https://app.netlify.com)
- [ ] Find your site (or connect GitHub repo)
- [ ] Settings → Build & Deploy → Environment
- [ ] Add `REACT_APP_API_URL = https://crypto-app-demo.onrender.com/api`
  - (Use YOUR Render domain from Task 1)
- [ ] Deployments → Trigger deploy (or wait for auto-deploy from git push)
- [ ] Copy your frontend domain (e.g., `https://your-site.netlify.app`)

### Task 3: Verify Live Deployment

- [ ] Test backend: `https://crypto-app-demo.onrender.com/`
  - Should return JSON: `{ "success": true, "message": "🚀 Crypto App API is running" }`
- [ ] Test market data: `https://crypto-app-demo.onrender.com/api/market`
  - Should return 50 cryptos with live prices
- [ ] Visit frontend: `https://your-site.netlify.app`
  - Should show Crypto Markets page with data table
- [ ] (Optional) Try register/login flow on frontend

### Task 4: Submit Assignment

- [ ] Repo: https://github.com/majid123wq/crypto-app-demo
- [ ] Backend URL: `https://crypto-app-demo.onrender.com`
- [ ] Frontend URL: `https://your-netlify-site.netlify.app`
- [ ] All endpoints responding
- [ ] Both services live and connected

---

## Useful Commands

```powershell
# Run backend locally (if needed)
cd backend
npm install
npm run dev

# Run frontend locally (if needed)
cd frontend
npm install
npm start

# Run deploy helper (if you have provider tokens)
$env:RENDER_KEY = "your_key"
$env:NETLIFY_AUTH_TOKEN = "your_token"
$env:RENDER_SERVICE_ID = "srv-d7n4ctho3t8c73efm8q0"
node deploy.js
```

---

## Key Files Reference

- Backend config: `backend/.env.example`
- Frontend config: `frontend/.env.example`
- Render IaC: `render.yaml`
- Netlify config: `netlify.toml`
- Full guide: `FINAL_DEPLOY_GUIDE.md`

---

**Status: Ready for Production Deploy ✅**  
**Last Updated: 26 April 2026**
