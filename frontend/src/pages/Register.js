import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Demo notice */}
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px', padding: '12px 16px',
          marginBottom: '24px', textAlign: 'center',
        }}>
          <p style={{ color: '#ef4444', fontSize: '12px', margin: 0, fontFamily: "'Syne', sans-serif" }}>
            🔒 <strong>Demo app</strong> — do not use your real password or personal information
          </p>
        </div>

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
            }}>Create Account</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', fontFamily: "'Syne', sans-serif", margin: 0 }}>
              Join Crypto App — Student Demo
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
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: '16px' }}>
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
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', marginTop: '8px',
              background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontFamily: "'Syne', sans-serif", fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '24px',
            color: '#6b7280', fontSize: '13px',
            fontFamily: "'Syne', sans-serif",
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
