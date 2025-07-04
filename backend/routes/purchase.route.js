import express from "express";
import userMiddleware from "../middleware/user.mid.js";
import Purchase from "../models/purchase.model.js"; 

const router = express.Router();


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

export default router;
