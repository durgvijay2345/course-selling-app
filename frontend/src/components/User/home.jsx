import React, { useEffect, useState } from 'react';
import logo from "../../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaGithub, FaUserCircle } from "react-icons/fa";
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../frontend-config/api';


function home() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

   useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.user) {
        setUser(storedUser.user);
      }
    }, []);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/user/logout`, {}, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setUser(null);
      
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Logout failed");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
  <div className='bg-gradient-to-r from-black to-blue-950 text-white min-h-screen'>
    <div className='container mx-auto px-4 md:px-6 py-6'>
      {/* Header */}
      <header className='flex flex-col md:flex-row justify-between items-center gap-4 relative'>
        <div className='flex items-center space-x-2'>
          <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
          <h1 className='text-2xl text-orange-500 font-bold'>CourseHaven</h1>
        </div>

        <div className="space-x-4 flex items-center relative">
          {user ? (
            <>
              <button onClick={handleLogout} className="border border-white text-white px-4 py-2 rounded">Logout</button>
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
                <div className="absolute right-0 top-14 bg-white text-gray-800 p-4 rounded-xl shadow-2xl w-72 z-50 border border-gray-200">
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

                    <h3 className="text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>

                    <Link
                      to="/user/setting"
                      className="mt-4 inline-block text-sm text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="border border-white text-white px-4 py-2 rounded">Login</Link>
              <Link to="/signup" className="border border-white text-white px-4 py-2 rounded">Signup</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className='text-center mt-20 px-2'>
        <h1 className='text-4xl font-semibold text-orange-500'>CourseHaven</h1>
        <p className='text-gray-400 mt-4 px-2 sm:px-12'>Sharpen your skills with courses crafted by experts.</p>
        <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Link to="/courses" className='bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-white hover:text-black transition'>Explore Courses</Link>
          <a href="https://www.youtube.com/@shubhamtiwari2533-b4d?si=tFV39Mz-2tlt7oV6" target='_blank' rel="noreferrer" className='bg-white text-black px-4 py-2 rounded-xl hover:bg-green-500 hover:text-white transition'>Courses Videos</a>
        </div>
      </section>

      {/* Course Slider */}
      <section className="p-4 md:p-10">
        <Slider {...settings}>
          {courses.map((course) => (
            <div key={course._id} className="px-2">
              <div className="bg-gray-900 rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300">
                <img
                  src={course.image?.url || "https://via.placeholder.com/300"}
                  alt={course.title}
                  className="h-40 w-full object-contain bg-white"
                />
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold mb-3">{course.title}</h2>
                  <Link to={`/buy/${course._id}`} className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-white hover:text-green-600 transition">
                    Enroll Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Footer */}
      <hr className="my-6 border-gray-600" />
      <footer className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left'>
        <div>
          <div className='flex items-center justify-center md:justify-start space-x-2 mb-2'>
            <img src={logo} alt="logo" className='w-6 h-8 rounded-full' />
            <h1 className='text-xl text-orange-500 font-bold'>CourseHaven</h1>
          </div>
          <p className='mb-2'>Follow us</p>
          <div className='flex justify-center md:justify-start space-x-4'>
            <a href="https://facebook.com/share/1JoJVnasWk/"><FaFacebook /></a>
            <a href="https://instagram.com/tiwaridurgvijay"><FaInstagram /></a>
            <a href="https://x.com/tiwari_shu9154"><FaTwitter /></a>
            <a href="https://github.com/durgvijay2345"><FaGithub /></a>
          </div>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>Connects</h3>
          <ul className='text-gray-400 space-y-1'>
            <li>Youtube - MeShubham</li>
            <li>Telegram - Durgvijay Tiwari</li>
            <li>GitHub - Durgvijay Tiwari</li>
          </ul>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>© 2025 CourseHaven</h3>
          <ul className='text-gray-400 space-y-1'>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Refund & Cancellation</li>
          </ul>
        </div>
      </footer>
    </div>
  </div>
);

}

export default home;
