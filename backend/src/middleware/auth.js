import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * authenticate middleware
 * Verifies the JWT token from the Authorization header.
 * Attaches the full user document to req.user on success.
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Extract token from "Bearer <token>" header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user from DB (ensures user still exists and is still active)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token belongs to a non-existent user.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact an admin.",
      });
    }

    // 4. Attach user to request — available in all subsequent middleware/controllers
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
    next(error);
  }
};

export { authenticate };
