import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload, FaStar, FaRegStar } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../frontend-config/api";
import { FaShoppingCart } from "react-icons/fa";

function Purchases() {
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
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
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
      const res = await axios.post(`${BACKEND_URL}/user/logout`, {}, { withCredentials: true });
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.errors || "Error logging out");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
    {/* Sidebar */}
    <div
      className={`fixed inset-y-0 left-0 bg-white shadow-2xl p-5 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50 border-r border-gray-200`}
    >
      <nav>
        <ul className="mt-16 md:mt-0 space-y-6 text-gray-700">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 hover:text-blue-600 font-semibold transition"
            >
              <RiHome2Fill /> Home
            </Link>
          </li>
          <li>
            <Link
              to="/courses"
              className="flex items-center gap-2 hover:text-blue-600 font-semibold transition"
            >
              <FaDiscourse /> Courses
            </Link>
          </li>
          <li>
            <span className="flex items-center gap-2 text-blue-600 font-bold">
              <FaDownload /> Purchases
            </span>
          </li>
          <li>
            <Link
              to="/user/setting"
              className="flex items-center gap-2 hover:text-blue-600 font-semibold transition"
            >
              <IoMdSettings /> Settings
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-600 transition"
              >
                <IoLogOut /> Logout
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-blue-500">
                <IoLogIn /> Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>

    {/* Sidebar Toggle Button */}
    <button
      className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-full shadow-lg"
      onClick={toggleSidebar}
    >
      {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
    </button>

    {/* Main Content */}
    <div
      className={`flex-1 p-6 sm:p-8 transition-all duration-300 min-h-screen ${
        isSidebarOpen ? "ml-64" : "ml-0"
      } md:ml-64`}
    >
    <h1 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-black mb-8">
  <FaShoppingCart className="text-2xl text-red-600" />
  My Purchases
</h1>


      {errorMessage && (
        <div className="text-red-500 text-center font-semibold mb-4">{errorMessage}</div>
      )}

      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {purchases.map((course, index) => (
            <Link to={`/course/${course._id}`} key={index}>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1">
                <img
                  className="rounded-xl w-full h-44 object-cover mb-4"
                  src={course.image?.url || "https://via.placeholder.com/200"}
                  alt={course.title || "Course Image"}
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {course.title || "Untitled Course"}
                </h3>

                {/* ⭐ Course average rating */}
                <div className="flex items-center text-yellow-500 mb-1">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(course.averageRating || 0) ? (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ) : (
                      <FaRegStar key={i} className="text-gray-300 text-sm" />
                    )
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {course.description || "No description available."}
                </p>

                <div className="mt-auto pt-2 text-right">
                  <span className="inline-block bg-green-100 text-green-700 font-semibold text-sm px-3 py-1 rounded-full">
                    ₹{course.price}
                  </span>
                </div>
              </div>
            </Link>
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

export default Purchases;
