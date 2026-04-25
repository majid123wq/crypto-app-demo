Render (Backend) — Quick Setup

1. In Render (already logged in), click **New** → **Web Service** → **Connect a repository** and select `majid123wq/crypto-app-demo`.
2. For the service settings use:
   - Name: `crypto-app-backend`
   - Environment: `Node`
   - Root Directory: `backend`
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Auto-Deploy: ON
3. Add Environment Variables (Render Dashboard > Environment > Add):
   - `MONGO_URI` = `mongodb+srv://<USER>:<PASSWORD>@<cluster>.mongodb.net/cryptoapp` (or leave blank to use in-memory DB for dev)
   - `JWT_SECRET` = a long random string (e.g. `supersecret_change_me_please`)
   - `JWT_EXPIRE` = `7d`
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://<your-netlify-site>.netlify.app`
4. Deploy — Click "Create Web Service" and wait for build logs. The public URL will be something like `https://crypto-app-backend-xxxxx.onrender.com`.

Netlify (Frontend) — Quick Setup

1. In Netlify (already logged in), click **New site from Git** → GitHub and pick `majid123wq/crypto-app-demo`.
2. Configure the site:
   - Branch to deploy: `main`
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
   - Auto-publish deploys: ON
3. Add Build Environment Variables (Site settings → Build & deploy → Environment):
   - `REACT_APP_API_URL` = `https://<your-render-backend>.onrender.com/api`
4. Deploy — Click "Deploy site". After build completes, note the Site URL (e.g., `https://yourname-crypto-app.netlify.app`).

Important post-deploy steps

- Update Render `CLIENT_URL` env var to the Netlify site URL.
- Ensure Render backend `JWT_SECRET` is strong and not shared publicly.
- If you used `MONGO_URI` (Atlas), ensure IP access/whitelist and credentials are correct.
- Confirm CORS: the backend server accepts `CLIENT_URL` from `process.env.CLIENT_URL`.

Verification

- Backend health:
  `curl https://<your-render-backend>.onrender.com/`
  Expect JSON with `success: true`.

- Frontend reachable:
  Open the Netlify site URL in a browser.

- Register/login flow:
  Use the frontend UI to register and login. The app uses httpOnly cookie authentication by default.

Rollback / Redeploy

- Both Render and Netlify auto-deploy from `main`. To redeploy a specific commit, use the Deploys UI on each platform.

Contact/Access

- If you want me to complete the Render or Netlify creation for you, provide a Render API key and/or Netlify personal access token with repo access and I can call their APIs to create the services automatically. Otherwise, follow the steps above in your browser (you already logged in).
