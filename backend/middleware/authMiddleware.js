import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = (roles = []) => async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // Get token from header
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        // If roles are specified, check if the user has the required role
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied. Insufficient permissions." });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

export default authMiddleware;
