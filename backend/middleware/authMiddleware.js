import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = (roles = []) => async (req, res, next) => {
    try {
        console.log("🔍 Auth Middleware - Checking token");
        const token = req.header('Authorization')?.split(' ')[1] || req.cookies.token; // Get token from header

        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        // Verify token with timeout
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { maxAge: '1h' });
        console.log("🔍 Decoded Token:", { id: decoded.id, iat: decoded.iat });

        // Database lookup with timeout
        req.user = await User.findById(decoded.id)
            .select('-password -__v')
            .maxTimeMS(5000);

        if (!req.user) {
            console.log("❌ User not found for token");
            return res.status(401).json({ message: "User not found" });
        }

        // If roles are specified, check if the user has the required role
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied. Insufficient permissions." });
        }

        console.log("✅ Authenticated user:", req.user.email);
        next();
    } catch (error) {
        console.error("🔴 Auth Middleware Error:", {
            name: error.name,
            message: error.message,
            expiredAt: error.expiredAt
        });

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        res.status(401).json({ message: "Invalid authentication token" });
    
    }
};

export default authMiddleware;
