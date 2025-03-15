import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
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
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome, {user?.name}!
            </h2>

            {!showEditForm && !showPasswordForm && (
                <>
                    <div className="mb-4">
                        <p className="text-gray-600"><strong>Name:</strong> {user?.name}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {user?.email}</p>
                        <p className="text-gray-600"><strong>Contact Number:</strong> {user?.contactNumber}</p>
                        <p className="text-gray-600"><strong>Address:</strong> {user?.address}</p>
                    </div>

                    <button
                        onClick={() => setShowEditForm(true)}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mb-2"
                    >
                        Edit Profile
                    </button>

                    <button
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mb-2"
                    >
                        Change Password
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Delete Account
                    </button>
                </>
            )}

            {showEditForm && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Edit Profile</h3>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email || ""}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Contact Number:</label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={profile.contactNumber || ""}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={profile.address || ""}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mb-2"
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>

                    <button
                        onClick={() => setShowEditForm(false)}
                        className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {showPasswordForm && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Change Password</h3>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Old Password:</label>
                        <input
                            type="password"
                            placeholder="Enter old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-semibold mb-1">New Password:</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mb-2"
                    >
                        {loading ? "Changing..." : "Save Password"}
                    </button>

                    <button
                        onClick={() => setShowPasswordForm(false)}
                        className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-lg font-bold mb-4">Are you sure you want to delete your account?</p>
                        <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2">Yes, Delete</button>
                        <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
