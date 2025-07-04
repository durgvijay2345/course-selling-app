import express from "express";
import userMiddleware from "../middleware/user.mid.js";
import Purchase from "../models/purchase.model.js"; 

const router = express.Router();


// GET /user/purchases
router.get("/all",userMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const purchases = await Purchase.find({ userId }).select("courseId");
    const purchasedCourses = purchases.map(p => p.courseId.toString());

    res.status(200).json({ purchasedCourses });
  } catch (error) {
    console.error("Fetch purchases error:", error);
    res.status(500).json({ errors: "Failed to fetch purchases" });
  }
});


export default router;
