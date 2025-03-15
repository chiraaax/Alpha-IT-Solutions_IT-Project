import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';  

const authMiddleware = async (req, res, next) => {
    try{
        const token = req.header('Authorization')?.split(' ')[1]; //Get token from header
        if(!token){
            return res.status(401).json({message: "Access Denied. No token provided."});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); //Exclude password

        if(!req.user){
            return res.status(401).json({message: "User not found"});
        }

        next();
    }catch(error){
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

export default authMiddleware;