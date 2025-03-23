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
            //Verify User Details Before Submitting Review
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
                //Proceed with review submission
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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white p-8 flex flex-col items-center">
        <div className="max-w-5xl w-full">
        {/* Reviews Section */}
        <h2 className="text-5xl font-extrabold text-center mb-4 text-blue-400 animate-pulse">Customer Reviews</h2>
        <p className="text-lg text-center text-gray-300 mb-8">Read what our valued customers have to say about us.</p>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center">No approved reviews yet. Be the first to leave your feedback!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="relative group p-6 bg-gray-800 bg-opacity-60 shadow-lg rounded-lg text-center border border-gray-700 hover:scale-105 transition-transform">
                <div className="absolute top-2 right-2 text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Verified</div>
                <p className="font-bold text-xl text-blue-300">{review.fullName}</p>
                <p className="text-gray-400 text-sm">{review.email}</p>
                <p className="text-lg font-semibold mt-2 text-gray-200">{review.reviewTitle}</p>
                <p className="text-gray-300 mt-2 italic">"{review.comment}"</p>
                <p className="text-yellow-500 text-lg mt-2">{"⭐".repeat(review.rating)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        <h3 className="text-3xl font-bold mt-12 text-center text-blue-400">Leave a Review</h3>
        <p className="text-center text-gray-300 mb-6">Your feedback helps us improve. Share your experience with us!</p>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 shadow-xl rounded-lg border border-gray-700 backdrop-blur-lg">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold">Full Name:</label>
              <input type="text" name="fullName" value={fullName} onChange={handleChange} required
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:ring focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-gray-300 font-semibold">Email Address:</label>
              <input type="email" name="email" value={email} onChange={handleChange} required
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:ring focus:ring-blue-500 focus:outline-none"/>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-300 font-semibold">Review Title:</label>
            <input type="text" name="reviewTitle" value={reviewTitle} onChange={handleChange} required
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:ring focus:ring-blue-500 focus:outline-none"/>
          </div>
          <div className="mt-4">
            <label className="block text-gray-300 font-semibold">Comment:</label>
            <textarea name="comment" value={comment} onChange={handleChange} required
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:ring focus:ring-blue-500 focus:outline-none"></textarea>
          </div>
          <div className="mt-4">
            <label className="block text-gray-300 font-semibold">Rating:</label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <span key={num} onClick={() => handleRatingClick(num)}
                  className={`cursor-pointer text-3xl transition-transform transform hover:scale-125 ${num <= rating ? "text-yellow-500" : "text-gray-500"}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 mt-6 rounded-md hover:from-purple-600 hover:to-blue-500 transition text-lg font-semibold">
            Submit Review
          </button>
        </form>
      </div>
    </div>

)};

export default ReviewForm;
