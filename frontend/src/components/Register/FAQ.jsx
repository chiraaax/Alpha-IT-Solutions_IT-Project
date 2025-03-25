import axios from 'axios';
import React, { useEffect, useState } from 'react'

function FAQ() { 
    const [faqs, setFaqs] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

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
            setOpenIndex(null); // Close the answer
            return;
        }

        setOpenIndex(index); // Open the selected FAQ

        // Update view count locally without re-fetching data
        setFaqs((prevFaqs) =>
            prevFaqs.map((faq) =>
                faq._id === id ? { ...faq, views: faq.views + 1 } : faq
            )
        );

        // Send API request to update views count
        try {
            await axios.put(`http://localhost:5000/api/faq/increment-views/${id}`);
        } catch (error) {
            console.error("Error updating FAQ views: ", error);
        }
    };

  return (
    <div>
        <div className="max-w-3xl mx-auto my-10 p-6 bg-gray-900 text-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-cyan-400">Need Help? Find Answers Below</h1>
        <ul className="space-y-4">
            {faqs.map((faq, index) => (
                <li key={faq._id} className="border-b border-gray-700 pb-3">
                    <button
                        onClick={() => handleFAQClick(index, faq._id)}
                        className="w-full flex justify-between items-center font-semibold text-lg text-gray-300 hover:text-cyan-300 transition duration-300 cursor-pointer"
                    >
                        {faq.question}
                        <span className="text-cyan-400 text-xl">{openIndex === index ? "−" : "+"}</span>
                    </button>
                    {openIndex === index && (
                        <p className="mt-2 text-gray-200 bg-gray-800 p-4 rounded-lg transition-all duration-300">
                            {faq.answer}
                        </p>
                    )}
                </li>
            ))}
        </ul>
    </div>

    </div>
  )
}

export default FAQ
