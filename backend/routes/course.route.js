import express from "express";
const router = express.Router();
import upload from "../middleware/multer.js";

import {
  createCourse,
  deleteCourse,
  updateCourse,
  getCourses,
  courseDetails,
  buyCourses,
  addReview,
  getCourseReviews,   // ✅ <-- Import this new controller
} from "../controllers/course.controller.js";

import userMiddleware from "../middleware/user.mid.js";
import adminMiddleware from "../middleware/admin.mid.js";

// Course CRUD
router.post("/create", adminMiddleware, upload.single("image"), createCourse);
router.put("/update/:courseId", adminMiddleware, upload.single("image"), updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

// Get All + One Course
router.get("/courses", getCourses);
router.get("/:courseId", courseDetails);

// ✅ Get all reviews for a course
router.get("/:courseId/reviews", getCourseReviews); // ⬅️ Add this line

// Purchase Course
router.post("/buy/:courseId", userMiddleware, buyCourses);

// Add a Review
router.post("/:courseId/review", userMiddleware, addReview);

export default router;
