 import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BACKEND_URL } from '../../frontend-config/api';


function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Clear fields on component mount
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/user/login`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });

      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      const errMsg = error.response?.data?.errors || "Login failed!";
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-screen container mx-auto flex items-center justify-center text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to="/" className="text-xl font-bold text-orange-500">CourseHaven</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/signup" className="border border-gray-500 px-3 py-1 rounded text-sm md:text-md">Signup</Link>
            <Link to="/courses" className="bg-orange-500 px-3 py-1 rounded text-sm md:text-md">Join now</Link>
          </div>
        </header>

        {/* Login Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">CourseHaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">Log in to access paid content</p>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 mb-1">Email</label>
             <input
                type="email"
                id="email"
                autoComplete="off"
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
    autoComplete="off"
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
              <p className="mb-4 text-red-500 text-center">{errorMessage}</p>
            )}

            <button type="submit" className="mb-2 w-full bg-orange-500 hover:bg-blue-600 text-white py-3 rounded-md transition">
              Login
            </button>
          </form>
          <Link to="/forgot-password" className="text-sm text-red-600 hover:underline">
  Forgot Password?
</Link>

          {/* Suggest Signup */}
          <p className="mt-6 text-center text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-orange-400 hover:underline">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default login;
