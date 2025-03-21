import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FAQ() { 
    const [faqs, setFaqs] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/faq/get-faqs");
            setFaqs(response.data);
        } catch (error) {
            console.error("Error fetching FAQs: ", error);
        }
    };

    const handleFAQClick = async (index, id) => {
        if (openIndex === index) {
            setOpenIndex(null);
            return;
        }

        setOpenIndex(index);

        setFaqs((prevFaqs) =>
            prevFaqs.map((faq) =>
                faq._id === id ? { ...faq, views: faq.views + 1 } : faq
            )
        );

        try {
            await axios.put(`http://localhost:5000/api/faq/increment-views/${id}`);
        } catch (error) {
            console.error("Error updating FAQ views: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white text-gray-800">
            <div className="text-center py-10">
                <h1 className="text-4xl font-bold text-blue-600">Frequently Asked Questions</h1>
                <p className="text-gray-600 mt-2">Find answers to common questions below.</p>
            </div>
            
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200">
                <ul className="space-y-4">
                    {faqs.map((faq, index) => (
                        <li key={faq._id} className="border-b border-gray-300 pb-3">
                            <button
                                onClick={() => handleFAQClick(index, faq._id)}
                                className="w-full flex justify-between items-center font-semibold text-lg text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer"
                            >
                                {faq.question}
                                <span className="text-blue-600 text-xl">{openIndex === index ? "−" : "+"}</span>
                            </button>
                            {openIndex === index && (
                                <p className="mt-2 text-gray-700 bg-gray-100 p-4 rounded-lg transition-all duration-300">
                                    {faq.answer}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Buttons outside the FAQ box */}
            <div className="flex justify-center gap-6 mt-10">
                <button
                    onClick={() => navigate('/InquiryForm')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Can't find your answer? Contact Us
                </button>
                <button
                    onClick={() => navigate('/ReviewForm')}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Add A Review
                </button>
            </div>
        </div>
    );
}

export default FAQ;
