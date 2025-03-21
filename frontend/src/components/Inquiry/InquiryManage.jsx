import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function InquiryManage() {
    const [inquiries, setInquiries] = useState([]);
    const [categorizedInquiries, setCategorizedInquiries] = useState({
        General: [],
        ProductAvailability: [],
        Support: [],
    });
    const [loading, setLoading] = useState(false);
    const [faqForm, setFaqForm] = useState({ id: null, answer: "" });

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("http://localhost:5000/api/inquiries/all-inquiries", {
                headers: { Authorization:   `Bearer ${token}` }
            });

            setInquiries(data.inquiries);
            setCategorizedInquiries(data.categorizedInquiries);
        } catch (error) {
            console.error("Fetch error:", error.response?.data || error.message);
            toast.error("Failed to fetch inquiries.");
        }
    };

    const handleResolveInquiry = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.put(
                (`http://localhost:5000/api/inquiries/resolve/${id}`),
                { status: "Resolved" }, // Updating the status
                { headers: { Authorization:  `Bearer ${token}`  } }
            );
            console.log("Resolve Inquiry Response:", response.data);

            setInquiries(inquiries.map(inquiry => 
                inquiry._id === id ? { ...inquiry, status: "Resolved", resolvedAt: new Date() } : inquiry
            ));
            
        } catch (error) {
            console.error("Resolve error:", error.response?.data || error.message);
            toast.error("Failed to resolve inquiry.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToFAQ = async (id, userApproval) => {
        if (!userApproval) {
            toast.warning("User approval is required to add this inquiry to FAQ.");
            return;
        }

        if (!faqForm.answer.trim()) {
            toast.error("Please enter an answer before submitting.");
            return;
        }
    
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
    
            const response = await axios.post(
                (`http://localhost:5000/api/inquiries/add-to-faq/${id}`),  // ✅ Send ID as URL param
                { userApproval: true, answer: faqForm.answer },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("📢 API Response:", response.data);
    
            if (response.status === 201) {
                toast.success("Inquiry added to FAQ successfully.");
                setFaqForm({ id: null, answer: "" }); 
            } else {
                toast.error(response.data.message || "Failed to add inquiry to FAQ.");
            }
        } catch (error) {
            console.error("❌ API Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to add inquiry to FAQ.");
        } finally {
            setLoading(false);
        }
    };    

    const handleDeleteInquiry = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:5000/api/inquiries/delete-resolved/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setInquiries(inquiries.filter(inquiry => inquiry._id !== id));

            toast.success(response.data.message);

        } catch (error) {
            console.error("Delete Inquiry Error:", error);
            toast.error(error.response?.data?.message ||"Failed to mark inquiry for deletion.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Inquiry Management</h2>

            {Object.keys(categorizedInquiries).map((category) => (
                <div key={category} className="mb-8 p-4 bg-white shadow-md rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700">{category} Inquiries</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="border px-6 py-3 text-left">Full Name</th>
                                    <th className="border px-6 py-3 text-left">Email</th>
                                    <th className="border px-6 py-3 text-left">Contact Number</th>
                                    <th className="border px-6 py-3 text-left">Product Name</th>
                                    <th className="border px-6 py-3 text-left">Details</th>
                                    <th className="border px-6 py-3 text-left">Status</th>
                                    <th className="border px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorizedInquiries[category].length > 0 ? (
                                    categorizedInquiries[category].map((inquiry) => (
                                        <tr key={inquiry._id} className="border hover:bg-gray-100">
                                            <td className="border px-6 py-3">{inquiry.fullName}</td>
                                            <td className="border px-6 py-3">{inquiry.email}</td>
                                            <td className="border px-6 py-3">{inquiry.contactNumber}</td>
                                            <td className="border px-6 py-3">{inquiry.productName || "N/A"}</td>
                                            <td className="border px-6 py-3">{inquiry.additionalDetails}</td>
                                            <td className="border px-6 py-3">
                                                {inquiry.status === "Resolved" ? (
                                                    <span className="text-yellow-600 font-medium">Scheduled for Deletion</span>
                                                ) : (
                                                    <span className="text-green-600 font-medium">Pending</span>
                                                )}
                                            </td>
                                            <td className="border px-6 py-3 flex flex-wrap gap-2">
                                                {inquiry.status !== "Resolved" ? (
                                                    <button
                                                        onClick={() => handleResolveInquiry(inquiry._id)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Processing..." : "Resolve"}
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleDeleteInquiry(inquiry._id)}
                                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300"
                                                            disabled={loading}
                                                        >
                                                            {loading ? "Deleting..." : "Delete"}
                                                        </button>
                                                        <button
                                                            onClick={() => setFaqForm({ id: inquiry._id, answer: "" })}
                                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                        >
                                                            Add to FAQ
                                                        </button>
                                                        {faqForm.id === inquiry._id && (
                                                            <div className="mt-2 flex flex-wrap gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter answer"
                                                                    value={faqForm.answer}
                                                                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                                                                    className="border p-2 rounded-lg w-full md:w-auto"
                                                                />
                                                                <button
                                                                    onClick={() => handleAddToFAQ(inquiry._id, faqForm.answer)}
                                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                                >
                                                                    Submit
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-gray-600 py-6">No inquiries in this category.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
  )
}

export default InquiryManage