import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../../frontend-config/api";

function AdminHome() {
  const [admin, setAdmin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin?.user) {
      setAdmin(storedAdmin.user);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/admin/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("admin");
      setAdmin(null);
      toast.success(res.data.message);
      navigate("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen text-white">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-5 bg-black bg-opacity-30 gap-4 relative">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <h1 className="text-xl md:text-2xl font-bold text-orange-500">Admin Panel</h1>
        </div>

        {/* Auth controls */}
        <div className="flex items-center gap-4 relative">
          {!admin ? (
            <Link
              to="/admin/login"
              className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 text-sm md:text-base"
            >
              Admin Login
            </Link>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-sm md:text-base"
              >
                Logout
              </button>
              <Link
                to="/admin/dashboard"
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-sm md:text-base"
              >
                Go to Dashboard
              </Link>

              <button onClick={() => setShowProfile(!showProfile)}>
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

             {showProfile && (
  <div className="absolute right-0 top-14 bg-white text-gray-800 p-4 rounded-xl shadow-2xl w-72 z-50 border border-gray-200">
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

            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 text-center h-[80vh]">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">
          Welcome to CourseHaven Admin Panel
        </h2>
        <p className="text-gray-300 max-w-xl text-sm md:text-base">
          Manage your platform with ease. You can create, update, and control courses from here.
        </p>
      </main>
    </div>
  );
}

export default AdminHome;
