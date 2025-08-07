import React, { useContext, useState } from "react";
import { Upload, ArrowLeft } from "lucide-react";
import "../styles/editprofile.css";
import { Toaster, toast } from "react-hot-toast";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function EditProfile() {
  const { setUser } = useContext(AuthContext);
  const showImageUpload = true;
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = location?.state;

  const [data, setData] = useState({
    fullName: user?.user.fullName || "",
    email: user?.user?.email || "",
    password: "", // optional for update
  });
  const [imagePreview, setImagePreview] = useState(user?.user?.profileImage);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    if (data.password) formData.append("password", data.password);
    if (imageFile) formData.append("profileImage", imageFile);

    try {
      const res = await axios.put(
        `${API_URL}/api/auth/profile/${user.user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated!");
      setUser(res.data.user);
      navigate("/profile"); // or anywhere appropriate
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <Toaster position="top-right" reverseOrder={false} />
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-header">
            <ArrowLeft
              className="back-arrow"
              onClick={() => navigate(-1)}
              size={28}
              strokeWidth={3}
            />
            <h2>Edit Profile</h2>
          </div>

          {showImageUpload && (
            <div className="imageUploadp">
              <div
                className="imagePreviewp"
                onClick={() => document.getElementById("imageUpload").click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="uploadedImagep"
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
                className="hiddenInputp"
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
            readOnly
          />
          <input
            type="password"
            placeholder="New Password "
            name="password"
            value={data.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </>
  );
}

export default EditProfile;
