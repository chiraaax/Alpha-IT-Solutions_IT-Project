import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { toast } from "react-toastify";
import 'jspdf-autotable';

const InquiryForm = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        inquiryType: 'General',
        productName: '',
        additionalDetails: '',
        userApproval: false,
        attachment: null,
        inquirySubject: '',
    });

    const [submittedData, setSubmittedData] = useState(null);
    const [query, setQuery] = useState("");
    const [suggestedFAQs, setSuggestedFAQs] = useState([]);

    const fetchSimilarFAQs = async (input) => {
        if (!input) {
            setSuggestedFAQs([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/faq/similar?query=${input}`);
            setSuggestedFAQs(response.data);
        } catch (error) {
            console.error("Error fetching similar FAQs:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
        fetchSimilarFAQs(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Only .png, .jpg, and .jpeg files are allowed.");
                return;
            }
            setFormData(prevState => ({
                ...prevState,
                attachment: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Trim spaces and normalize input before validation
        const trimmedFullName = formData.fullName.trim();
        const trimmedEmail = formData.email.trim();

        if (!trimmedFullName) {
            toast.error('Full Name is required.');
            return;
        }

        if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
            toast.error('Please enter a valid email.');
            return;
        }

        if (!formData.contactNumber.trim() || !/^\d{10}$/.test(formData.contactNumber)) {
            toast.error('Please enter a valid 10-digit contact number.');
            return;
        }

        const token = localStorage.getItem("token");
        if (!user || !token) {
            toast.error('You must be logged in to submit an inquiry.');
            return;
        }

        try {
            // Step 1: Verify Name and Email
            const verificationResponse = await axios.post(
                'http://localhost:5000/api/profile/verify-details',
                { name: formData.fullName, email: formData.email, contactNumber: formData.contactNumber },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
    
            if (verificationResponse.status === 200) {
                // Proceed with inquiry submission
                const submissionData = new FormData();
                Object.keys(formData).forEach(key => {
                    if (key === "attachment" && formData.attachment) {
                        submissionData.append("attachment", formData.attachment);
                    } else {
                        submissionData.append(key, formData[key]);
                    }
                });
    
                // Submit the Inquiry
                const response = await axios.post("http://localhost:5000/api/inquiries/submit", submissionData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                toast.success(response.data.message);
    
                setSubmittedData(response.data.inquiry);
    
                setFormData({
                    fullName: '',
                    email: '',
                    contactNumber: '',
                    inquiryType: 'General',
                    productName: '',
                    additionalDetails: '',
                    userApproval: false,
                    attachment: null,
                    inquirySubject: '',
                });
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDownloadInquiry = async () => {
        if (!submittedData || !submittedData._id) {
            toast.error("No inquiry data available for download.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/inquiries/download/${submittedData._id}`, {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Inquiry-${submittedData._id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success("Your inquiry PDF has been downloaded!");
        } catch (error) {
            toast.error("Error downloading PDF. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-gray-900 to-black p-6">
        {/* FAQ Search Section */}
        <div className="w-full max-w-xl bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-xl p-6 mb-6 border border-gray-700">
            <h3 className="text-2xl font-semibold text-purple-400 flex items-center gap-2">
                🔍 Check Before Submitting an Inquiry
            </h3>
            <p className="text-gray-1000 mb-3">Check if your question is already answered in our FAQ section.</p>
            <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Type your inquiry..."
                className="w-full border border-gray-700 rounded-lg px-4 py-2 focus:ring focus:ring-purple-500 bg-gray-900 text-gray-200"
            />
            {suggestedFAQs.length > 0 && (
                <ul className="bg-gray-800 p-2 mt-3 rounded-md border border-gray-700 text-gray-300">
                    {suggestedFAQs.map((faq) => (
                        <li key={faq._id} className="p-2 border-b border-gray-700 last:border-b-0">
                            <strong className="text-purple-400">{faq.question}</strong>
                            <p className="text-gray-400 mt-1">{faq.answer}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        {/* Inquiry Form Section */}
        <div className="w-full max-w-xl bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-gray-700">
            <h2 className="text-3xl font-bold text-pink-400 mb-4 flex items-center gap-2">
                ✉️ Submit an Inquiry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500" />

                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500" />

                <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500" />

                <input type="text" name="productName" placeholder="Product Name (if applicable)" value={formData.productName} onChange={handleChange} required className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500" />

                <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500">
                    <option value="General">General</option>
                    <option value="Product Availability">Product Availability</option>
                    <option value="Support">Support</option>
                </select>

                <input type="text" name="productName" placeholder="Subject" value={formData.inquirySubject} onChange={handleChange} required className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500" />

                <textarea name="additionalDetails" placeholder="Additional Details" value={formData.additionalDetails} onChange={handleChange} required className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500"></textarea>

                <label className="flex items-center text-gray-1000">
                    <input type="checkbox" name="userApproval" checked={formData.userApproval} onChange={handleChange} className="mr-2" />
                    Allow this inquiry to be added to the FAQ
                </label>

                <input type="file" name="attachment" accept=".png,.jpg,.jpeg" onChange={handleFileChange} className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-300 focus:ring focus:ring-pink-500" />

                <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 hover:shadow-lg transition duration-300 transform hover:scale-105">
                    🚀 Submit Inquiry
                </button>
            </form>

            {submittedData && submittedData._id && (
                <button 
                    onClick={handleDownloadInquiry} 
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300 transform hover:scale-105 mt-3"
                >
                    📄 Download Inquiry PDF
                </button>
            )}
        </div>
    </div>

)};

export default InquiryForm;
