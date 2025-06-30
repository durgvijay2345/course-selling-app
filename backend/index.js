import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import cookieParser from "cookie-parser";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const DB_URI = process.env.MONGO_URI;

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




// ✅ Routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);  // ✅ Fixed missing slash

// ✅ Start server only after DB connection
const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit process if DB fails
  }
};

startServer();
