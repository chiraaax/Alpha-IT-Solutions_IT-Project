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

    const fetchInquiries = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No auth token available");
                return;
            }
    
            console.log("Fetching user inquiries...");
            
            const response = await axios.get(
                "http://localhost:5000/api/inquiries/my-inquiry", 
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 10000 // 10 second timeout
                }
            );
    
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error("Invalid response format");
            }
    
            console.log(`Received ${response.data.length} inquiries`);
            setInquiries(response.data);
    
        } catch (error) {
            console.error("Inquiry Fetch Error:", {
                config: error.config,
                response: error.response,
                message: error.message
            });
    
            if (error.code === 'ECONNABORTED') {
                toast.error("Request timed out. Please check your connection.");
            } 
            else if (error.response?.status === 503) {
                toast.error("Server busy. Please try again shortly.");
            }
            else if (error.message.includes("Invalid response")) {
                toast.error("Data format error. Contact support.");
            }
            else {
                toast.error("Failed to load inquiries. Please refresh.");
            }
            
            // Set empty array on error to prevent UI issues
            setInquiries([]); 
        }
    };

    const handleDelete = async (id, createdAt) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this inquiry?");
        if (!isConfirmed) return;

        try {
            // Frontend time validation (duplicates backend check for UX)
            const createdTime = new Date(createdAt).getTime();
            const currentTime = Date.now();
            const hoursDiff = (currentTime - createdTime) / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                toast.error(`This inquiry is ${Math.round(hoursDiff)} hours old. Deletion is only allowed within 24 hours.`);
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required. Please log in again.");
                return;
            }

            setInquiries(prev => prev.filter(inquiry => inquiry._id !== id));

            console.log(`Attempting to delete inquiry: ${id}`);
            const response = await axios.delete(
                `http://localhost:5000/api/inquiries/delete-inquiry/${id}`,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 10000 // 10 second timeout
                }
            );

            // Verify successful deletion
            toast.success("Deletion confirmed!");
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
    
        try {
            // Frontend time validation (duplicates backend check for UX)
            const hoursSinceCreation = (Date.now() - new Date(updatedData.createdAt)) / (1000 * 60 * 60);
            if (hoursSinceCreation > 24) {
                toast.error(`This inquiry is ${Math.round(hoursSinceCreation)} hours old. Updates are only allowed within 24 hours.`);
                return;
            }
    
            // Input validation
            if (!updatedData.inquirySubject || !updatedData.additionalDetails) {
                toast.error("Please provide both subject and details");
                return;
            }
    
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required. Please log in again.");
                return;
            }
    
            console.log("🔄 Attempting inquiry update", { 
                inquiryId: updatedData._id,
                updateData: updatedData 
            });

            setInquiries(prev => prev.map(inquiry => 
                inquiry._id === updatedData._id ? { ...inquiry, ...updatedData } : inquiry
            ));
    
            const response = await axios.put(
                `http://localhost:5000/api/inquiries/update-inquiry/${updatedData._id}`,
                updatedData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                }
            );
    
            // Verify successful update
            if (response.data?.updatedInquiry) {
                setInquiries(prev => prev.map(inquiry => 
                    inquiry._id === updatedData._id ? response.data.updatedInquiry : inquiry
                ));
                toast.success("Update confirmed!");
            }
            setEditingInquiry(null);
    
        } catch (error) {
            console.error("Error updating inquiry:", error);
        }
    };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-8">

    {/* Inquiry Section */}
    <h2 className="text-4xl font-extrabold text-center text-blue-400 mb-4 tracking-wide">
         My Inquiries
    </h2>
    <p className="text-lg text-center text-gray-300 opacity-80 mb-8">
        View and manage your submitted inquiries. You can update, delete, or track the status of each inquiry here.
    </p>
    
      <div className="bg-gray-800 shadow-xl rounded-lg p-6 max-w-4xl mx-auto border border-gray-700">
            {inquiries.length === 0 ? (
                <p className="text-center text-gray-400">No inquiries submitted yet.</p>
            ) : (
                inquiries.map((inquiry) => {
                    return (
                        <div key={inquiry._id} className="border-b border-gray-700 pb-4 mb-4">
                            {editingInquiry === inquiry._id ? (
                                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={updatedData.fullName}
                                        onChange={handleUpdateChange}
                                        className="w-full border border-gray-600 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="inquirySubject"
                                        value={updatedData.inquirySubject}
                                        onChange={handleUpdateChange}
                                        className="w-full border border-gray-600 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-blue-500"
                                    />
                                    <textarea
                                        name="additionalDetails"
                                        value={updatedData.additionalDetails}
                                        onChange={handleUpdateChange}
                                        className="w-full border border-gray-600 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-blue-500"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 hover:shadow-lg transition duration-300">
                                            Save Changes
                                        </button>
                                        <button type="button" onClick={() => setEditingInquiry(null)} className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 hover:shadow-lg transition duration-300">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="mb-4 text-gray-300">
                                        <p><strong className="text-blue-400">Full Name:</strong> {inquiry.fullName}</p>
                                        <p><strong className="text-blue-400">Email:</strong> {inquiry.email}</p>
                                        <p><strong className="text-blue-400">Inquiry Type:</strong> {inquiry.inquiryType}</p>
                                        <p><strong className="text-blue-400">Product Name:</strong> {inquiry.productName}</p>
                                        <p><strong className="text-blue-400">Inquiry Subject:</strong> {inquiry.inquirySubject}</p>
                                        <p><strong className="text-blue-400">Details:</strong> {inquiry.additionalDetails}</p>
                                        <p><strong className="text-blue-400">Status:</strong> {inquiry.status}</p>
                                        <p className="text-sm text-gray-400">Submitted on: {new Date(inquiry.createdAt).toLocaleString()}</p>
                                        <p className="text-sm text-red-500">Auto-delete in: {getCountdownTime(inquiry.createdAt)}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(inquiry)} className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 hover:shadow-lg transition duration-300">
                                            Update
                                        </button>
                                        <button onClick={() => handleDelete(inquiry._id, inquiry.createdAt)} className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 hover:shadow-lg transition duration-300">
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
