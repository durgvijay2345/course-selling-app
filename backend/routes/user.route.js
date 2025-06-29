import express from "express";
import { signup,login,logout,purchases,updateUserProfile,
  deleteAccount,forgotPassWord,verifyOtp,resetPassword} from "../controllers/user.controller.js";
import  userMiddleware from "../middleware/user.mid.js"
const router = express.Router();

import  upload  from "../middleware/multer.js";
// Define the POST route
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/purchases",userMiddleware,purchases)

router.delete("/delete", userMiddleware, deleteAccount);

router.put("/user-update", userMiddleware, upload.single("avatar"), updateUserProfile);
router.post("/forgot-password", forgotPassWord);
router.post("/verify-otp", verifyOtp); 
router.post("/verify-otp-and-reset", resetPassword);



export default router;

