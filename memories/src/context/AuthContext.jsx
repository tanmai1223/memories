import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Safely parse user from localStorage
  let storedUser = null;
  try {
    const userFromStorage = localStorage.getItem("user");
    storedUser = userFromStorage ? JSON.parse(userFromStorage) : null;
  } catch (error) {
    localStorage.removeItem("user");
    console.log(error)
  }

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const navigate = useNavigate();

  // Save or clear from localStorage when user/token changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [user, token]);

  const signup = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        setUser(null);
        setToken(null);
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      throw new Error(message);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(message);
    }
  };

  const logout = () => {
    navigate("/");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
