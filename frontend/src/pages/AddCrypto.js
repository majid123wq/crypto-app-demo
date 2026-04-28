import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddCrypto = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', symbol: '', price: '', image: '', change24h: '',
    marketCap: '', volume24h: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: formData.name,
        symbol: formData.symbol,
        price: Number.parseFloat(formData.price),
        image: formData.image,
        change24h: Number.parseFloat(formData.change24h),
      };
      const res = await api.post('/crypto', payload);
      setSuccess(`✅ ${res.data.data.name} (${res.data.data.symbol}) added successfully!`);
      setFormData({ name: '', symbol: '', price: '', image: '', change24h: '', marketCap: '', volume24h: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add cryptocurrency.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Cryptocurrency Name', type: 'text', placeholder: 'e.g. Bitcoin', required: true },
    { name: 'symbol', label: 'Symbol', type: 'text', placeholder: 'e.g. BTC', required: true },
    { name: 'price', label: 'Price (USD)', type: 'number', placeholder: 'e.g. 67432.50', required: true, min: '0', step: 'any' },
    { name: 'change24h', label: '24h Change (%)', type: 'number', placeholder: 'e.g. +2.5 or -1.3', required: true, step: 'any' },
    { name: 'image', label: 'Image URL', type: 'url', placeholder: 'https://...', required: true },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0d', padding: '40px 24px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', color: '#6b7280',
            cursor: 'pointer', fontFamily: "'Syne', sans-serif",
            fontSize: '14px', padding: 0, marginBottom: '16px',
          }}>← Back</button>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: '28px',
            fontWeight: '800', color: '#f9fafb', margin: '0 0 8px',
          }}>Add Cryptocurrency</h1>
          <p style={{ color: '#6b7280', fontFamily: "'Syne', sans-serif", fontSize: '14px', margin: 0 }}>
            Add a new asset to the platform.
          </p>
        </div>

        <div style={{
          background: '#111318', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', padding: '36px',
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
              color: '#ef4444', fontSize: '13px', fontFamily: "'Syne', sans-serif",
            }}>{error}</div>
          )}
          {success && (
            <div style={{
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
              color: '#10b981', fontSize: '13px', fontFamily: "'Syne', sans-serif",
            }}>{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map(field => (
              <div key={field.name} style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block', marginBottom: '6px',
                  color: '#9ca3af', fontSize: '12px',
                  fontFamily: "'Syne', sans-serif", fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {field.label}
                  {field.required && <span style={{ color: '#3b82f6', marginLeft: '4px' }}>*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  min={field.min}
                  step={field.step}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', color: '#f9fafb',
                    fontSize: '14px', fontFamily: "'Syne', sans-serif",
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" disabled={loading} style={{
                flex: 1, padding: '14px',
                background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontFamily: "'Syne', sans-serif", fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
              }}>
                {loading ? 'Adding...' : 'Add Cryptocurrency'}
              </button>
              <button type="button" onClick={() => navigate('/')} style={{
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af', borderRadius: '10px',
                fontSize: '14px', fontFamily: "'Syne', sans-serif",
                cursor: 'pointer',
              }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCrypto;
