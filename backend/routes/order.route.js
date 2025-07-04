// routes/order.route.js
import express from "express";
import razorpay from "../utils/razorpay.js";
import Order from "../models/order.model.js";
import userMiddleware from "../middleware/user.mid.js";
import { verifyPayment } from "../controllers/order.controller.js";

const router = express.Router();

// ✅ CREATE ORDER
router.post("/create", userMiddleware, async (req, res) => {
  const { courseId, amount } = req.body;
  const userId = req.userId;

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save order in DB
    await Order.create({
      courseId,
      userId,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Order creation failed", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// ✅ VERIFY PAYMENT
router.post("/verify", userMiddleware, verifyPayment);

export default router;

