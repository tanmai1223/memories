import React, { useContext, useState } from "react";
import "../styles/styles.css";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

function SignupForm() {
  const { signup } = useContext(AuthContext);

  const showImageUpload = true;

  const [data, setData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      await signup(formData);

      toast.success("Registered successfully!");

      setData({
        email: "",
        password: "",
        fullName: "",
        confirmPassword: "",
      });
      setImagePreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-right" reverseOrder={false} />
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>

        {showImageUpload && (
          <div className="imageUpload">
            <div
              className="imagePreview"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="uploadedImage"
                />
              ) : (
                <Upload size={24} color="#9ca3af" />
              )}
            </div>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hiddenInput"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
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

        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="switch-link">
          Already registered? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
