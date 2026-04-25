import React from 'react';

const formatPrice = (price) => {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
};

const formatMarketCap = (val) => {
  if (!val) return '—';
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return `$${val.toLocaleString()}`;
};

const CryptoTable = ({ cryptos, loading, error }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid #1e293b', borderTopColor: '#3b82f6',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
        }} />
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px' }}>Loading markets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px',
        color: '#ef4444', fontFamily: "'Syne', sans-serif",
      }}>
        <p style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!cryptos || cryptos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', fontFamily: "'Syne', sans-serif" }}>
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
        <p>No cryptocurrencies found.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Syne', sans-serif" }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['#', 'Asset', 'Price', '24h Change', 'Market Cap', 'Volume 24h'].map((h, i) => (
              <th key={h} style={{
                padding: '12px 16px',
                textAlign: i >= 2 ? 'right' : 'left',
                color: '#6b7280',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cryptos.map((coin, index) => {
            const isPositive = coin.change24h >= 0;
            return (
              <tr key={coin._id} style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'background 0.15s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '16px', color: '#6b7280', fontSize: '13px', width: '48px' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1e293b, #334155)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      {coin.image ? (
                        <img src={coin.image} alt={coin.name}
                          style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700' }}>
                          {coin.symbol?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div style={{ color: '#f9fafb', fontWeight: '600', fontSize: '14px' }}>{coin.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', color: '#f9fafb', fontWeight: '600', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(coin.price)}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <span style={{
                    background: isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: isPositive ? '#10b981' : '#ef4444',
                    padding: '4px 10px', borderRadius: '6px',
                    fontSize: '13px', fontWeight: '600',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {isPositive ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', color: '#9ca3af', fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>
                  {formatMarketCap(coin.marketCap)}
                </td>
                <td style={{ padding: '16px', textAlign: 'right', color: '#9ca3af', fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>
                  {formatMarketCap(coin.volume24h)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
