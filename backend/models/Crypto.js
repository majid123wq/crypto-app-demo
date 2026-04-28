const mongoose = require('mongoose');

const CryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cryptocurrency name is required'],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,
      trim: true,
      maxlength: [10, 'Symbol cannot exceed 10 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    change24h: {
      type: Number,
      required: [true, '24h change is required'],
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crypto', CryptoSchema);
