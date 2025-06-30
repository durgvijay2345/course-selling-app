
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle, FaDiscourse, FaDownload, FaStar, FaRegStar } from "react-icons/fa";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import { BACKEND_URL } from "../../frontend-config/api";


function Courses() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;

    if (!token) {
      toast.error("Please login as user first");
      navigate("/login");
    } else {
      setUser(userData.user);
      setIsLoggedIn(true);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
       `${BACKEND_URL}/user/logout`,
       {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      setShowProfile(false);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.errors || "Logout failed");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) =>
          i < fullStars ? (
            <FaStar key={i} className="text-yellow-500" />
          ) : (
            <FaRegStar key={i} className="text-gray-400" />
          )
        )}
      </div>
    );
  };

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">

    {/* Sidebar Toggle Button */}
    <button
      className="md:hidden fixed top-4 left-4 z-20 text-3xl text-white bg-gray-900/60 p-2 rounded-full shadow-lg"
      onClick={toggleSidebar}
    >
      {isSidebarOpen ? <HiX /> : <HiMenu />}
    </button>

    {/* Sidebar */}
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-[#1f2937] shadow-2xl p-5 transform transition-transform duration-300 ease-in-out z-10 border-r border-gray-700 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static`}
    >
      <div className="flex items-center mb-10">
        <img src={logo} alt="Logo" className="h-12 w-12" />
        <span className="ml-3 text-xl font-bold text-white">SkillNest</span>
      </div>
      <ul className="space-y-4 font-medium text-gray-300">
        <li>
          <Link to="/" className="flex items-center hover:text-blue-400 transition">
            <RiHome2Fill className="mr-2" /> Home
          </Link>
        </li>
        <li className="text-blue-400 font-semibold flex items-center">
          <FaDiscourse className="mr-2" /> Courses
        </li>
        <li>
          <Link to="/purchases" className="flex items-center hover:text-blue-400">
            <FaDownload className="mr-2" /> Purchases
          </Link>
        </li>
        <li>
          <Link to="/user/setting" className="flex items-center hover:text-blue-400">
            <IoMdSettings className="mr-2" /> Manage Profile
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center text-red-500 hover:text-red-600"
            >
              <IoLogOut className="mr-2" /> Logout
            </button>
          ) : (
            <Link to="/login" className="flex items-center hover:text-blue-400">
              <IoLogIn className="mr-2" /> Login
            </Link>
          )}
        </li>
      </ul>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-6 md:p-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white"> Explore Courses</h1>
        <div className="flex items-center space-x-4">
          {/* Search Box */}
          <div className="flex rounded-full border border-gray-600 overflow-hidden bg-gray-800">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 text-sm bg-transparent text-white focus:outline-none"
            />
            <button
              className="bg-gray-700 px-3 hover:bg-gray-600"
              onClick={() =>
                document.getElementById("course-results")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <FiSearch className="text-gray-300 text-xl" />
            </button>
          </div>

          {/* User Avatar */}
          <button onClick={() => setShowProfile(!showProfile)}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="h-10 w-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <FaUserCircle className="text-3xl text-orange-400" />
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-4 top-16 bg-white text-gray-800 p-4 rounded-xl shadow-2xl w-72 z-50 border border-gray-200">
              <div className="flex flex-col items-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="mb-3 h-20 w-20 rounded-full object-cover border-4 border-orange-500"
                  />
                ) : (
                  <FaUserCircle className="text-5xl text-orange-400 mb-3" />
                )}
                <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <Link
                  to="/user/setting"
                  className="mt-4 text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Course Cards */}
      <section
        id="course-results"
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 overflow-y-auto h-[75vh]"
      >
        {loading ? (
          <p className="text-center text-gray-400 col-span-full">Loading...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">No courses found</p>
        ) : (
        filteredCourses.map((course) => (
  <div
    key={course._id}
    className="flex flex-col h-full bg-gray-900/70 backdrop-blur border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition duration-300"
  >
    <img
      src={course.image?.url || "https://via.placeholder.com/300"}
      alt={course.title}
      className="rounded-lg mb-4 w-full h-40 object-cover border border-gray-700"
    />
    <h2 className="font-bold text-lg text-white mb-1">{course.title}</h2>
    <div className="mb-2">{renderStars(course.averageRating || 0)}</div>
    <p className="text-gray-400 text-sm mb-4">
      {course.description.length > 100
        ? `${course.description.slice(0, 100)}...`
        : course.description}
    </p>
    <div className="flex justify-between items-center mb-4">
      <span className="font-bold text-orange-400 text-xl">
        ₹{course.price}
        <span className="line-through text-sm text-gray-500 ml-2">₹5999</span>
      </span>
      <span className="text-green-400 text-sm">20% off</span>
    </div>
    
    {/* 🔽 Push button to bottom */}
    <div className="mt-auto">
      <Link
        to={`/buy/${course._id}`}
        className="block w-full text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
      >
        Buy Now
      </Link>
    </div>
  </div>
))
        )}
      </section>
    </main>
  </div>
);
}
export default Courses;
