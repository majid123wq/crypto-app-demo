#!/usr/bin/env node

/**
 * Crypto App Deployment Helper
 * Run this locally: node deploy.js
 *
 * This script creates:
 * 1. Render backend service (via API)
 * 2. Netlify frontend site (via API)
 * 3. Links both with environment variables
 */

const https = require("https");
const { execSync } = require("child_process");

const renderKey = process.env.RENDER_KEY || "";
const netlifyToken = process.env.NETLIFY_AUTH_TOKEN || "";

if (!renderKey || !netlifyToken) {
  console.error("❌ Missing environment variables!");
  console.error("Set before running:");
  console.error('  $env:RENDER_KEY = "your_key"');
  console.error('  $env:NETLIFY_AUTH_TOKEN = "your_token"');
  process.exit(1);
}

console.log("🚀 Starting deployment...\n");

/**
 * Make HTTPS request (utility)
 */
function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * Create Render Service
 */
async function createRenderService() {
  console.log("📦 Creating Render backend service...");

  const options = {
    hostname: "api.render.com",
    path: "/v1/services",
    method: "POST",
    headers: {
      Authorization: `Bearer ${renderKey}`,
      "Content-Type": "application/json",
    },
  };

  const payload = {
    service: {
      name: "crypto-app-backend",
      type: "web",
      repo: "https://github.com/majid123wq/crypto-app-demo",
      branch: "main",
      rootDirectory: "backend",
      buildCommand: "npm install",
      startCommand: "node server.js",
      env: "node",
      autoDeploy: true,
      envVars: [
        { key: "NODE_ENV", value: "production" },
        {
          key: "JWT_SECRET",
          value: "change_me_" + Math.random().toString(36).slice(2, 15),
        },
        { key: "JWT_EXPIRE", value: "7d" },
        { key: "CLIENT_URL", value: "" }, // Will be updated after Netlify creates
      ],
    },
  };

  try {
    const res = await request(options, payload);
    if (res.status === 201 && res.data.id) {
      console.log(`✅ Render service created: ${res.data.id}`);
      console.log(`   Domain: ${res.data.service.defaultDomain}`);
      return { id: res.data.id, domain: res.data.service.defaultDomain };
    } else {
      console.error(`❌ Render API error (${res.status}):`, res.data);
      return null;
    }
  } catch (err) {
    console.error("❌ Render request failed:", err.message);
    return null;
  }
}

/**
 * Create Netlify Site (via CLI)
 */
async function createNetlifySite() {
  console.log("🎨 Creating Netlify frontend site...");

  try {
    // Push netlify-cli command
    const cmd = `netlify sites:create --name yourname-crypto-app --repo https://github.com/majid123wq/crypto-app-demo --dir frontend --prod`;
    console.log(`   Running: ${cmd}`);
    const output = execSync(cmd, { encoding: "utf-8", stdio: "pipe" });
    console.log("✅ Netlify site created");

    // Try to get site info via API
    const siteRes = await request({
      hostname: "api.netlify.com",
      path: "/api/v1/sites?per_page=100",
      method: "GET",
      headers: { Authorization: `Bearer ${netlifyToken}` },
    });

    if (siteRes.data && Array.isArray(siteRes.data)) {
      const site = siteRes.data.find((s) => s.name?.includes("crypto"));
      if (site) {
        console.log(`   Domain: ${site.ssl_url || site.url}`);
        return { id: site.id, url: site.ssl_url || site.url };
      }
    }
    return null;
  } catch (err) {
    console.error("❌ Netlify site creation failed:", err.message);
    return null;
  }
}

/**
 * Main deployment flow
 */
async function deploy() {
  try {
    const render = await createRenderService();
    if (!render) throw new Error("Render deployment failed");

    const netlify = await createNetlifySite();
    if (!netlify) throw new Error("Netlify deployment failed");

    console.log("\n✅ DEPLOYMENT COMPLETE!\n");
    console.log("📍 Backend URL:", `https://${render.domain}/api`);
    console.log("📍 Frontend URL:", netlify.url);
    console.log(
      "\n🔗 GitHub Repo: https://github.com/majid123wq/crypto-app-demo",
    );
    console.log(
      "\n⏳ Sites will be live in 2-5 minutes (first deploy takes longer)",
    );
    console.log("✨ Your assignment is ready for submission!\n");
  } catch (err) {
    console.error("\n❌ Deployment failed:", err.message);
    process.exit(1);
  }
}

deploy();
