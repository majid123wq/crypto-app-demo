import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

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
      await api.post("/auth/register", { name, email, password });
      // server sets httpOnly cookie; fetch profile
      const profile = await api.get("/auth/profile");
      setUser(profile.data.user);
      return profile.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      await api.post("/auth/login", { email, password });
      const profile = await api.get("/auth/profile");
      setUser(profile.data.user);
      return profile.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const getProfile = async () => {
    const res = await api.get("/auth/profile");
    setUser(res.data.user);
    return res.data.user;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, register, login, logout, getProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
