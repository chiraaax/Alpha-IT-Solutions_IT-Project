import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    otp: String,
    isVerified: { type: Boolean, default: false },
    contactNumber: String, 
    address: String
});

const User = mongoose.model('User', UserSchema);

const ensureAdminExists = async () => {
    try {
        const admin1 = await User.findOne({ email: "admin1@example.com" });
        const admin2 = await User.findOne({ email: "admin2@example.com" });

        if (!admin1) {
            await User.create({
                name: "Admin One",
                email: "admin1@example.com",
                password: await bcrypt.hash("admin123", 10), // Hash password
                role: "admin",
                isVerified: true
            });   
        }

        if (!admin2) {
            await User.create({
                name: "Admin Two",
                email: "admin2@example.com",
                password: await bcrypt.hash("admin23", 10), // Hash password
                role: "admin",
                isVerified: true
            });
        }

        console.log("Admins checked/created.");
    } catch (error) {
        console.error("Error ensuring admin accounts:", error.message);
    }
};

ensureAdminExists();

export default User;
