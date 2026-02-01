import { validateToken } from "../services/token.js";
import User from "../models/user.js";

// exporting async function to check for authentication
export async function checkForAuthentication(req, res, next) {
  const token = req.cookies?.token;
  req.user = null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = validateToken(token); // throws if invalid
    // fetch the current user from DB (live data)
    const user = await User.findById(payload._id).select("-password"); // exclude sensitive fields
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user; // attach live Mongoose document
    return next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// exporting function to restrict access based on roles
export function restrictTo(...roles) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}
