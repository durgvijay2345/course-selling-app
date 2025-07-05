import React, { useEffect, useState } from "react";
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
  const [showProfile, setShowProfile] = useState(false);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loadingPurchased, setLoadingPurchased] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.user) {
      setUser({ ...storedUser.user, token: storedUser.token });
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/course/courses`, { withCredentials: true })
      .then((res) => setCourses(res.data.courses))
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
      navigate("/login");
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
    <div className="bg-gradient-to-r from-black to-blue-950 text-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
            <h1 className="text-2xl text-orange-500 font-bold">CourseHaven</h1>
          </div>
          <div className="space-x-4 flex items-center relative">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-red-600 transition duration-300 cursor-pointer"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="cursor-pointer"
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
                  <div className="absolute right-0 top-14 bg-white text-black p-4 rounded-xl shadow-2xl w-72 z-50">
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
                        className="mt-4 inline-block text-sm text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition cursor-pointer"
                      >
                        Edit Profile
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-black font-semibold px-5 py-2 rounded-full shadow-md hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-white hover:text-black transition duration-300 cursor-pointer"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="text-center mt-16">
          <h1 className="text-4xl font-bold text-orange-500">Welcome to CourseHaven</h1>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Your one-stop destination to upskill, reskill and grow with the best curated online
            courses. Whether you are a student, professional, or entrepreneur — we have something
            for you.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-black hover:text-white transition cursor-pointer"
            >
              Browse Courses
            </Link>
            <a
              href="https://www.youtube.com/@shubhamtiwari2533-b4d"
              target="_blank"
              rel="noreferrer"
              className="bg-white text-black px-6 py-2 rounded-full shadow-md hover:bg-black hover:text-white transition cursor-pointer"
            >
              Watch Demos
            </a>
          </div>
        </section>

        {/* Courses */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-center mb-4">Popular Courses</h2>
          <Slider {...settings}>
            {courses.map((course) => (
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
                    ) : purchasedCourses.includes(course._id.toString()) ? (
                      <Link
                        to="/purchases"
                        className="bg-gray-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-black transition cursor-pointer"
                      >
                        Enrolled
                      </Link>
                    ) : (
                      <Link
                        to={`/buy/${course._id}`}
                        className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition cursor-pointer"
                      >
                        Enroll Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* Why Choose */}
        <section className="mt-16 text-center max-w-3xl mx-auto px-4 text-gray-300">
          <h2 className="text-2xl font-bold text-orange-400 mb-3">Why Choose CourseHaven?</h2>
          <p>
            We collaborate with industry experts to bring you the most relevant, high-quality
            courses in technology, business, and more. Learn at your pace, earn certificates, and
            level up your career — all from the comfort of your home.
          </p>
        </section>

        {/* Static Links */}
        <section className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-orange-400 mb-6">Explore Policies & Help</h3>
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {[
              { to: "/privacy-policy", label: "Privacy Policy" },
              { to: "/contact-us", label: "Contact Us" },
              { to: "/refund-policy", label: "Refund Policy" },
              { to: "/shipping-policy", label: "Shipping Policy" },
              { to: "/terms-and-conditions", label: "Terms & Conditions" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="bg-gray-800 text-white px-4 py-2 rounded-full shadow hover:bg-black transition cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <hr className="my-8 border-gray-600" />
        <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left text-sm">
          <div>
            <div className="flex justify-center md:justify-start items-center gap-2 mb-2">
              <img src={logo} alt="logo" className="w-6 h-6 rounded-full" />
              <h1 className="text-xl text-orange-500 font-bold">CourseHaven</h1>
            </div>
            <p>Follow us</p>
           <div className="flex justify-center md:justify-start gap-6 mt-4">
  <a href="https://facebook.com/share/1JoJVnasWk" target="_blank" rel="noopener noreferrer">
    <FaFacebook className="text-2xl text-blue-500 hover:text-blue-700 transition duration-300" />
  </a>
  <a href="https://instagram.com/tiwaridurgvijay" target="_blank" rel="noopener noreferrer">
    <FaInstagram className="text-2xl text-pink-500 hover:text-pink-700 transition duration-300" />
  </a>
  <a href="https://x.com/tiwari_shu9154" target="_blank" rel="noopener noreferrer">
    <FaTwitter className="text-2xl text-blue-600 hover:text-blue-800 transition duration-300" />
  </a>
  <a href="https://github.com/durgvijay2345" target="_blank" rel="noopener noreferrer">
    <FaGithub className="text-2xl text-gray-700 hover:text-black transition duration-300" />
  </a>
</div>

          </div>
          <div>
            <h3 className="font-semibold mb-1">Connect</h3>
            <p>YouTube: MeShubham</p>
            <p>Telegram: Durgvijay Tiwari</p>
            <p>GitHub: durgvijay2345</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">© 2025 CourseHaven</h3>
            <p>All rights reserved.</p>
            <p className="text-gray-400">Designed by CourseHaven Team</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
