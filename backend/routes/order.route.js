import express from "express";
import { verifyPayment } from "../controllers/order.controller.js";
import userMiddleware from "../middleware/user.mid.js";

const router = express.Router();
router.post("/verify",userMiddleware, verifyPayment);

export default router;
