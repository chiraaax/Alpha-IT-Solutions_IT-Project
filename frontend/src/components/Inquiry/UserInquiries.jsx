import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

function UserInquiries() {
    const { user, setUser } = useContext(AuthContext);

    const [inquiries, setInquiries] = useState([]);
    const [editingInquiry, setEditingInquiry] = useState(null);
    const [updatedData, serUpdatedData] = useState({});

    useEffect(() => {
        console.log("User data:", user); 
        if(user){
            fetchInquiries();
        }
    }, [user]);

    const fetchInquiries = async() => {
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/inquiries/my-inquiry", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInquiries(response.data);
        }catch(error){
            console.error("Error fetching inquiries:", error);
        }
    };

    const handleDelete = async (id, createdAt) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this inquiry?");
        if (!isConfirmed) return;

        const createdTime = new Date(createdAt).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - createdTime;

        if (timeDiff > 24 * 60 * 60 * 1000) {
            toast.error("You can only delete an inquiry within 24 hours.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/inquiries/delete-inquiry/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInquiries(inquiries.filter((inquiry) => inquiry._id !== id));
            toast.success("Inquiry deleted successfully");
        } catch (error) {
            console.error("Error deleting inquiry:", error);
        }
    };

    const handleEdit = (inquiry) => {
        setEditingInquiry(inquiry._id);
        serUpdatedData(inquiry);
    };

    const getCountdownTime = (resolvedAt) => {
        if (!resolvedAt) return "No resolution time set";
    
        const deletionTime = new Date(resolvedAt).getTime() + 48 * 60 * 60 * 1000; // 48 hours after resolution
        const now = Date.now();
        const difference = deletionTime - now;
    
        if (difference <= 0) return "Deleting Soon...";
    
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
        return hours > 0 
        ? `Auto-delete in: ${hours}h ${minutes}m ${seconds}s` 
        : `Auto-delete in: ${minutes}m ${seconds}s`;
    };    
    
    const handleUpdateChange = (e) => {
        serUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const createdTime = new Date(updatedData.createdAt).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - createdTime;

        if (timeDiff > 24 * 60 * 60 * 1000) {
            toast.error("You can only update an inquiry within 24 hours.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/inquiries/update-inquiry/${updatedData._id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditingInquiry(null);
            fetchInquiries();
            toast.success("Inquiry updated successfully");
        } catch (error) {
            console.error("Error updating inquiry:", error);
        }
    };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 p-8">

    {/* Inquiry Section */}
    <h2 className="text-4xl font-extrabold text-center text-white mb-4 tracking-wide">
         Your Inquiries
    </h2>
    <p className="text-lg text-center text-white opacity-80 mb-8">
        View and manage your submitted inquiries. You can update, delete, or track the status of each inquiry here.
    </p>
    
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
            {inquiries.length === 0 ? (
                <p className="text-center text-gray-500">No inquiries submitted yet.</p>
            ) : (
                inquiries.map((inquiry) => {
                    return (
                        <div key={inquiry._id} className="border-b border-gray-300 pb-4 mb-4">
                            {editingInquiry === inquiry._id ? (
                                <form onSubmit={handleUpdateSubmit}>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={updatedData.fullName}
                                            onChange={handleUpdateChange}
                                            className="w-full border rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <textarea
                                            name="additionalDetails"
                                            value={updatedData.additionalDetails}
                                            onChange={handleUpdateChange}
                                            className="w-full border rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">
                                            Save Changes
                                        </button>
                                        <button type="button" onClick={() => setEditingInquiry(null)} className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <p><strong className="text-gray-700">Full Name:</strong> {inquiry.fullName}</p>
                                        <p><strong className="text-gray-700">Email:</strong> {inquiry.email}</p>
                                        <p><strong className="text-gray-700">Inquiry Type:</strong> {inquiry.inquiryType}</p>
                                        <p><strong className="text-gray-700">Product Name:</strong> {inquiry.productName}</p>
                                        <p><strong className="text-gray-700">Details:</strong> {inquiry.additionalDetails}</p>
                                        <p><strong className="text-gray-700">Status:</strong> {inquiry.status}</p>
                                        <p className="text-sm text-gray-500">Submitted on: {new Date(inquiry.createdAt).toLocaleString()}</p>
                                        <p className="text-sm text-red-500">Auto-delete in: {getCountdownTime(inquiry.createdAt)}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(inquiry)} className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600">
                                            Update
                                        </button>
                                        <button onClick={() => handleDelete(inquiry._id, inquiry.createdAt)} className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600">
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })
            )}
      </div>
    </div>
  );
}

export default UserInquiries;
