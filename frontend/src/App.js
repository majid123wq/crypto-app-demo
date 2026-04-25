import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DemoBanner from './components/DemoBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Gainers from './pages/Gainers';
import NewListings from './pages/NewListings';
import AddCrypto from './pages/AddCrypto';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <DemoBanner />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/gainers" element={<Gainers />} />
              <Route path="/new-listings" element={<NewListings />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-crypto"
                element={
                  <ProtectedRoute>
                    <AddCrypto />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={
                <div style={{
                  minHeight: '80vh', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: '#0a0b0d', color: '#fff',
                  fontFamily: "'Syne', sans-serif",
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>404</div>
                  <p style={{ color: '#6b7280' }}>Page not found</p>
                  <a href="/" style={{ color: '#3b82f6', marginTop: '16px', textDecoration: 'none' }}>
                    Go home
                  </a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
