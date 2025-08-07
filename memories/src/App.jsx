import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./pages/LoginForm.jsx";
import SignupForm from "./pages/SignupForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DisplayMemory from "./components/DisplayMemory.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EditProfile from "./components/EditProfile.jsx";
import EditMemory from "./components/EditMemory.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/displaymem" element={<DisplayMemory />} />
        <Route path="/editMemory" element={<EditMemory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<EditProfile/>} />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
