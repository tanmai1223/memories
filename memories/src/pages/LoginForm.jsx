import React, { useContext, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import "../styles/styles.css";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";


function LoginPage() {
  const { login } = useContext(AuthContext);
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(data);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-right" reverseOrder={false} />
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={data.email}
          onChange={handleChange}
          required
        />
         <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="switch-link">
          Not registered yet? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
