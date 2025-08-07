import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/displaymemory.css";
import Header from "./Header";

const API_URL = import.meta.env.VITE_API_URL;

function DisplayMemory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const token=localStorage.getItem("token")


  const memoryId = location?.state?.id;

  useEffect(() => {
    if (!memoryId) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const fetchMemory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/memories/${memoryId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },});
        setMemory(res.data.data);
      } catch (err) {
        console.error("Error fetching memory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [memoryId, navigate,token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/memories/${memoryId}`,{
  headers: {
    Authorization: `Bearer ${token}`,
  }});
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting memory:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/editMemory`, { state: { memory } });
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading)
    return <div className="display-memory-container">Loading...</div>;
  if (!memory)
    return <div className="display-memory-container">Memory not found.</div>;

  return (
    <>
      <Header />
      <div className="display-memory-container">
        <h1>Memory Details</h1>

        <div className="memory-box">
            <h1>Title</h1>
          <h2>{memory.title}</h2>
          <h1>Descprition</h1>
          <p>{memory.description}</p>
          <h1>Image</h1>
          {memory.image && (
            <img src={memory.image} alt={memory.title} className="memory-image" />
          )}
        </div>

        <div className="memory-actions">
          <button onClick={handleBack} className="back-btn">Back</button>
          <button onClick={handleEdit} className="edit-btn">Edit</button>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
      </div>
    </>
  );
}

export default DisplayMemory;
