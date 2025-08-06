import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../frontend-config/api";

function Home() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loadingPurchased, setLoadingPurchased] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.user) {
      setUser({ ...storedUser.user, token: storedUser.token });
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/course/courses`, { withCredentials: true })
      .then((res) => setCourses(Array.isArray(res.data.courses) ? res.data.courses : []))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  useEffect(() => {
    const fetchPurchased = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.token) return;
      try {
        const res = await axios.get(`${BACKEND_URL}/purchase/all`, {
          headers: { Authorization: `Bearer ${storedUser.token}` },
          withCredentials: true,
        });
        setPurchasedCourses(res.data.purchasedCourses || []);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
      } finally {
        setLoadingPurchased(false);
      }
    };
    fetchPurchased();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/user/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      toast.error(err.response?.data?.errors || "Logout failed");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    swipe: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 text-white min-h-screen font-inter">
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur bg-black/70 shadow-lg rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
            <h1 className="text-2xl text-orange-500 font-bold">CourseHaven</h1>
          </div>

          <div className="flex items-center gap-4 relative">
            {user ? (
              <div className="relative flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile((prev) => !prev);
                  }}
                  className="cursor-pointer hover:scale-105 transition"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-orange-400" />
                  )}
                </button>

                {showProfile && (
                  <div
                    ref={profileRef}
                    className="absolute top-full mt-6 sm:mt-4 sm:right-0 left-1/2 sm:left-auto transform sm:translate-x-0 -translate-x-1/2 w-72 max-w-xs bg-white text-black rounded-xl shadow-xl p-4 pt-3 z-50 mx-4 sm:mx-0"
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={user.avatar || ""}
                        alt="Avatar"
                        className="h-20 w-20 rounded-full object-cover border-4 border-orange-500 mb-3"
                      />
                      <h3 className="text-lg font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <Link
                        to="/user/setting"
                        className="mt-4 text-sm text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition"
                      >
                        Update Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="mt-2 text-sm text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/login"
                  className="bg-white text-black font-semibold px-5 py-2 rounded-full shadow hover:bg-orange-500 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-white hover:text-black transition"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center mt-20">
          <h1 className="text-5xl font-bold text-orange-500 tracking-tight">Welcome to CourseHaven</h1>
          <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
            Upskill, Reskill & Grow with the best curated online courses.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-black hover:text-white transition"
            >
              Browse Courses
            </Link>
            <a
              href="https://www.youtube.com/@shubhamtiwari2533-b4d"
              target="_blank"
              rel="noreferrer"
              className="bg-white text-black px-6 py-2 rounded-full shadow-md hover:bg-black hover:text-white transition"
            >
              Watch Demos
            </a>
          </div>
        </section>

        {/* Slider Section */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-center mb-4">Popular Courses</h2>
          <div className="relative overflow-hidden">
            <Slider {...settings}>
              {Array.isArray(courses) &&
                courses.map((course) => (
                  <div key={course._id} className="px-2">
                    <div className="bg-gray-900 rounded-2xl shadow-md hover:scale-105 transition p-4">
                      <img
                        src={course.image?.url}
                        alt={course.title}
                        className="h-40 w-full object-contain bg-white rounded-xl"
                      />
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                        {loadingPurchased ? (
                          <button
                            disabled
                            className="bg-gray-600 text-white text-sm px-4 py-2 rounded-full shadow-md cursor-wait"
                          >
                            Checking...
                          </button>
                        ) : purchasedCourses.includes(course._id) ? (
                          <Link
                            to="/purchases"
                            className="bg-gray-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-black transition"
                          >
                            Enrolled
                          </Link>
                        ) : (
                          <Link
                            to={`/buy/${course._id}`}
                            className="relative z-10 bg-orange-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition"
                          >
                            Enroll Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="mt-20 text-center max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-orange-400 mb-6">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-white">
            <Link to="/privacy" className="bg-gray-800 rounded-xl py-4 shadow-md hover:shadow-orange-400/20 hover:scale-105 transition">Privacy Policy</Link>
            <Link to="/terms" className="bg-gray-800 rounded-xl py-4 shadow-md hover:shadow-orange-400/20 hover:scale-105 transition">Terms & Conditions</Link>
            <Link to="/refund" className="bg-gray-800 rounded-xl py-4 shadow-md hover:shadow-orange-400/20 hover:scale-105 transition">Refund Policy</Link>
            <Link to="/shipping" className="bg-gray-800 rounded-xl py-4 shadow-md hover:shadow-orange-400/20 hover:scale-105 transition">Shipping Policy</Link>
            <Link to="/contact" className="bg-gray-800 rounded-xl py-4 shadow-md hover:shadow-orange-400/20 hover:scale-105 transition">Contact Us</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t pt-10 text-sm text-gray-400 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div>
            <div className="flex justify-center sm:justify-start items-center gap-2 mb-2">
              <img src={logo} alt="logo" className="w-6 h-6 rounded-full" />
              <h1 className="text-xl text-orange-500 font-bold">CourseHaven</h1>
            </div>
            <p className="text-gray-300">Follow us on</p>
            <div className="flex justify-center sm:justify-start gap-4 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook className="text-xl text-blue-500 hover:text-blue-700 transition duration-300" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="text-xl text-pink-500 hover:text-pink-700 transition duration-300" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="text-xl text-blue-400 hover:text-blue-600 transition duration-300" /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub className="text-xl text-white hover:text-gray-400 transition duration-300" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-white">Connect</h3>
            <p>YouTube: <span className="text-orange-300">MeShubham</span></p>
            <p>Telegram: <span className="text-orange-300">Durgvijay Tiwari</span></p>
            <p>GitHub: <span className="text-orange-300">durgvijay2345</span></p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-white">© 2025 CourseHaven</h3>
            <p>All rights reserved.</p>
            <p className="text-gray-500">Designed by CourseHaven Team</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;

