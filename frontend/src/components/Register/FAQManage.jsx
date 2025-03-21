import React, { useState, useEffect } from "react";
import axios from "axios";

const FAQManage = () => {
    const [faqs, setFaqs] = useState([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        fetchFAQs();
    }, []);

    // Fetch FAQs
    const fetchFAQs = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/faq/get-faqs");
            setFaqs(response.data);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    // Handle Add FAQ
    const handleAddFaq = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/faq/add-faqs", { question, answer });
            resetForm();
            fetchFAQs();
        } catch (error) {
            console.error("Error adding FAQ:", error);
        }
    };

    // Handle Update FAQ
    const handleUpdateFaq = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/faq/update-faq/${selectedFaq._id}`, { question, answer });
            resetForm();
            fetchFAQs();
        } catch (error) {
            console.error("Error updating FAQ:", error);
        }
    };

    // Handle Delete FAQ
    const handleDeleteFaq = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/faq/delete-faq/${id}`);
            fetchFAQs();
        } catch (error) {
            console.error("Error deleting FAQ:", error);
        }
    };

    // Handle Update Click
    const openUpdateModal = (faq) => {
        setSelectedFaq(faq);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setShowUpdateModal(true);
    };

    // Reset form & close modals
    const resetForm = () => {
        setSelectedFaq(null);
        setQuestion("");
        setAnswer("");
        setShowAddModal(false);
        setShowUpdateModal(false);
    };

    return (
        <div>
            <AdminNav/>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">FAQ Management</h2>

            {/* Add FAQ Button */}
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
                Add FAQ
            </button>

            {/* FAQ Table */}
            <div className="mt-6">
                <table className="w-full border-collapse border border-gray-300 shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Question</th>
                            <th className="border border-gray-300 px-4 py-2">Answer</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faqs.map((faq) => (
                            <tr key={faq._id} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{faq.question}</td>
                                <td className="border border-gray-300 px-4 py-2">{faq.answer}</td>
                                <td className="border border-gray-300 px-4 py-2 flex justify-center gap-2">
                                    <button 
                                        onClick={() => openUpdateModal(faq)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
                                    >
                                        Update
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteFaq(faq._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add FAQ Modal */}
            {showAddModal && (
                <div className= "fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Add FAQ</h3>
                        <form onSubmit={handleAddFaq}>
                            <input 
                                type="text" 
                                placeholder="Question" 
                                value={question} 
                                onChange={(e) => setQuestion(e.target.value)} 
                                required
                                className="w-full p-2 border border-gray-300 rounded-md mb-3"
                            />
                            <textarea 
                                placeholder="Answer" 
                                value={answer} 
                                onChange={(e) => setAnswer(e.target.value)} 
                                required
                                className="w-full p-2 border border-gray-300 rounded-md mb-3"
                            />
                            <div className="flex gap-2">
                                <button 
                                    type="submit" 
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                                >
                                    Add FAQ
                                </button>
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update FAQ Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Update FAQ</h3>
                        <form onSubmit={handleUpdateFaq}>
                            <input 
                                type="text" 
                                placeholder="Question" 
                                value={question} 
                                onChange={(e) => setQuestion(e.target.value)} 
                                required
                                className="w-full p-2 border border-gray-300 rounded-md mb-3"
                            />
                            <textarea 
                                placeholder="Answer" 
                                value={answer} 
                                onChange={(e) => setAnswer(e.target.value)} 
                                required
                                className="w-full p-2 border border-gray-300 rounded-md mb-3"
                            />
                            <div className="flex gap-2">
                                <button 
                                    type="submit" 
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                                >
                                    Update FAQ
                                </button>
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
            
        </div>
    );
};

export default FAQManage;