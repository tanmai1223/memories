import React, { useState, useEffect } from "react";
import "../styles/addmemory.css";
import "../styles/display.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function MemoryDisplay() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [memories, setMemories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;
  const navigate = useNavigate();
  const ITEM_PER_PAGE = 6;

  const fetchMemories = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/memories?page=${page}&limit=${ITEM_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //console.log(res);
      setMemories(res.data?.data || []);
      setCurrentPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories(currentPage);
  }, [currentPage]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      const res = await axios.post(`${API_URL}/api/memories/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Memory added!");
        setFormData({ title: "", description: "", image: null });
        e.target.reset();
        fetchMemories();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to add memory.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API_URL}/api/memories/all/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("Deleted all memories!");
        fetchMemories();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete memory.");
    }
  };

  return (
    <>
    
      
      <Toaster position="top-right" reverseOrder={false} />
      <div className="left-section">
        <h2>Your Memories</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="memory-grid">
            {memories.length > 0 ? (
              memories.map((memory) => (
                <div
                  className="memory-card"
                  key={memory._id}
                  onClick={() =>
                    navigate("/displaymem", { state: { id: memory._id } })
                  }
                >
                  <h3>{memory.title}</h3>
                  <p>{memory.description}</p>
                  <div className="image-box">
                    <img src={memory.image} alt="memory" />
                  </div>
                </div>
              ))
            ) : (
              <h3>No memories</h3>
            )}
          </div>
        )}
        <button className="delete-mem-btn" onClick={handleDelete}>
          Delete All Memories
        </button>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {`<`}
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                className={currentPage === pageNum ? "active" : ""}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {`>`}
          </button>
        </div>
      </div>

      <div className="right-section">
        <h2>Add Memory</h2>
        <form onSubmit={handleSubmit} className="add-memory-form">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>

          <label>Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default MemoryDisplay;
