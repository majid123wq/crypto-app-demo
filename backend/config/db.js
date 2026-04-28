const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Crypto = require("../models/Crypto");

const sampleData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 67432.5,
    image: "",
    change24h: 2.34,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 3521.8,
    image: "",
    change24h: 1.87,
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 182.4,
    image: "",
    change24h: 5.62,
  },
  {
    name: "BNB",
    symbol: "BNB",
    price: 598.2,
    image: "",
    change24h: 0.95,
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 0.6234,
    image: "",
    change24h: -1.23,
  },
];

const seedIfEmpty = async () => {
  try {
    const count = await Crypto.countDocuments();
    if (count === 0) {
      await Crypto.insertMany(sampleData);
      console.log(
        `🌱 Seeded ${sampleData.length} cryptocurrencies (in DB empty fallback).`,
      );
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        await seedIfEmpty();
        return;
      } catch (err) {
        console.warn(
          "⚠️ Failed to connect to MONGO_URI, falling back to in-memory DB:",
          err.message,
        );
      }
    }

    // Start an in-memory MongoDB for local/dev convenience
    console.warn("⚠️  Starting in-memory MongoDB (dev only)");
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ In-memory MongoDB started: ${conn.connection.host}`);
    await seedIfEmpty();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
