import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import config from "./config/config.js";

import cookieParser from "cookie-parser";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

const DB_URI = process.env.MONGO_URI;

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "https://course-selling-app-sage.vercel.app", // your frontend
  "http://localhost:5173" // local dev
];

app.use(
  cors({
    origin: allowedOrigins,
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

 app.get("/", (req, res) => {
  res.send("API is live 🚀");
});

// ✅ Start server only after DB connection
const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB connected");

    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();