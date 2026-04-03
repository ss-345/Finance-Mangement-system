import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { use } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");

  // Restore session from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("finance_user");
    const token = localStorage.getItem("finance_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { user, token } = res.data.data;

    localStorage.setItem("finance_token", token);
    localStorage.setItem("finance_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      const { user, token } = res.data.data;
      localStorage.setItem("finance_token", token);
      localStorage.setItem("finance_user", JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      return Promise.reject(
        err.response?.data?.message || "Registration failed",
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("finance_token");
    localStorage.removeItem("finance_user");
    setUser(null);
  };

  const hasRole = (...roles) => user && roles.includes(user.role);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, hasRole, page, setPage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
