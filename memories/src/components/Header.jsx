import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {logout}=useContext(AuthContext)
  const file = localStorage.getItem("user");
  const user = JSON.parse(file);

  const handleLogout = () => {
    logout();
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <h1 className="logo">MyMemories</h1>
      <div className="profile-menu" ref={dropdownRef}>
        <img
          src={user?.profileImage || "/default-avatar.png"}
          alt="Profile"
          className="avatar"
          onClick={() => setOpen(!open)}
        />
        {open && (
          <div className="dropdown">
            <button onClick={goToProfile}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
