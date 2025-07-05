import express from "express";
import userMiddleware from "../middleware/user.mid.js";
import {Purchase} from "../models/purchase.model.js";

const router = express.Router();

// ✅ Existing route - check single course
router.get("/check/:courseId", userMiddleware, async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;

  try {
    const hasPurchased = await Purchase.findOne({ userId, courseId });
    res.status(200).json({ purchased: !!hasPurchased });
  } catch (error) {
    console.error("Purchase check error:", error);
    res.status(500).json({ errors: "Failed to check purchase" });
  }
});

// ✅ New route - get all purchased course IDs for logged-in user
router.get("/all", userMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const purchases = await Purchase.find({ userId }).select("courseId");
    const purchasedCourses = purchases.map((p) => p.courseId.toString());
    res.status(200).json({ purchasedCourses });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ errors: "Failed to fetch purchased courses" });
  }
});

export default router;