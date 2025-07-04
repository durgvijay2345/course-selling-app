import { Course } from "../models/course.model.js";
import cloudinary from "../config/cloudinary.js";

import streamifier from "streamifier";
import { Purchase } from "../models/purchase.model.js";
import Order from "../models/order.model.js";
import Razorpay from "razorpay";


if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys are missing in environment variables");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Create course
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ errors: "Image is required" });
    }

    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(req.file.mimetype)) {
      return res.status(400).json({ errors: "Only PNG/JPG allowed" });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "courses" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const uploadedImage = await streamUpload();

    const course = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      },
      creatorId: adminId,
    });

    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ errors: "Error creating course" });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
      return res.status(404).json({ errors: "Unauthorized to update course" });
    }

    if (req.file) {
      if (course.image?.public_id) {
        await cloudinary.uploader.destroy(course.image.public_id);
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "courses" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();

      course.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;

    await course.save();

    res.status(200).json({ message: "Course updated", course });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ errors: "Error updating course" });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Fetch courses error:", error);
    res.status(500).json({ errors: "Error fetching courses" });
  }
};

// Get single course


// Buy course (create Razorpay order)
export const buyCourses = async (req, res) => {
  console.log("🎯 BUY route hit: real Razorpay order");

  const userId = req.userId;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ errors: "Course not found" });

    const alreadyPurchased = await Purchase.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(400).json({ errors: "Already purchased" });
    }

    const amount = course.price;

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    });

    await Order.create({
      courseId,
      userId,
      amount,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      status: "created"
    });

    res.status(200).json({
      orderId: razorpayOrder.id,             // ✅ real Razorpay order ID
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,     // ✅ use real Razorpay key from .env
      course                                 // ✅ also send course
    });
    console.log("🛠️ Razorpay Key:", process.env.RAZORPAY_KEY_ID);


  } catch (error) {
    console.error("Buy course error:", error);
    res.status(500).json({ errors: "Error buying course" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({ _id: courseId, creatorId: adminId });

    if (!course) {
      return res.status(404).json({ errors: "Unauthorized to delete course" });
    }

    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ errors: "Error deleting course" });
  }
};
 export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId)
      .populate("reviews.user", "firstName lastName")
      .lean();

    if (!course) return res.status(404).json({ error: "Course not found" });

    res.status(200).json({ course });
  } catch (error) {
    console.error("Course details error:", error);
    res.status(500).json({ errors: "Error fetching course details" });
  }
};

export const addReview = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;
  const { rating, comment } = req.body;

  try {
    // ✅ Check if user purchased the course
    const hasPurchased = await Purchase.findOne({ userId, courseId });
    if (!hasPurchased) {
      return res.status(403).json({ errors: "You must purchase the course to review it" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ errors: "Course not found" });

    // ✅ Check if user already reviewed
    const alreadyReviewed = course.reviews.find((r) => r.user.toString() === userId);
    if (alreadyReviewed) {
      return res.status(400).json({ errors: "You already submitted a review" });
    }

    // ✅ Add new review
    course.reviews.push({ user: userId, rating, comment });

    // ✅ Update average rating
    const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.averageRating = totalRating / course.reviews.length;

    await course.save();

    res.status(200).json({ message: "Review added" });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ errors: "Server error" });
  }
};
