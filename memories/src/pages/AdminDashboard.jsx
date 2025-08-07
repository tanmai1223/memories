import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "../styles/adminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(res)
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  //console.log(users)
  const handleDelete = async (id) => {
    try {
      //console.log(id)
      await axios.delete(`${API_URL}/api/auth/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };
  const handleAllDelete = async () => {
    try {
      const res=await axios.delete(`${API_URL}/api/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(res.status===200){
        fetchUsers()
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };
  //console.log(users)
  return (
    <>
      <Header />
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <table className="user-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.totalMemories}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="delete-all-btn" onClick={handleAllDelete}>
          Delete All Users
        </button>
      </div>
    </>
  );
}

export default AdminDashboard;
