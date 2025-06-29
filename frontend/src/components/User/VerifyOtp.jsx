import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../frontend-config/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ⏱️ Format seconds to mm:ss
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // ✅ Verify OTP handler
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/user/verify-otp`, {
        email,
        otp,
      });
      toast.success("OTP Verified Successfully");
      localStorage.setItem("otpVerified", "true");
      navigate("/reset-password");
    } catch (error) {
      toast.error(error.response?.data?.errors || "OTP Verification Failed");
    }
  };

  // 🔁 Resend OTP handler
  const handleResendOtp = async () => {
    try {
      await axios.post(`${BACKEND_URL}/user/forgot-password`, { email });
      toast.success("OTP resent to your email");
      setTimer(120);
      setCanResend(false);
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleVerify} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Verify OTP</h2>
        <p className="mb-4 text-sm text-gray-600 text-center">OTP sent to <strong>{email}</strong></p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="border p-3 rounded w-full mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Verify OTP
        </button>

        {!canResend ? (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Resend available in <strong>{formatTime(timer)}</strong>
          </p>
        ) : (
          <p className="text-center mt-4">
            <button type="button" onClick={handleResendOtp} className="text-blue-600 underline">
              Resend OTP
            </button>
          </p>
        )}
      </form>
    </div>
  );
};


export default VerifyOtp;
