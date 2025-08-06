// config.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from parent directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3001,
  JWT_USER_PASSWORD: process.env.JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD: process.env.JWT_ADMIN_PASSWORD,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
 RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

  NODE_ENV: process.env.NODE_ENV,
};

export default config;
