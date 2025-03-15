import User from '../models/userModel.js';  
import bcrypt from 'bcryptjs';

export const updateUser = async(req, res) => {
    try{
        const {name, email} = req.body;
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
            user: {
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