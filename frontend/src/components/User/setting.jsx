import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { BACKEND_URL } from "../../frontend-config/api";

function setting() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.user) {
      setFirstName(user.user.firstName || "");
      setLastName(user.user.lastName || "");
      setEmail(user.user.email || "");
      setPreviewUrl(user.user.avatar || null);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await axios.put(
        `${BACKEND_URL}/user/user-update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully");

      const old = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
  "user",
  JSON.stringify({ token: old.token, user: res.data.user })
);


      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.errors || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      await axios.delete(`${BACKEND_URL}/user/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted");
      localStorage.removeItem("user");
      window.location.href = "/signup";
    } catch (error) {
      toast.error(error.response?.data?.errors || "Failed to delete account");
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 text-gray-100">
    <div className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-8">Edit Your Profile</h2>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setAvatar(e.target.files[0]);
              setPreviewUrl(URL.createObjectURL(e.target.files[0]));
            }}
            className="w-full text-white"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 h-24 w-24 rounded-full object-cover border-4 border-gray-600 shadow-lg"
            />
          )}
        </div>

        <button
              type="submit"
             className="flex items-center gap-2 bg-red-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
              >
                <FaEdit className="text-lg" />
                Update
              </button>
      </form>

      <hr className="my-8 border-gray-700" />

      <div className="text-center">
        <h3 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h3>
        <button
          onClick={handleDeleteAccount}
         className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
          >
            <FaTrashAlt className="text-lg" />
            Delete
          </button>
      </div>
    </div>
  </div>
);

}

export default setting;
