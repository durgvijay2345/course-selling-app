import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../frontend-config/api";

const forgotPassWord = () => {
  const [email, setEmail] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/user/forgot-password`, {
        email,
      });
      toast.success("OTP sent to your email");
      localStorage.setItem("resetEmail", email);
window.location.href = "/verify-otp";
    } catch (error) {
      toast.error(error.response?.data?.errors || "Failed to send OTP");
    }
  };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSendOTP}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 rounded w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};


export default forgotPassWord;
