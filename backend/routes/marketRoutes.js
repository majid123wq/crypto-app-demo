const express = require("express");
const router = express.Router();
const { getMarketData, getCoins } = require("../controllers/marketController");

// GET /api/market - combined market data
router.get("/", getMarketData);

// GET /api/coins - list of coins (names/symbols)
router.get("/coins", getCoins);

module.exports = router;
