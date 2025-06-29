import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../../frontend-config/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const token = adminData?.token;

    if (!token) {
      toast.error("Please login as admin first");
      navigate("/admin/login");
    } else if (adminData?.user) {
      setAdmin(adminData.user);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/admin/logout`, {}, {
        withCredentials: true,
      });

      localStorage.removeItem("admin");
      setAdmin(null);
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">


      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-100 p-5 flex flex-col items-center relative">
        {/* Avatar & Profile Toggle */}
        <button onClick={() => setShowProfile(!showProfile)} className="mb-4">
          {admin?.avatar ? (
            <img
              src={admin.avatar}
              alt="Admin Avatar"
              className="h-10 w-10 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <FaUserCircle className="text-3xl text-orange-400" />
          )}
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute top-16 left-5 md:left-64 md:-translate-x-full bg-white text-gray-800 p-4 rounded-xl shadow-2xl w-72 z-50 border border-gray-200">
            <div className="flex flex-col items-center">
              {admin?.avatar ? (
                <img
                  src={admin.avatar}
                  alt="Avatar"
                  className="mb-3 h-20 w-20 rounded-full object-cover border-4 border-orange-500"
                />
              ) : (
                <FaUserCircle className="text-5xl text-orange-400 mb-3" />
              )}

              <h3 className="text-lg font-semibold">
                {admin.firstName} {admin.lastName}
              </h3>
              <p className="text-sm text-gray-600">{admin.email}</p>

              <Link
                to="/admin/profile"
                className="mt-4 inline-block text-sm text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        )}

        {/* Navigation */}
      <h2 className="text-xl font-semibold text-center mb-6 text-red-500 tracking-wide border-b border-gray-700 pb-2">
  I'm Admin
</h2>


        <nav className="flex flex-col space-y-4 w-full">
          <Link to="/admin/courses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/create">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded">
              Create Course
            </button>
          </Link>
          <Link to="/admin">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
              Home
            </button>
          </Link>
          <Link to="/admin/profile">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
              Manage Admin
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
            Welcome Back, Admin!
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage your platform efficiently — create, update, and monitor courses with ease.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="Admin Illustration"
            className="w-40 h-40 mx-auto mt-6"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
