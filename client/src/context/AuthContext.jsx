import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/http";

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("adflow_token"));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("adflow_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (!user) {
      const decoded = decodeToken(token);
      if (decoded) {
        const restoredUser = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
        };
        setUser(restoredUser);
        localStorage.setItem("adflow_user", JSON.stringify(restoredUser));
      }
    }
  }, [token, user]);

  const persistAuth = (payload) => {
    localStorage.setItem("adflow_token", payload.token);
    localStorage.setItem("adflow_user", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const payload = await api.post("/auth/login", credentials);
      persistAuth(payload);
      return payload;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", payload);
      persistAuth(response);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adflow_token");
    localStorage.removeItem("adflow_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
