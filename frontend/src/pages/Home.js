import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CryptoTable from "../components/CryptoTable";
import api from "../utils/api";

const Home = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use backend market endpoint which aggregates live prices (CoinGecko)
      const res = await api.get("/market");
      const data = res.data.data || [];
      // normalize to expected frontend schema
      const normalized = data.map((c) => ({
        _id: c.id || c.symbol || Math.random().toString(36).slice(2, 9),
        name: c.name,
        symbol: (c.symbol || "").toUpperCase(),
        price: c.price || c.current_price || 0,
        image: c.image || "",
        change24h:
          c.change24h !== undefined
            ? c.change24h
            : c.price_change_percentage_24h || 0,
        marketCap: c.marketCap || c.market_cap || 0,
        volume24h: c.volume24h || c.total_volume || 0,
      }));
      setCryptos(normalized);
    } catch (err) {
      const errorMsg =
        err.code === "ECONNABORTED" || err.message === "timeout of 0ms exceeded"
          ? "Backend server is still waking up. Please wait 30-60 seconds and retry."
          : err.response?.data?.message ||
            err.message ||
            "Failed to load market data. Check backend is running.";
      setError(errorMsg);
      console.error("Fetch cryptos error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await api.post("/crypto/seed");
      setSeedMsg(`✅ ${res.data.message}`);
      fetchCryptos();
    } catch (err) {
      setSeedMsg(
        "❌ Seed failed: " + (err.response?.data?.message || "Unknown error"),
      );
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0b0d",
        paddingBottom: "80px",
      }}
    >
      {/* Hero section */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.06) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "64px 24px 48px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: "800",
            color: "#f9fafb",
            margin: "0 0 16px",
            letterSpacing: "-1.5px",
            lineHeight: "1.1",
          }}
        >
          Crypto <span style={{ color: "#3b82f6" }}>Markets</span>
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            fontFamily: "'Syne', sans-serif",
            margin: "0 auto 32px",
            maxWidth: "480px",
            lineHeight: "1.6",
          }}
        >
          Track real-time prices, market caps, and 24h changes across all
          tradable assets.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/gainers"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#10b981",
              padding: "10px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: "600",
            }}
          >
            🚀 Top Gainers
          </Link>
          <Link
            to="/new-listings"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
              color: "#8b5cf6",
              padding: "10px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: "600",
            }}
          >
            ✨ New Listings
          </Link>
          <button
            onClick={handleSeed}
            disabled={seeding}
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#3b82f6",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: seeding ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: "600",
              opacity: seeding ? 0.6 : 1,
            }}
          >
            {seeding ? "Seeding..." : "🌱 Seed Sample Data"}
          </button>
        </div>
        {seedMsg && (
          <p
            style={{
              marginTop: "16px",
              color: seedMsg.startsWith("✅") ? "#10b981" : "#ef4444",
              fontSize: "13px",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {seedMsg}
          </p>
        )}
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          gap: "0",
          overflowX: "auto",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "0 24px",
        }}
      >
        {[
          { label: "Total Assets", value: cryptos.length },
          {
            label: "Gainers",
            value: cryptos.filter((c) => c.change24h > 0).length,
            color: "#10b981",
          },
          {
            label: "Losers",
            value: cryptos.filter((c) => c.change24h < 0).length,
            color: "#ef4444",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: "16px 24px",
              borderRight: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                color: stat.color || "#f9fafb",
                fontFamily: "'Syne', sans-serif",
                fontWeight: "700",
                fontSize: "20px",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                color: "#6b7280",
                fontFamily: "'Syne', sans-serif",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* Loading State */}
        {loading && (
          <div
            style={{
              background: "#111318",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "4px solid rgba(59,130,246,0.2)",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            >
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
            <p
              style={{
                color: "#9ca3af",
                fontFamily: "'Syne', sans-serif",
                fontSize: "14px",
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              Loading market data...
            </p>
            <p
              style={{
                color: "#6b7280",
                fontFamily: "'Syne', sans-serif",
                fontSize: "12px",
              }}
            >
              {" "}
              (Backend may be waking up on Render free tier — up to 30 seconds)
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div
              style={{
                color: "#fca5a5",
                fontFamily: "'Syne', sans-serif",
                fontSize: "14px",
                marginBottom: "12px",
              }}
            >
              ⚠️ Error Loading Data
            </div>
            <p
              style={{
                color: "#fecaca",
                fontFamily: "'Syne', sans-serif",
                fontSize: "13px",
                margin: "0 0 16px",
              }}
            >
              {error}
            </p>
            <button
              onClick={() => {
                setError(null);
                fetchCryptos();
              }}
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                border: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              🔄 Retry
            </button>
          </div>
        )}

        {/* Table - Only show when data is loaded */}
        {!loading && !error && (
          <div
            style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#f9fafb",
                  margin: 0,
                }}
              >
                All Cryptocurrencies
              </h2>
            </div>
            <CryptoTable cryptos={cryptos} loading={loading} error={error} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
