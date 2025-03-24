import User from '../models/userModel.js';  
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../config/nodemailer.js'; 
import { otpTemplate } from '../emailTemplates/otpTemplate.js';
import { welcomeTemplate } from '../emailTemplates/welcomeTemplate.js';
import { forgotPasswordTemplate } from '../emailTemplates/forgotPasswordTemplate.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, contactNumber, address } = req.body;
        console.log("Received registration request:", req.body); // Debug log

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({ name, email, password: hashedPassword, otp, isVerified: false, contactNumber, address });
        await newUser.save();

        const htmlContent = otpTemplate(name, otp);
        await sendEmail(email, 'OTP Verification', htmlContent);

        return res.json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = null;
            await user.save();

            const htmlContent = welcomeTemplate(user.name);
            await sendEmail(email, 'Welcome!', htmlContent);

            return res.json({ message: 'User Verified' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the login response and return immediately
        return res.json({
            message: "Login Successful", 
            token, 
            user: { role: user.role, name: user.name, email: user.email } 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "Email verified, proceed to reset password" });
    } catch (error) {
        return res.status(500).json({ message: 'Error verifying email', error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        const htmlContent = forgotPasswordTemplate(user.name);
        await sendEmail(email, 'Password Changed', htmlContent);

        return res.json({ message: "Password updated successfully, redirecting to login" });
    } catch (error) {
        return res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};
