import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

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
    
            console.log(" API Response:", response.data);
    
            if (response.status === 201) {
                toast.success("Inquiry added to FAQ successfully.");
                setFaqForm({ id: null, answer: "" }); 
            } else {
                toast.error(response.data.message || "Failed to add inquiry to FAQ.");
            }
        } catch (error) {
            console.error(" API Error:", error.response?.data || error.message);
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

            alert(response.data.message);

        } catch (error) {
            console.error("Delete Inquiry Error:", error);
            alert(error.response?.data?.message || "Failed to mark inquiry for deletion.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                🛠️ Admin Inquiry Management
            </h2>

            {Object.keys(categorizedInquiries).map((category) => (
                <div key={category} className="mb-8 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">
                        {category} Inquiries 📩
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-left">
                                    <th className="border px-6 py-3">Full Name</th>
                                    <th className="border px-6 py-3">Email</th>
                                    <th className="border px-6 py-3">Contact</th>
                                    <th className="border px-6 py-3">Product</th>
                                    <th className="border px-6 py-3">Inquiry Subject</th>
                                    <th className="border px-6 py-3">Details</th>
                                    <th className="border px-6 py-3">Status</th>
                                    <th className="border px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorizedInquiries[category].length > 0 ? (
                                    categorizedInquiries[category].map((inquiry) => (
                                        <tr key={inquiry._id} className="border hover:bg-gray-100 transition-all">
                                            <td className="border px-6 py-4">{inquiry.fullName}</td>
                                            <td className="border px-6 py-4">{inquiry.email}</td>
                                            <td className="border px-6 py-4">{inquiry.contactNumber}</td>
                                            <td className="border px-6 py-4">{inquiry.productName || "N/A"}</td>
                                            <td className="border px-6 py-4">{inquiry.inquirySubject || "N/A"}</td>
                                            <td className="border px-6 py-4">{inquiry.additionalDetails}</td>
                                            <td className="border px-6 py-4">
                                                {inquiry.status === "Resolved" ? (
                                                    <span className="px-3 py-1 text-yellow-700 rounded-full text-sm font-medium">
                                                        Scheduled for Deletion
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 text-green-700 bg-green-200 rounded-full text-sm font-medium">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border px-6 py-4 flex flex-wrap gap-2">
                                                {inquiry.status !== "Resolved" ? (
                                                    <button
                                                        onClick={() => handleResolveInquiry(inquiry._id)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-blue-300"
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Processing..." : "Resolve"}
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleDeleteInquiry(inquiry._id)}
                                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:bg-red-300"
                                                            disabled={loading}
                                                        >
                                                            {loading ? "Deleting..." : "Delete"}
                                                        </button>
                                                        <button
                                                            onClick={() => setFaqForm({ id: inquiry._id, answer: "" })}
                                                            className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition flex items-center gap-1"
                                                        >
                                                            ➕ Add to FAQ
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
                                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                                                                >
                                                                    ✅ Submit
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
                                        <td colSpan="7" className="text-center text-gray-600 py-6">🚫 No inquiries in this category.</td>
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