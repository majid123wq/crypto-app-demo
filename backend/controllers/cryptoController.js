const Crypto = require('../models/Crypto');

// @desc    Get all cryptocurrencies
// @route   GET /api/crypto
// @access  Public
const getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: cryptos.length, data: cryptos });
  } catch (error) {
    console.error('Fetch cryptos error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching cryptocurrencies.' });
  }
};

// @desc    Get top gainers
// @route   GET /api/crypto/gainers
// @access  Public
const getGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find({ change24h: { $gt: 0 } })
      .sort({ change24h: -1 })
      .limit(20);
    res.status(200).json({ success: true, count: gainers.length, data: gainers });
  } catch (error) {
    console.error('Fetch gainers error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching gainers.' });
  }
};

// @desc    Get new listings
// @route   GET /api/crypto/new
// @access  Public
const getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, count: newListings.length, data: newListings });
  } catch (error) {
    console.error('Fetch new listings error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching new listings.' });
  }
};

// @desc    Add new cryptocurrency
// @route   POST /api/crypto
// @access  Private (protected)
const addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    if (!name || !symbol || price === undefined || image === undefined || change24h === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, symbol, price, image, and 24h change.',
      });
    }

    const existing = await Crypto.findOne({ symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A cryptocurrency with this symbol already exists.' });
    }

    const crypto = await Crypto.create({ name, symbol, price, image, change24h });
    res.status(201).json({ success: true, data: crypto });
  } catch (error) {
    console.error('Add crypto error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error adding cryptocurrency.' });
  }
};

// @desc    Seed sample crypto data
// @route   POST /api/crypto/seed
// @access  Public (dev only)
const seedCryptos = async (req, res) => {
  try {
    const existingCount = await Crypto.countDocuments();
    if (existingCount > 0) {
      return res.status(200).json({ success: true, message: 'Crypto collection already seeded.', data: [] });
    }

    const sampleData = [
      { name: 'Bitcoin', symbol: 'BTC', price: 67432.5, image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', change24h: 2.34 },
      { name: 'Ethereum', symbol: 'ETH', price: 3521.8, image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', change24h: 1.87 },
      { name: 'Solana', symbol: 'SOL', price: 182.4, image: 'https://cryptologos.cc/logos/solana-sol-logo.png', change24h: 5.62 },
      { name: 'BNB', symbol: 'BNB', price: 598.2, image: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', change24h: 0.95 },
      { name: 'XRP', symbol: 'XRP', price: 0.6234, image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', change24h: -1.23 },
      { name: 'Cardano', symbol: 'ADA', price: 0.4521, image: 'https://cryptologos.cc/logos/cardano-ada-logo.png', change24h: -0.87 },
      { name: 'Avalanche', symbol: 'AVAX', price: 38.72, image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', change24h: 8.45 },
      { name: 'Dogecoin', symbol: 'DOGE', price: 0.1823, image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png', change24h: 3.21 },
      { name: 'Polkadot', symbol: 'DOT', price: 7.89, image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', change24h: -2.14 },
      { name: 'Chainlink', symbol: 'LINK', price: 18.45, image: 'https://cryptologos.cc/logos/chainlink-link-logo.png', change24h: 6.78 },
      { name: 'Uniswap', symbol: 'UNI', price: 9.12, image: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', change24h: 4.32 },
      { name: 'Litecoin', symbol: 'LTC', price: 86.54, image: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', change24h: -0.45 },
    ];
    const cryptos = await Crypto.insertMany(sampleData);
    res.status(201).json({ success: true, message: `Seeded ${cryptos.length} cryptocurrencies.`, data: cryptos });
  } catch (error) {
    console.error('Seed crypto error:', error);
    res.status(500).json({ success: false, message: 'Error seeding data.' });
  }
};

module.exports = { getAllCryptos, getGainers, getNewListings, addCrypto, seedCryptos };
