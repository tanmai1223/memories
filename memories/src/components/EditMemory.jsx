import React, { useContext, useState } from "react";
import { Upload ,ArrowLeft} from "lucide-react";
import "../styles/editmemory.css";
import { Toaster, toast } from "react-hot-toast";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function EditMemory() {
  const showImageUpload = true;
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const memory = location?.state;

  //console.log(memory.memory.title)

  const [data, setData] = useState({
    title: memory?.memory?.title || "",
    description: memory?.memory?.description || "",
  });
  const [imagePreview, setImagePreview] = useState(memory.memory.image);

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
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (imageFile) formData.append("image", imageFile);
    console.log(formData);
    try {
      const res = await axios.put(
        `${API_URL}/api/memories/${memory.memory._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Memory updated!");
      navigate("/displaymem"); // or anywhere appropriate
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
      <div className="edit-memory-container">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="edit-header">
          <ArrowLeft
            className="back-arrow"
            onClick={() => navigate(-1)}
            size={32}
            strokeWidth={5}
          />
          <h2>Edit Memory</h2>
        </div>
        <form onSubmit={handleSubmit} className="edit-memory">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={data.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={data.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
          {showImageUpload && (
            <div className="imageUploade">
              <div
                className="imagePreviewe"
                onClick={() => document.getElementById("imageUpload").click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="uploadedImagee"
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
                className="hiddenInpute"
              />
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Memory"}
          </button>
        </form>
      </div>
    </>
  );
}

export default EditMemory;
