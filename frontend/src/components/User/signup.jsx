 import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { BACKEND_URL } from '../../frontend-config/api';


function signup() {
  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Clear all fields on mount
  useEffect(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    localStorage.removeItem("resetEmail"); // optional cleanup
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        firstName,
        lastName,
        email,
        password
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const errMsg = error.response?.data?.errors || "User already exists or invalid data";
      setErrorMessage(errMsg);
    }
  };

  return (
  <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen">
    <div className="container mx-auto flex flex-col items-center justify-center text-white px-4 relative">
      
      {/* Header */}
      <header className="w-full flex flex-wrap justify-between items-center p-4 absolute top-0 left-0 z-50">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
         <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <Link to="/" className="text-xl font-bold text-orange-500">CourseHaven</Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/login" className="border border-gray-500 px-3 py-1 rounded text-sm sm:text-md">Login</Link>
          <Link to="/courses" className="bg-orange-500 px-3 py-1 rounded text-sm sm:text-md">Join now</Link>
        </div>
      </header>

      {/* Signup Form */}
      <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md mt-28 sm:mt-32">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Welcome to <span className="text-orange-500">CourseHaven</span>
        </h2>
        <p className="text-center text-gray-400 mb-6">Just Signup To Join Us!</p>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-gray-400 mb-1">Firstname</label>
            <input
              type="text"
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Type your firstname"
              required
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-gray-400 mb-1">Lastname</label>
            <input
              type="text"
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Type your lastname"
              required
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              required
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-400 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-3 pr-12 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[45px] right-4 text-gray-400 hover:text-orange-500 text-lg cursor-pointer transition duration-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
          )}

          <button type="submit" className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 rounded-md transition">
            Signup
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  </div>
);

}

export default signup;
