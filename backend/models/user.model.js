import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  avatar:    { type: String, default: "" },

  // ✅ Add these for OTP reset
 resetOTP: String,
resetOTPExpires: Date,
});


export const User = mongoose.model("User", userSchema);
