import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { toast } from "react-toastify";
import 'jspdf-autotable';

const InquiryForm = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        contactNumber: user?.contactNumber || '',
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

    useEffect(() => {
        if(user){
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || '',
                contactNumber: user.contactNumber || ''
            }));
        }
    }, [user]);

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
        console.log("[DEBUG] Form submission initiated");
        console.log("[AUTH] Current token:", localStorage.getItem("token")); // Explicit token logging

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
            console.log("[AUTH] User not logged in or token missing");
            toast.error('You must be logged in to submit an inquiry.');
            return;
        }

        try {
            // Create FormData for the inquiry submission
            const formDataToSend = new FormData();
                
            // Append all fields explicitly
            formDataToSend.append('fullName', formData.fullName.trim());
            formDataToSend.append('email', formData.email.trim());
            formDataToSend.append('contactNumber', formData.contactNumber);
            formDataToSend.append('inquiryType', formData.inquiryType);
            formDataToSend.append('productName', formData.productName || '');
            formDataToSend.append('additionalDetails', formData.additionalDetails);
            formDataToSend.append('userApproval', formData.userApproval.toString()); // Convert boolean to string
            formDataToSend.append('inquirySubject', formData.inquirySubject);
                
            // Append file if exists
            if (formData.attachment) {
                formDataToSend.append('attachment', formData.attachment);
            }

            // Debug: Log FormData contents (for development only)
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }
    
            // Submit the Inquiry
            console.log("[NETWORK] Sending request to backend...");
            const response = await axios.post(
                "http://localhost:5000/api/inquiries/submit", 
                formDataToSend, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 15000
                }
            );
    
            console.log("[API] Success response:", response.data);
            toast.success(response.data.message);
            setSubmittedData(response.data.inquiry);

            // Reset form
            setFormData(prev => ({
                ...prev,
                inquiryType: 'General',
                productName: '',
                additionalDetails: '',
                userApproval: false,
                attachment: null,
                inquirySubject: '',
            }));
        
        } catch (error) {
            console.error("Full error details:", {
                config: error.config,
                response: error.response,
                request: error.request,
                message: error.message
            });
    
            if (error.response?.data?.message?.includes("already exists")) {
                toast.error("Duplicate inquiry detected. Please check your previous submissions.");
            } 
            else if (error.code === 'ECONNABORTED') {
                toast.error("Server timeout. Please try again.");
            }
            else if (error.response?.status === 400) {
                toast.error(`Validation error: ${error.response.data.message}`);
            }
            else {
                toast.error("Submission failed. Please try again later.");
            }
        }
    
    };

    const handleDownloadInquiry = async () => {
        if (!submittedData || !submittedData._id) {
            toast.error("No inquiry data available for download.");
            return;
        }

        try {
            console.log(`⬇️ Attempting download for inquiry: ${submittedData._id}`);

            const response = await axios.get(`http://localhost:5000/api/inquiries/download/${submittedData._id}`,{
                responseType: "blob",
                timeout: 15000, // 15 second timeout
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Verify blob data
            if (!response.data || response.data.size === 0) {
                throw new Error("Received empty PDF data");
            }

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Inquiry-${submittedData._id}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success("Your inquiry PDF has been downloaded!");
        } catch (error) {
            console.error("Download Error:", {
                config: error.config,
                response: error.response,
                message: error.message
            });
    
            if (error.code === 'ECONNABORTED') {
                toast.error("Download timed out. Please try again.");
            } 
            else if (error.response?.status === 404) {
                toast.error("Inquiry not found. It may have been deleted.");
            }
            else if (error.message.includes("empty PDF")) {
                toast.error("Failed to generate PDF. Please try again.");
            }
            else {
                toast.error("Download failed. Please try again later.");
            }
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

                <input type="text" name="productName" placeholder="Product Name (if applicable)" value={formData.productName} onChange={handleChange} className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500" />

                <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500">
                    <option value="General">General</option>
                    <option value="Product Availability">Product Availability</option>
                    <option value="Support">Support</option>
                </select>

                <input type="text" name="inquirySubject" placeholder="Subject" value={formData.inquirySubject} onChange={handleChange} required className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-gray-200 focus:ring focus:ring-pink-500" />

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
