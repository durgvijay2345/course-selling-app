import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BACKEND_URL } from '../../frontend-config/api';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  // ✅ Force logout when admin visits the login page
  useEffect(() => {
    const logoutAndClear = async () => {
      try {
        await axios.post(`${BACKEND_URL}/admin/logout`, {}, {
          withCredentials: true,
        });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        localStorage.removeItem("admin");
      }
    };
    logoutAndClear();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success(res.data.message);

      localStorage.setItem('admin', JSON.stringify({
        token: res.data.token,
        user: res.data.admin
      }));

      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.errors || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 px-4">
     <div className="w-full max-w-md bg-gradient-to-br from-white via-indigo-100 to-indigo-200 shadow-xl rounded-xl p-8">

        <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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



          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition-all duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>
       

      </div>
    </div>
  );
}

export default AdminLogin;
