import React from "react";
import "../styles/profile.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!user) {
    return <div className="profile-container">User not logged in.</div>;
  }

  const handleEdit = () => {
    navigate("/editprofile", { state: { user } });
  };

  const handleDelete = async () => {
   try {
        await axios.delete(`${API_URL}/api/auth/profile/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.clear();
        navigate("/");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt="Profile"
            className="profile-avatar"
          />
          <h2>{user.fullName || "No Name Provided"}</h2>
          <p>
            <strong>Email:</strong> {user.email || "N/A"}
          </p>
          <p>
            <strong>Full Name:</strong> {user.fullName || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user.role || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user.createdAt).toDateString() || "Unknown"}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(user.updatedAt).toDateString() || "Unknown"}
          </p>

          <div className="profile-actions">
            <button className="back-btn" onClick={handleBack}>
              Back
            </button>
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
