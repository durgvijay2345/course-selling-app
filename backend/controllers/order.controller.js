import crypto from "crypto";
import Order from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }

  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "paid",
    },
    { new: true }
  );

  // Save the purchase
  await Purchase.create({
    userId: order.userId,
    courseId: order.courseId,
  });

  res.status(200).json({ success: true, message: "Payment verified" });
};
