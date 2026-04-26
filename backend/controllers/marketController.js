const axios = require("axios");

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const FALLBACK_SAMPLE = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    current_price: 67000,
    market_cap: 1200000000000,
    price_change_percentage_24h: 1.5,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    current_price: 3500,
    market_cap: 400000000000,
    price_change_percentage_24h: 2.1,
  },
];

async function fetchWithRetry(url, opts = {}, retries = 2, timeout = 8000) {
  for (let i = 0; i <= retries; i++) {
    try {
      const source = axios.CancelToken.source();
      const timer = setTimeout(
        () => source.cancel(`timeout ${timeout}ms`),
        timeout,
      );
      const res = await axios.get(url, { ...opts, cancelToken: source.token });
      clearTimeout(timer);
      return res.data;
    } catch (err) {
      if (axios.isCancel(err)) {
        if (i === retries) throw err;
        continue;
      }
      if (i === retries) throw err;
      // small delay before retry
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

// GET /api/market
const getMarketData = async (req, res) => {
  try {
    // Fetch top coins market data from CoinGecko
    const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h`;
    const data = await fetchWithRetry(
      url,
      { headers: { Accept: "application/json" } },
      2,
      8000,
    ).catch((e) => null);
    if (!data) {
      return res
        .status(200)
        .json({ success: true, source: "fallback", data: FALLBACK_SAMPLE });
    }
    // normalize
    const normalized = data.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      price: c.current_price,
      marketCap: c.market_cap,
      change24h: c.price_change_percentage_24h,
      image: c.image,
    }));
    res.json({ success: true, source: "coingecko", data: normalized });
  } catch (error) {
    console.error("Market error:", error.message || error);
    return res
      .status(200)
      .json({ success: true, source: "fallback", data: FALLBACK_SAMPLE });
  }
};

// GET /api/market/coins
const getCoins = async (req, res) => {
  try {
    const url = `${COINGECKO_BASE}/coins/list`;
    const data = await fetchWithRetry(url, {}, 2, 8000).catch((e) => null);
    if (!data)
      return res.json({
        success: true,
        data: FALLBACK_SAMPLE.map((c) => ({
          id: c.id,
          symbol: c.symbol,
          name: c.name,
        })),
      });
    const sample = data
      .slice(0, 200)
      .map((c) => ({ id: c.id, symbol: c.symbol, name: c.name }));
    res.json({ success: true, data: sample });
  } catch (error) {
    console.error("Coins error:", error.message || error);
    return res.json({
      success: true,
      data: FALLBACK_SAMPLE.map((c) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
      })),
    });
  }
};

module.exports = { getMarketData, getCoins };
