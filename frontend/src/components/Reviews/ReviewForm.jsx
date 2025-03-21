import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

function ReviewForm() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        rating: 0,
        comment: '',
        reviewTitle: ''
    });
    const { fullName, email, rating, comment, reviewTitle } = formData;
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchApprovedReviews();
    }, []);

    const fetchApprovedReviews = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/reviews/approved");
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching approved reviews:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.fullName.trim()){
            toast.error('Full Name is required.');
            return;
        }

        if(!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)){
            toast.error('Please enter a valid email.');
            return;
        }

        const token = localStorage.getItem("token");
        if (!user || !token) {
            toast.error("You must be logged in to submit a review.");
            return;
        }

        try {
            // Step 1: Verify User Details Before Submitting Review
            const verificationResponse = await axios.post(
                'http://localhost:5000/api/profile/verify-details-review',
                {
                    name: formData.fullName,
                    email: formData.email,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            if (verificationResponse.status === 200) {
                // Step 2: Proceed with review submission
                const response = await axios.post(
                    "http://localhost:5000/api/reviews/submit",
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                toast.success(response.data.message);
                setFormData({ fullName: '', email: '', contactNumber: '', rating: 0, comment: '', reviewTitle: '' });

                fetchApprovedReviews();
            }

        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.response?.data?.message || "Failed to submit review.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingClick = (value) => {
        setFormData(prev => ({ ...prev, rating: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100 flex flex-col items-center p-6">
            <div className="max-w-5xl w-full">
                <h2 className="text-4xl font-extrabold text-center mb-2 text-blue-900">Customer Reviews</h2>
                <p className="text-lg text-center text-gray-700 mb-6">Read what our valued customers have to say about us.</p>
                
                {reviews.length === 0 ? (
                    <p className="text-gray-600 text-center">No approved reviews yet. Be the first to leave your feedback!</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="p-5 bg-white shadow-lg rounded-lg text-center border border-gray-200">
                                <p className="font-bold text-xl text-blue-800">{review.fullName}</p>
                                <p className="text-gray-500 text-sm">{review.email}</p>
                                <p className="text-lg font-semibold mt-2 text-gray-900">{review.reviewTitle}</p>
                                <p className="text-gray-700 mt-2 italic">"{review.comment}"</p>
                                <p className="text-yellow-500 text-lg mt-2">{"⭐".repeat(review.rating)}</p>
                            </div>
                        ))}
                    </div>
                )}

                <h3 className="text-3xl font-bold mt-12 text-center text-blue-900">Leave a Review</h3>
                <p className="text-center text-gray-700 mb-6">Your feedback helps us improve. Share your experience with us!</p>
                <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold">Full Name:</label>
                            <input type="text" name="fullName" value={fullName} onChange={handleChange} required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"/>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Email Address:</label>
                            <input type="email" name="email" value={email} onChange={handleChange} required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 font-semibold">Review Title:</label>
                        <input type="text" name="reviewTitle" value={reviewTitle} onChange={handleChange} required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"/>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 font-semibold">Comment:</label>
                        <textarea name="comment" value={comment} onChange={handleChange} required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"></textarea>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 font-semibold">Rating:</label>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span key={num} onClick={() => handleRatingClick(num)}
                                    className={`cursor-pointer text-3xl ${num <= rating ? "text-yellow-500" : "text-gray-300"}`}>
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 mt-6 rounded-md hover:bg-blue-600 transition text-lg font-semibold">
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ReviewForm;
