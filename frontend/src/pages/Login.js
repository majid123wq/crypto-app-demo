import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0b0d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
      }}>
        {/* Demo notice */}
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px', padding: '12px 16px',
          marginBottom: '24px', textAlign: 'center',
        }}>
          <p style={{ color: '#ef4444', fontSize: '12px', margin: 0, fontFamily: "'Syne', sans-serif" }}>
            🔒 <strong>Demo app</strong> — do not use your real password
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#111318',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', padding: '40px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', margin: '0 auto 16px',
            }}>₿</div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: '24px',
              fontWeight: '800', color: '#f9fafb', margin: '0 0 8px',
            }}>Welcome back</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', fontFamily: "'Syne', sans-serif", margin: 0 }}>
              Sign in to your Crypto App account
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
              color: '#ef4444', fontSize: '13px', fontFamily: "'Syne', sans-serif",
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block', marginBottom: '6px',
                  color: '#9ca3af', fontSize: '12px',
                  fontFamily: "'Syne', sans-serif", fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', color: '#f9fafb',
                    fontSize: '14px', fontFamily: "'Syne', sans-serif",
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontFamily: "'Syne', sans-serif", fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '24px',
            color: '#6b7280', fontSize: '13px',
            fontFamily: "'Syne', sans-serif",
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
