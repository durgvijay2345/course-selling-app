import jwt from "jsonwebtoken";
import config from "../config/config.js"; // ✅ import your secret key

export default function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD); // ✅ verify using secret
    req.adminId = decoded.id; // ✅ correct field is `id`, not `Id`
    next();
  } catch (error) {
    console.log("Invalid token", error);
    return res.status(403).json({ errors: "Invalid or expired token" });
  }
}
