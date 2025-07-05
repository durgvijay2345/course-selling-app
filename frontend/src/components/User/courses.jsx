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
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseReviews, setCourseReviews] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
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
        const res = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(res.data.courses);
      } catch (err) {
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token;
        if (!token) return;
        const res = await axios.get(`${BACKEND_URL}/purchase/all`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPurchasedCourses(res.data.purchasedCourses || []);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
      }
    };
    fetchPurchasedCourses();
  }, []);

  const handleAboutCourse = async (course) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/${course._id}/reviews`, {
        withCredentials: true,
      });
      setCourseReviews(res.data.reviews || []);
      setSelectedCourse(course);
      setShowDetailModal(true);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/user/logout`, {}, { withCredentials: true });
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
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-white bg-gray-900/60 p-2 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

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

      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white"> Explore Courses</h1>
          <div className="flex items-center space-x-4">
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

            <div className="mt-auto flex flex-col gap-2 items-center">
  {purchasedCourses.includes(course._id.toString()) ? (
     <Link
                           to="/purchases"
                           className="bg-black text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-gray-700 transition cursor-pointer"
                         >
                           Go to Course
                         </Link>
  ) : (
    <Link
      to={`/buy/${course._id}`}
      className="text-sm text-center bg-orange-800 text-white py-1.5 px-6 rounded-md hover:bg-orange-600 transition cursor-pointer"
    >
      Buy Now
    </Link>
  )}

  <button
    onClick={() => handleAboutCourse(course)}
    className="text-sm text-center bg-blue-600 text-white py-1.5 px-6 rounded-md hover:bg-blue-700 transition cursor-pointer"
  >
    About This 
  </button>
</div>
              </div>
            ))
          )}
        </section>
      </main>
      {showDetailModal && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white text-gray-800 max-w-2xl w-full p-6 rounded-xl shadow-2xl relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-orange-500 mb-4">{selectedCourse.title}</h2>
            <img
              src={selectedCourse.image?.url || "https://via.placeholder.com/400x200"}
              alt="Course"
              className="rounded-lg mb-4 w-full h-52 object-cover border border-gray-300"
            />
            <p className="mb-4 text-gray-700">{selectedCourse.description}</p>
            <div className="mb-6">
              <span className="text-lg font-semibold text-green-600">₹{selectedCourse.price}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">₹5999</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">User Reviews</h3>
            {courseReviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet for this course.</p>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {courseReviews.map((review, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center space-x-3 mb-1">
                      {review.user?.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-2xl text-gray-600" />
                      )}
                      <div>
                        <p className="text-sm font-semibold">
                          {review.user?.firstName} {review.user?.lastName}
                        </p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < review.rating ? (
                                <FaStar className="text-yellow-500 text-xs" />
                              ) : (
                                <FaRegStar className="text-gray-400 text-xs" />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
