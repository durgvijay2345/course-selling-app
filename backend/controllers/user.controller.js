import crypto from "crypto";
import { User } from "../models/user.model.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config/config.js";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";

// Move schema outside to avoid redefining every time
const userSchema = z.object({
  firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
  lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

// ✅ Signup Controller
export const signup = async (req, res) => {
  try {
    const validatedData = userSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.issues.map((err) => err.message),
      });
    }

    const { firstName, lastName, email, password } = validatedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "Signup succeeded", user: newUser });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ errors: "Server error during signup" });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ errors: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      config.JWT_USER_PASSWORD,
      { expiresIn: "1d" }
    );

    const cookieOptions = {
      expires: new Date(Date.now() + 86400000), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("jwt", token, cookieOptions);
    return res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ errors: "Server error during login" });
  }
};

// ✅ Logout Controller
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ errors: "Server error during logout" });
  }
};

// ✅ Get Purchased Courses
export const purchases = async (req, res) => {
  const userId = req.userId;
  try {
    const purchases = await Purchase.find({ userId });

    const purchasedCourseId = purchases.map((purchase) => purchase.courseId);

    const courseData = await Course.find({ _id: { $in: purchasedCourseId } });

    return res.status(200).json({ purchases, courseData });
  } catch (error) {
    console.error("Error in purchases:", error);
    return res.status(500).json({ errors: "Server error while fetching purchases" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.userId; // Make sure middleware sets this

    if (!userId) {
      return res.status(401).json({ errors: "Unauthorized. Admin ID not found." });
    }

    let avatarUrl;

    if (req.file) {
      // 🟠 Cloudinary upload using stream
      const bufferToStream = (buffer) => {
        import("stream").then(({ Readable }) => {
          const stream = new Readable();
          stream.push(buffer);
          stream.push(null);
          return stream;
        });
      };

      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "users" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer); // Stream the image buffer
        });

      const result = await uploadStream();
      avatarUrl = result.secure_url;
    }

    const updateData = {
      firstName,
      lastName,
      email,
    };

    if (avatarUrl) {
      updateData.avatar = avatarUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ errors: "user not found" });
    }

    return res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ errors: "Profile update failed" });
  }
};
// ✅ Delete Account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    res.clearCookie("jwt");

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ errors: "Server error during account deletion" });
  }
};
     // forget password

  export const forgotPassWord = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ errors: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp; // ✅ store in proper field
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot Password OTP Error:", err);
    res.status(500).json({ errors: "Server error" });
  }
};
// reset-password

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ errors: "Invalid or expired OTP" });
    }

    return res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return res.status(500).json({ errors: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ errors: "User not found" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ errors: "Server error" });
  }
};