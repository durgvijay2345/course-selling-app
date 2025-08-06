import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { BACKEND_URL } from "../../frontend-config/api";

function AdminProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("admin"))?.token;

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin?.user) {
      setFirstName(admin.user.firstName || "");
      setLastName(admin.user.lastName || "");
      setEmail(admin.user.email || "");
      setPreviewUrl(admin.user.avatar || null); // existing image
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName); // ✅ fixed here
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await axios.put(
        `${BACKEND_URL}/admin/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully");

      // ✅ Update localStorage
      const old = JSON.parse(localStorage.getItem("admin"));
      localStorage.setItem(
        "admin",
        JSON.stringify({ ...old, user: res.data.admin })
      );

      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.errors || "Failed to update profile");
    }
  };

  return (
  <div className="max-w-2xl mx-auto mt-16 px-10 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 shadow-2xl rounded-3xl border border-gray-700 text-gray-100">
    
    <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-400 tracking-wide">Edit Profile</h2>

    <form onSubmit={handleUpdate} className="space-y-6">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
        <input
          type="text"
          className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
        <input
          type="text"
          className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          type="email"
          className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Profile Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          onChange={(e) => {
            setAvatar(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
          }}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-4 rounded-full h-20 w-20 object-cover border-2 border-blue-500"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
       className="flex items-center gap-2 bg-red-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          <FaEdit className="text-lg" />
          Update Profile
        </button>
    </form>
  </div>
);
}
export default AdminProfile;
