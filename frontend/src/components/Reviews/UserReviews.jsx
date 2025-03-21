import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

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
            try{
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/reviews/user-review", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Fetched reviews:", response.data); 
                setReviews(response.data);
            }catch(error){
                console.error("Error fetching reviews:", error);
            }
        };
    
        fetchUserReviews();
    }, []);

    const handleUpdate = async (reviewId, createdAt) => {
        const timeElapsed = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60);
        if (timeElapsed > 24) {
            setMessage("You can only update a review within 24 hours.");
            return;
        }

        if (!updatedRating || !updatedComment || !updatedTitle) {
            setMessage("Rating and comment cannot be empty.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/reviews/update/${reviewId}`,
                { rating: updatedRating, comment: updatedComment, reviewTitle: updatedTitle},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage("Review updated successfully.");
            setEditReview(null);
            setUpdatedComment("");
            setUpdatedTitle("");
            setUpdatedRating(0);
            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review._id === reviewId
                        ? { ...review, rating: updatedRating, comment: updatedComment, reviewTitle: updatedTitle }
                        : review
                )
            );
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
        const token = localStorage.getItem("token");
    
        try {
            await axios.delete(`http://localhost:5000/api/reviews/delete/${selectedReviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("Review deleted successfully"); // Debugging
            setMessage("Review deleted successfully.");
            setReviews(reviews.filter((review) => review._id !== selectedReviewId));
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
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 p-8">
        <h3 className="text-4xl font-extrabold text-center text-white mb-4 tracking-wide">Your Reviews</h3>
        <p className="text-lg text-center text-white opacity-80 mb-8">
            View and manage your submitted reviews. You can update and delete each reviews here.
        </p>
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
        
            {reviews.length === 0 ? (
                <p className="text-gray-600 text-center">No reviews found. Start sharing your thoughts!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 p-4 rounded-lg shadow-md mb-6">
                        {editReview === review._id ? (
                            <div>
                                <h4 className="text-2xl font-medium text-gray-800">Update Your Review</h4>

                                {/* Title Update */}
                                <label className="block font-medium mt-2 text-lg text-gray-700">Update Title:</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                    value={updatedTitle || review.reviewTitle}
                                    onChange={(e) => setUpdatedTitle(e.target.value)}
                                />

                                {/* Rating Selection */}
                                <label className="block font-medium mt-4 text-lg text-gray-700">Update Rating:</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                    value={updatedRating || review.rating}
                                    onChange={(e) => setUpdatedRating(Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                            {renderStars(num)}
                                        </option>
                                    ))}
                                </select>

                                {/* Comment Update */}
                                <label className="block font-medium mt-4 text-lg text-gray-700">Update Comment:</label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                    value={updatedComment || review.comment}
                                    onChange={(e) => setUpdatedComment(e.target.value)}
                                />

                                {/* Action Buttons */}
                                <div className="mt-4 flex space-x-4">
                                    <button
                                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                                        onClick={() => handleUpdate(review._id, review.createdAt)}
                                        disabled={!updatedTitle || !updatedRating || !updatedComment}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500"
                                        onClick={() => setEditReview(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Display Name & Email */}
                                <p className="text-gray-700">
                                    <span className="font-semibold">Name:</span> {review.fullName || "N/A"}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Email:</span> {review.email || "N/A"}
                                </p>

                                {/* Display Title */}
                                <h4 className="text-xl font-semibold mt-2 text-gray-800">{review.reviewTitle || "No Title"}</h4>

                                <p className="text-gray-700 mt-2">
                                    <span className="font-semibold">Rating:</span>
                                    <span className="text-yellow-500 ml-2">{renderStars(review.rating)}</span>
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <span className="font-semibold">Comment:</span> {review.comment}
                                </p>

                                {/* Action Buttons */}
                                <div className="mt-4 flex space-x-4">
                                    <button
                                        className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600"
                                        onClick={() => {
                                            setEditReview(review._id);
                                            setUpdatedTitle(review.reviewTitle);
                                            setUpdatedRating(review.rating);
                                            setUpdatedComment(review.comment);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
                                        onClick={() => handleDeleteReview(review._id, review.createdAt)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <p className="text-lg font-semibold text-gray-800">Are you sure you want to delete this review?</p>
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
