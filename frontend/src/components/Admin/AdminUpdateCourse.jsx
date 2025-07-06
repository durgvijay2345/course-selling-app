import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft} from "react-icons/fa";
import { BACKEND_URL } from "../../frontend-config/api";

function AdminUpdateCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = JSON.parse(localStorage.getItem("admin"))?.token;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/course/${courseId}`)
      .then((res) => {
        const data = res.data.course;
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setPreview(data.image); // existing course image
      })
      .catch(() => {
        toast.error("Error fetching course details");
      });
  }, [courseId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image) formData.append("image", image);

    try {
      await axios.put(`${BACKEND_URL}/course/update/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Course updated successfully");
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err.response?.data?.errors || "Error updating course");
    }
  };

  return (
  <div className="min-h-screen bg-gray-400 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-3xl bg-gradient-to-br from-red-50 via-blue-50 to-blue-200 shadow-2xl rounded-3xl border border-blue-100 px-8 py-10">
 <div className="max-w-3xl mx-auto mb-4 px-4">
  <button
    onClick={() => navigate("/admin/dashboard")}
    className="flex items-center gap-2 text-orange-700 hover:text-indigo-900 font-medium transition cursor-pointer"
  >
    <FaArrowLeft />
    <span>Back to Dashboard</span>
  </button>
</div>
         <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        🔄 Update Course
      </h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Course Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            rows="4"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price (INR)</label>
          <input
            type="number"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
            className="w-full cursor-pointer"
          />
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm mb-1 text-gray-500">Image Preview:</p>
            <img
              src={preview}
              alt="Course"
              className="rounded-md h-40 w-full object-cover border"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 cursor-pointer"
        >
          Update Course
        </button>
      </form>
    </div>
  </div>
);

}

export default AdminUpdateCourse;
   
