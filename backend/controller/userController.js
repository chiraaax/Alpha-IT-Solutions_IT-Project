import User from '../models/userModel.js';  
import bcrypt from 'bcryptjs';

export const updateUser = async(req, res) => {
    try{
        const {name, email, contactNumber, address} = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {name, email, contactNumber, address},
            {new: true}
        );

        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({
            message: "User updated successfully", 
            updatedUser: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                contactNumber: updatedUser.contactNumber,
                address: updatedUser.address,
            }
        });

    }catch(error){
        res.status(500).json({ message: "Error updating user", error: error.message });
    }    
};

export const deleteUser = async(req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.user.id);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({
            message: "User deleted successfully",
            logout: true //Signal frontend to logout
        });

    }catch(error){
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

export const changePassword = async(req, res) => {
    try{
        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(!(await bcrypt.compare(oldPassword, user.password))){
            return res.status(400).json({message: "Incorrect old password"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
            logout: true //Signal frontend to log out
        });
    }catch(error){
        res.status(500).json({message: "Error changing password", error: error.message});
    }
};

export const verifyDetails = async(req, res) => {
    const {name, email, contactNumber} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({ message: "User not found." });
        }

        // Normalize names by trimming spaces and converting to lowercase
        const normalizedInputName = name?.trim().toLowerCase();
        const normalizedDbName = user.name?.trim().toLowerCase() || "";  // Avoid undefined issue
        const normalizedInputContactNumber = contactNumber?.trim();
        const normalizedDbContactNumber = user.contactNumber?.trim() || "";  // Avoid undefined issue

        console.log("Input Name:", normalizedInputName);
        console.log("DB Name:", normalizedDbName);
        console.log("Input Contact Number:", normalizedInputContactNumber);
        console.log("DB Contact Number:", normalizedDbContactNumber);

        if (normalizedDbName === normalizedInputName &&
            user.email === email &&
            normalizedDbContactNumber === normalizedInputContactNumber) {
            return res.status(200).json({ message: "User details match." });
        } else {
            return res.status(400).json({ message: "Provided details do not match registered details." });
        }
        
    }catch(error){
        console.error("Error in verifyDetails:", error);  // Logs the exact error in the backend console
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const verifyDetailsReveiws = async(req, res) => {
    const {name, email} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({ message: "User not found." });
        }

        // Normalize names by trimming spaces and converting to lowercase
        const normalizedInputName = name?.trim().toLowerCase();
        const normalizedDbName = user.name?.trim().toLowerCase() || "";  // Avoid undefined issue

        console.log("Input Name:", normalizedInputName);
        console.log("DB Name:", normalizedDbName);

        if (normalizedDbName === normalizedInputName &&
            user.email === email) {
            return res.status(200).json({ message: "User details match." });
        } else {
            return res.status(400).json({ message: "Provided details do not match registered details." });
        }
        
    }catch(error){
        console.error("Error in verifyDetails:", error);  // Logs the exact error in the backend console
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};