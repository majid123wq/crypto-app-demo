const express = require('express');
const router = express.Router();
const {
  getAllCryptos,
  getGainers,
  getNewListings,
  addCrypto,
  seedCryptos,
} = require('../controllers/cryptoController');
const { protect } = require('../middleware/auth');

// GET /api/crypto/gainers - Top gainers (must be before /:id)
router.get('/gainers', getGainers);

// GET /api/crypto/new - New listings
router.get('/new', getNewListings);

// POST /api/crypto/seed - Seed sample data (dev only)
router.post('/seed', seedCryptos);

// GET /api/crypto - All cryptos
router.get('/', getAllCryptos);

// POST /api/crypto - Add new crypto (protected)
router.post('/', protect, addCrypto);

module.exports = router;
