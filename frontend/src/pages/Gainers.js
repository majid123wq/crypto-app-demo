import React, { useEffect, useState } from 'react';
import CryptoTable from '../components/CryptoTable';
import api from '../utils/api';

const Gainers = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGainers = async () => {
      try {
        const res = await api.get('/crypto/gainers');
        setCryptos(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load gainers.');
      } finally {
        setLoading(false);
      }
    };
    fetchGainers();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0d', paddingBottom: '80px' }}>
      <div style={{
        background: 'linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '20px', padding: '6px 14px', marginBottom: '16px',
        }}>
          <span style={{ color: '#10b981', fontSize: '13px', fontFamily: "'Syne', sans-serif", fontWeight: '600' }}>
            🚀 Live Rankings
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: '800', color: '#f9fafb', margin: '0 0 12px',
          letterSpacing: '-1px',
        }}>
          Top <span style={{ color: '#10b981' }}>Gainers</span>
        </h1>
        <p style={{ color: '#6b7280', fontFamily: "'Syne', sans-serif", fontSize: '15px', margin: 0 }}>
          Cryptocurrencies with the highest 24h price increase, ranked from highest to lowest.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 24px' }}>
        <div style={{
          background: '#111318',
          border: '1px solid rgba(16,185,129,0.12)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: '700', color: '#f9fafb', margin: 0 }}>
              Top Gainers
            </h2>
            {!loading && !error && (
              <span style={{ color: '#10b981', fontSize: '13px', fontFamily: "'Syne', sans-serif", fontWeight: '600' }}>
                {cryptos.length} assets
              </span>
            )}
          </div>
          <CryptoTable cryptos={cryptos} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Gainers;
