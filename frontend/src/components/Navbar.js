import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        position: "sticky",
        top: "40px",
        zIndex: 1000,
        background: "rgba(13,14,17,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          color: "white",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "800",
          }}
        >
          ₿
        </div>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "18px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
          }}
        >
          Crypto<span style={{ color: "#3b82f6" }}>App</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
        className="nav-links"
      >
        {[
          { to: "/", label: "Markets" },
          { to: "/gainers", label: "Gainers" },
          { to: "/new-listings", label: "New" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: isActive(link.to) ? "#3b82f6" : "#9ca3af",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "'Syne', sans-serif",
              background: isActive(link.to)
                ? "rgba(59,130,246,0.1)"
                : "transparent",
              transition: "all 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Auth section */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {user ? (
          <>
            <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                color: "#e5e7eb",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                fontSize: "14px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: "500",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hide-mobile">{user.name?.split(" ")[0]}</span>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444",
                padding: "6px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: "#9ca3af",
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: "500",
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: "white",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Syne', sans-serif",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              }}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
