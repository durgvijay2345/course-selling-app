import express from "express";
const router = express.Router();
import upload from "../middleware/multer.js";


import { createCourse,deleteCourse, updateCourse,getCourses, courseDetails,buyCourses,addReview } from "../controllers/course.controller.js";
import  userMiddleware from "../middleware/user.mid.js"
import adminMiddleware from "../middleware/admin.mid.js";
// Define the POST route
router.post("/create", adminMiddleware, upload.single("image"), createCourse);
router.put("/update/:courseId", adminMiddleware, upload.single("image"), updateCourse);
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)
router.get("/courses",getCourses)
router.get("/:courseId",courseDetails)

router.post("/buy/:courseId",userMiddleware,buyCourses)

router.post("/:courseId/review", userMiddleware, addReview);


export default router;

