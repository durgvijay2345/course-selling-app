import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { BACKEND_URL } from "../../frontend-config/api";

function AdminCreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("admin"))?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload an image");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Course created!");

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setPreviewUrl(null);

      navigate("/admin/courses");
    } catch (err) {
      toast.error(err.response?.data?.errors || "Error creating course");
    }
  };

  return (
   <div className="max-w-2xl mx-auto mt-12 px-8 py-10 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-xl rounded-3xl border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
        📘 Create New Course
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Course Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter course description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreviewUrl(URL.createObjectURL(e.target.files[0]));
            }}
            className="w-full"
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 h-32 w-full object-cover rounded-md border"
            />
          )}
        </div>

        <button
          type="submit"
         className="flex items-center gap-2 bg-red-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
          >
            <FaPlus className="text-lg" />
            Create Course
          </button>
      </form>
    </div>
  );
}

export default AdminCreateCourse;
