import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

function UserReviews() {
    const { user, setUser } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [editReview, setEditReview] = useState(null);
    const [updatedComment, setUpdatedComment] = useState("");
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedRating, setUpdatedRating] = useState(0);
    const [message, setMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    useEffect(() => {
        const fetchUserReviews = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              console.error("No authentication token found");
              return;
            }
      
            console.log("Fetching user reviews...");
            
            const response = await axios.get(
              "http://localhost:5000/api/reviews/user-review", 
              {
                headers: { 
                  Authorization: `Bearer ${token}`,
                },
                timeout: 10000 // 10 second timeout
              }
            );
      
            if (!Array.isArray(response.data)) {
              throw new Error("Invalid response format");
            }
      
            console.log(`Received ${response.data.length} reviews`);
            setReviews(response.data);
      
          } catch (error) {
            console.error("Review Fetch Error:", {
              config: error.config,
              response: error.response,
              message: error.message
            });
      
            if (error.code === 'ECONNABORTED') {
              toast.error("Request timed out. Please check your connection.");
            } 
            else if (error.response?.status === 503) {
              toast.error("Server busy. Please try again shortly.");
            }
            else {
              toast.error("Failed to load reviews. Please refresh.");
            }
            
            // Set empty array to prevent UI errors
            setReviews([]); 
          }
        };
      
        fetchUserReviews();
      }, []);

      const handleUpdate = async (reviewId, createdAt) => {
        try {
          // Frontend validation
          const hoursSinceCreation = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60);
          if (hoursSinceCreation > 24) {
            toast.error(`This review is ${Math.round(hoursSinceCreation)} hours old. Updates are only allowed within 24 hours.`);
            return;
          }
      
          if (!updatedRating || !updatedComment || !updatedTitle) {
            toast.error("Please provide a rating, title, and comment");
            return;
          }
      
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Authentication required. Please log in again.");
            return;
          }
      
          console.log("🔄 Attempting review update", { 
            reviewId,
            updatedRating,
            updatedTitle 
          });

          setReviews(prev => prev.map(review => 
            review._id === reviewId 
                ? { ...review, rating: updatedRating, comment: updatedComment }
                : review
          ));
      
          const response = await axios.put(
            `http://localhost:5000/api/reviews/update/${reviewId}`,
            { 
              rating: updatedRating, 
              comment: updatedComment, 
              reviewTitle: updatedTitle 
            },
            {
              headers: { 
                Authorization: `Bearer ${token}`,
              },
              timeout: 10000 // 10 second timeout
            }
          );
      
          // Verify successful update
          if (response.data?.updatedReview) {
            setReviews(prev => prev.map(review => 
                review._id === reviewId ? response.data.updatedReview : review
            ));
            toast.success("Update confirmed!");
          }
          setEditReview(null);
      
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update review.");
        }
      };

    // Handle Delete Review
    const handleDeleteReview = async (reviewId, createdAt) => {
        const timeElapsed = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60);
        if (timeElapsed > 24) {
            setMessage("You can only delete a review within 24 hours.");
            return;
        }

        setSelectedReviewId(reviewId);
        setShowDeleteConfirm(true);
    };

    // Confirm Delete Review
    const confirmDeleteReview = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Authentication required. Please log in again.");
            return;
          }
      
          setReviews(prev => prev.filter(review => review._id !== selectedReviewId));

          console.log("🔄 Attempting to delete review:", selectedReviewId);
          const response = await axios.delete(
            `http://localhost:5000/api/reviews/delete/${selectedReviewId}`,
            {
              headers: { 
                Authorization: `Bearer ${token}`,
              },
              timeout: 10000 // 10 second timeout
            }
          );
      
          // Verify successful deletion
          toast.success("Review deleted successfully!");
        } catch (error) {
            console.error("Error deleting review:", error.response?.data?.message || error); // Debugging
            setMessage(error.response?.data?.message || "Failed to delete review.");
        } 
        setShowDeleteConfirm(false);
      };
    
    // Function to generate stars based on rating
    const renderStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
            <h3 className="text-4xl font-extrabold text-center text-blue-400 mb-4 tracking-wide">
                My Reviews
            </h3>
            <p className="text-lg text-center text-gray-300 opacity-80 mb-8">
                Share your experience! Edit or remove your reviews below.
            </p>

            <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-2xl">
                {reviews.length === 0 ? (
                    <p className="text-gray-400 text-center">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-gray-700 p-5 rounded-lg shadow-md mb-6">
                            {editReview === review._id ? (
                                <div>
                                    <h4 className="text-2xl font-medium text-gray-200 mb-4">Edit Your Review</h4>

                                    <label className="block font-medium text-lg text-gray-300">Update Title:</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-500 rounded-md bg-gray-800 text-white mt-1"
                                        value={updatedTitle || review.reviewTitle}
                                        onChange={(e) => setUpdatedTitle(e.target.value)}
                                    />

                                    <label className="block font-medium text-lg text-gray-300 mt-4">Update Rating:</label>
                                    <select
                                        className="w-full p-3 border border-gray-500 rounded-md bg-gray-800 text-white mt-1"
                                        value={updatedRating || review.rating}
                                        onChange={(e) => setUpdatedRating(Number(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>
                                                {renderStars(num)}
                                            </option>
                                        ))}
                                    </select>

                                    <label className="block font-medium text-lg text-gray-300 mt-4">Update Comment:</label>
                                    <textarea
                                        className="w-full p-3 border border-gray-500 rounded-md bg-gray-800 text-white mt-1"
                                        value={updatedComment || review.comment}
                                        onChange={(e) => setUpdatedComment(e.target.value)}
                                    />

                                    <div className="mt-4 flex space-x-4">
                                        <button
                                            className="bg-green-500 text-white px-6 py-3 rounded-md flex items-center hover:bg-green-600"
                                            onClick={() => handleUpdate(review._id)}
                                            disabled={!updatedTitle || !updatedRating || !updatedComment}
                                        >
                                            <FaCheck className="mr-2" /> Save
                                        </button>
                                        <button
                                            className="bg-gray-500 text-white px-6 py-3 rounded-md flex items-center hover:bg-gray-600"
                                            onClick={() => setEditReview(null)}
                                        >
                                            <FaTimes className="mr-2" /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-400">
                                        <span className="font-semibold text-gray-300">Name:</span> {review.fullName || "N/A"}
                                    </p>
                                    <p className="text-gray-400">
                                        <span className="font-semibold text-gray-300">Email:</span> {review.email || "N/A"}
                                    </p>

                                    <h4 className="text-xl font-semibold text-gray-100 mt-3">{review.reviewTitle || "No Title"}</h4>
                                    <p className="text-gray-400 mt-2 flex items-center">
                                        <span className="font-semibold text-gray-300">Rating:</span>
                                        <span className="ml-2">{renderStars(review.rating)}</span>
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        <span className="font-semibold text-gray-300">Comment:</span> {review.comment}
                                    </p>

                                    <div className="mt-4 flex space-x-4">
                                        <button
                                            className="bg-yellow-500 text-white px-6 py-3 rounded-md flex items-center hover:bg-yellow-600"
                                            onClick={() => {
                                                setEditReview(review._id);
                                                setUpdatedTitle(review.reviewTitle);
                                                setUpdatedRating(review.rating);
                                                setUpdatedComment(review.comment);
                                            }}
                                        >
                                            <FaEdit className="mr-2" /> Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-6 py-3 rounded-md flex items-center hover:bg-red-600"
                                            onClick={() => handleDeleteReview(review._id, review.createdAt)}
                                        >
                                            <FaTrash className="mr-2" /> Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}

                {showDeleteConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-800 p-6 rounded-md shadow-lg">
                            <p className="text-lg font-semibold text-white">Are you sure you want to delete this review?</p>
                            <div className="mt-4 flex space-x-4">
                                <button
                                    className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
                                    onClick={confirmDeleteReview}
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
  );
}

export default UserReviews;
