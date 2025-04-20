import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

function ReviewForm() {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        rating: 0,
        comment: '',
        reviewTitle: ''
    });
    const { fullName, email, rating, comment, reviewTitle } = formData;
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchApprovedReviews();
        // Set user details when component mounts or user changes
        if (user) {
          setFormData(prev => ({
              ...prev,
              fullName: user.name || '',
              email: user.email || ''
          }));
        }
    }, [user]);

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
      console.log("[DEBUG] Form submission initiated");
      console.log("[AUTH] Current token:", localStorage.getItem("token")); // Explicit token logging
  
      // Validate form fields
      if (!formData.comment.trim()) {
          console.log("[VALIDATION] Comment missing");
          toast.error('Comment is required.');
          return;
      }
  
      if (!formData.reviewTitle.trim()) {
          console.log("[VALIDATION] Review title missing");
          toast.error('Review title is required.');
          return;
      }
  
      if (formData.rating === 0) {
          console.log("[VALIDATION] Rating not selected");
          toast.error('Please select a rating.');
          return;
      }
  
      // Check authentication
      const token = localStorage.getItem("token");
      if (!user || !token) {
          console.log("[AUTH] User not logged in or token missing");
          toast.error("You must be logged in to submit a review.");
          return;
      }
  
      try {
          console.log("[API] Preparing request payload:", {
              rating: formData.rating,
              comment: formData.comment.substring(0, 20) + "...", // Preview first 20 chars
              reviewTitle: formData.reviewTitle,
              fullName: formData.fullName,
              email: formData.email.substring(0, 3) + "..." // Partial email for security
          });
  
          console.log("[NETWORK] Sending request to backend...");
          const response = await axios.post(
              "http://localhost:5000/api/reviews/submit",
              formData,
              {
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  },
                  timeout: 10000 // 5 second timeout
              }
          );
  
          console.log("[API] Success response:", response.data);
          toast.success(response.data.message);
  
          // Reset form while preserving user details
          setFormData(prev => ({
              ...prev,
              rating: 0,
              comment: '',
              reviewTitle: ''
          }));
  
          // Refresh reviews list
          fetchApprovedReviews();
  
      } catch (error) {
          console.error("[API] Full error details:", {
              config: error.config,
              response: error.response,
              request: error.request,
              message: error.message,
              stack: error.stack
          });
  
          // Enhanced error handling
          if (error.code === 'ECONNABORTED') {
              toast.error("Request timeout - please try again");
          } else if (error.response) {
              // Server responded with error status
              const errorMessage = error.response.data?.message || 
                                 error.response.statusText || 
                                 "Failed to submit review";
              console.error(`[API] Server error (${error.response.status}):`, errorMessage);
              toast.error(errorMessage);
              
              // Special handling for 401/403 errors
              if ([401, 403].includes(error.response.status)) {
                  console.log("[AUTH] Invalid token detected");
                  // Optionally redirect to login or refresh token
              }
          } else if (error.request) {
              // Request was made but no response
              console.error("[NETWORK] No response received:", error.request);
              toast.error("Network error: Could not connect to server");
          } else {
              // Other errors
              console.error("[APP] Unexpected error:", error.message);
              toast.error("Application error: " + error.message);
          }
      } finally {
          console.log("[DEBUG] Form submission process completed");
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
              <input type="text" name="fullName" value={fullName} onChange={handleChange} readOnly
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 cursor-not-allowed"/>
            </div>
            <div>
              <label className="block text-gray-300 font-semibold">Email Address:</label>
              <input type="email" name="email" value={email} onChange={handleChange} readOnly
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 cursor-not-allowed"/>
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
