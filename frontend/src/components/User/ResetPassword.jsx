import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
     const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error("OTP expired. Please try again.");
          navigate("/forgot-password");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Unauthorized check
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    const otpVerified = localStorage.getItem("otpVerified");
    if (!storedEmail || otpVerified !== "true") {
      toast.error("Unauthorized access");
      navigate("/forgot-password");
    }
  }, [navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleReset = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/user/verify-otp-and-reset`, {
      email,
      password: newPassword,
    });

    toast.success(response.data.message);
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("otpVerified");
    navigate("/login");
  } catch (err) {
    toast.error(err.response?.data?.errors || "Reset failed");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleReset} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

        <div className="text-sm mb-4 text-gray-600">Email: <strong>{email}</strong></div>

        {/* New Password Field */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="border p-3 rounded w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[45px] right-4 text-gray-400 hover:text-orange-500 text-lg cursor-pointer transition duration-200"
           >
             {showPassword ? <FaEyeSlash /> : <FaEye />}
             </span>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            className="border p-3 rounded w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-[45px] right-4 text-gray-400 hover:text-orange-500 text-lg cursor-pointer transition duration-200"
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Reset Password
        </button>
      </form>
    </div>
  );
};
export default ResetPassword;
