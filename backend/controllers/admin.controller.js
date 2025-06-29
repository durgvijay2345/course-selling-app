import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config/config.js";
import { Admin } from "../models/admin.model.js";
import cloudinary from "../config/cloudinary.js";


// Zod schema outside to avoid re-creation every time
const adminSchema = z.object({
  firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
  lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

// Admin Signup
export const signup = async (req, res) => {
  try {
    const validatedData = adminSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.issues.map((err) => err.message),
      });
    }

    const { firstName, lastName, email, password } = validatedData.data;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ errors: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return res.status(201).json({ message: "Signup succeeded", admin: newAdmin });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ errors: "Server error during signup" });
  }
};

// Admin Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      config.JWT_ADMIN_PASSWORD,
      { expiresIn: "1d" }
    );

    const cookieOptions = {
      expires: new Date(Date.now() + 86400000), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("jwt", token, cookieOptions);
    return res.status(200).json({ message: "Login successful", admin, token });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ errors: "Server error during login" });
  }
};

// Admin Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ errors: "Server error during logout" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const adminId = req.adminId; // Make sure middleware sets this

    if (!adminId) {
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
            { resource_type: "image", folder: "admins" },
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

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ errors: "Admin not found" });
    }

    return res.status(200).json({ message: "Profile updated", admin: updatedAdmin });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ errors: "Profile update failed" });
  }
};