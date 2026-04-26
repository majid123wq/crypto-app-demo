const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = new Set([
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
]);

// Add Netlify site (frontend) to allowed origins when provided
if (process.env.CLIENT_URL) allowedOrigins.add(process.env.CLIENT_URL);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, mobile apps)
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        const hostname = url.hostname;
        // Allow known hosting domains or the configured client URL
        if (
          allowedOrigins.has(origin) ||
          allowedOrigins.has(`${url.protocol}//${hostname}`) ||
          hostname.endsWith("netlify.app") ||
          hostname.endsWith("render.com") ||
          hostname.endsWith("vercel.app")
        ) {
          return callback(null, true);
        }
      } catch (e) {
        // If parsing fails, allow only if exact match
        if (allowedOrigins.has(origin)) return callback(null, true);
      }
      // In production, be strict; in development allow localhost
      if (process.env.NODE_ENV !== "production") return callback(null, true);
      return callback(
        new Error("CORS policy: This origin is not allowed: " + origin),
      );
    },
    credentials: true,
  }),
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Crypto App API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      crypto: "/api/crypto",
    },
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/crypto", require("./routes/cryptoRoutes"));
app.use("/api/market", require("./routes/marketRoutes"));

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/register`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`  GET    http://localhost:${PORT}/api/auth/profile`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/logout`);
  console.log(`  GET    http://localhost:${PORT}/api/crypto`);
  console.log(`  GET    http://localhost:${PORT}/api/crypto/gainers`);
  console.log(`  GET    http://localhost:${PORT}/api/crypto/new`);
  console.log(`  POST   http://localhost:${PORT}/api/crypto`);
  console.log(`  POST   http://localhost:${PORT}/api/crypto/seed (dev only)\n`);
});
