import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../frontend-config/api";

function purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setPurchase(response.data.courseData);
      } catch (error) {
        console.error("Fetch purchases failed:", error);
        setErrorMessage("Failed to fetch purchase data");
      }
    };

    if (token) fetchPurchases();
  }, [token]);

  const handleLogout = async () => {
    try {
     await axios.post(
  `${BACKEND_URL}/user/logout`,
  {},
  { withCredentials: true }
);
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.errors || "Error logging out");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0 space-y-4">
            <li>
              <Link to="/" className="flex items-center hover:text-blue-600 font-medium">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link to="/courses" className="flex items-center hover:text-blue-600 font-medium">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li>
              <span className="flex items-center text-blue-600 font-bold">
                <FaDownload className="mr-2" /> Purchases
              </span>
            </li>
            <li>
              <Link to="/user/setting" className="flex items-center hover:text-blue-600 font-medium">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 font-medium"
                >
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Toggle button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 transition-all duration-300 min-h-screen ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8">🛒 My Purchases</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition duration-300 flex flex-col"
              >
                <img
                  className="rounded-xl w-full h-48 object-cover mb-4"
                  src={purchase.image?.url || "https://via.placeholder.com/200"}
                  alt={purchase.title || "Course Image"}
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {purchase.title || "Untitled Course"}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  {purchase.description?.length > 100
                    ? `${purchase.description.slice(0, 100)}...`
                    : purchase.description || "No description available."}
                </p>
                <div className="mt-auto pt-2 text-right">
                  <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-3 py-1 rounded-full">
                    ₹{purchase.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-10">
            You have no purchases yet. Go grab a course!
          </p>
        )}
      </div>
    </div>
  );
}

export default purchases;
