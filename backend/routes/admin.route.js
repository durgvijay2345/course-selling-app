import express from "express";
const router = express.Router();
import { signup,login,logout} from "../controllers/admin.controller.js";
import  adminMiddleware from "../middleware/admin.mid.js"

import { updateProfile } from "../controllers/admin.controller.js";
import  upload  from "../middleware/multer.js";

// Define the POST route
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)


router.put("/update", adminMiddleware, upload.single("avatar"), updateProfile);
export default router;