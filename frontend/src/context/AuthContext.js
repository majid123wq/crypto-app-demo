import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try to load current user from server using cookie (preferred)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Auth bootstrap error:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  const getProfile = async () => {
    const res = await api.get("/auth/profile");
    setUser(res.data.user);
    return res.data.user;
  };

  const value = useMemo(
    () => ({ user, loading, error, register, login, logout, getProfile }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
