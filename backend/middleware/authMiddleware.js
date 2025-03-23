import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.split(' ')[1]; // Get token from header
      if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password'); // Exclude password

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if the user's role is allowed
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      req.user = user; // Attach the user to the request object
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token." });
    }
  };
};

export default authMiddleware;