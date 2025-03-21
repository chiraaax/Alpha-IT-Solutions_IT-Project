import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    console.log(user, setUser); 
    
    const [profile, setProfile] = useState({
      name: user?.name || "",
      email: user?.email || "",
      contactNumber: user?.contactNumber || "",
      address: user?.address || "",
    });
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const Navigate = useNavigate();

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const token = localStorage.getItem("token");
          const { data } = await axios.put(
              "http://localhost:5000/api/profile/update",
              profile, 
              { headers: { Authorization: `Bearer ${token}` } }
          );

          setUser(data.updatedUser); // Update global state
          toast.success("Profile updated successfully!");
          setShowEditForm(false);
      } catch (error) {
          console.log(error); 
          toast.error(error.response?.data?.message || "Profile update failed.");
      }
      setLoading(false);
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            toast.error("Please enter both old and new passwords.");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                "http://localhost:5000/api/profile/change-password",
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setShowPasswordForm(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Password change failed.");
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete("http://localhost:5000/api/profile/delete", {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Account deleted successfully!");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            Navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account.");
        }
        setLoading(false);
    };

    return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 flex flex-col items-center p-6">
    <h2 className="text-5xl font-extrabold text-gray-900 text-center mb-8 drop-shadow-lg">Your Profile</h2>
    <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-300">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Welcome, {user?.name}!</h2>
        
        {!showEditForm && !showPasswordForm && (
            <>
                <div className="mb-6 p-6 bg-gray-100 rounded-xl shadow-sm border border-gray-300 text-center space-y-3">
                    <p className="text-gray-700 text-lg font-mediumg"><strong>Name:</strong> {user?.name}</p>
                    <p className="text-gray-700 text-lg font-medium"><strong>Email:</strong> {user?.email}</p>
                    <p className="text-gray-700 text-lg font-medium"><strong>Contact:</strong> {user?.contactNumber}</p>
                    <p className="text-gray-700 text-lg font-medium"><strong>Address:</strong> {user?.address}</p>
                </div>

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => setShowEditForm(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md hover:scale-105 transform"
                    >
                        Edit Profile
                    </button>
                    <button 
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md hover:scale-105 transform"
                    >
                        Change Password
                    </button>
                    <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold shadow-md hover:scale-105 transform"
                    >
                        Delete Account
                    </button>
                </div>
            </>
        )}

        {showEditForm && (
            <div className="mt-6 p-6 bg-gray-100 rounded-xl shadow-md border border-gray-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h3>
                <label className="block text-gray-700 font-medium mb-2">Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={profile.name || ""} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" 
                />
                <label className="block text-gray-700 font-medium mb-2">Email Address:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={profile.email || ""} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"  
                />
                <label className="block text-gray-700 font-medium mb-2">Contact Number:</label>
                <input 
                    type="text" 
                    name="contactNumber" 
                    value={profile.contactNumber || ""} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" 
                />
                <label className="block text-gray-700 font-medium mb-2">Address:</label>
                <input 
                    type="text" 
                    name="address" 
                    value={profile.address || ""} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" 
                />
                <button 
                    onClick={handleUpdateProfile} 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold mt-4 shadow-md hover:scale-105 transform"
                >
                    {loading ? "Updating..." : "Save Changes"}
                </button>
                <button 
                    onClick={() => setShowEditForm(false)}
                    className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition font-semibold mt-2 shadow-md hover:scale-105 transform"
                >
                    Cancel
                </button>
            </div>
        )}

        {showPasswordForm && (
            <div className="mt-6 p-6 bg-gray-100 rounded-xl shadow-md border border-gray-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h3>
                <label className="block text-gray-700 font-medium mb-2">Old Password:</label>
                <input 
                    type="password" 
                    placeholder="Enter old password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" 
                />
                <label className="block text-gray-700 font-medium mb-2">New Password:</label>
                <input 
                    type="password" 
                    placeholder="Enter new password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" 
                />
                <button 
                    onClick={handleChangePassword} 
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold mt-4 shadow-md hover:scale-105 transform"
                >
                    {loading ? "Changing..." : "Save Password"}
                </button>
                <button 
                    onClick={() => setShowPasswordForm(false)}
                    className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition font-semibold mt-2 shadow-md hover:scale-105 transform"
                >
                    Cancel
                </button>
            </div>
        )}

        {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                    <p className="text-xl font-bold text-gray-900 mb-4">Are you sure you want to delete your account?</p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={handleDeleteAccount}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
                        >
                            Yes, Delete
                        </button>
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
</div>
)};


export default Profile;
