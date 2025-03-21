import React, { useState, useEffect } from "react";
import axios from "axios";

function ReviewManage() {
    const [reviews, setReviews] = useState([]);
    const [message, setMessage] = useState("");
    const flaggedWords = ["bad", "offensive", "inappropriate"];  // List of flagged words

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("http://localhost:5000/api/reviews/all-reviews", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(data.reviews); // Adjust based on the actual structure of the API response
        } catch (error) {
            console.error("Fetch error:", error.response?.data || error.message);
            setMessage("Failed to fetch reviews.");
        }
    };

    const handleModerate = async (reviewId, action) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/reviews/moderate/${reviewId}`,
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (action === "deleted") {
                setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
            } else {
                fetchReviews(); // Re-fetch for other actions
            }
        } catch (error) {
            setMessage("Failed to moderate review.");
        }
    };    
    
    // Function to generate stars based on rating
    const renderStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-3xl font-bold mb-6 text-gray-800">All User Reviews</h3>
      {message && <p className="text-red-600 font-semibold text-lg">{message}</p>}

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 border">User ID</th>
                <th className="p-4 border">Full Name</th>
                <th className="p-4 border">Email</th>
                <th className="p-4 border">Review Title</th>
                <th className="p-4 border">Status</th>
                <th className="p-4 border">Rating</th>
                <th className="p-4 border">Comment</th>
                <th className="p-4 border">Verified Buyer</th>
                <th className="p-4 border">Created At</th>
                <th className="p-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className={`text-center border-t transition-all hover:bg-gray-100 ${
                    review.status === "flagged" ? "bg-red-200" : ""
                  }`}
                >
                  <td className="p-4 border">{review.userId}</td>
                  <td className="p-4 border font-medium">{review.fullName}</td>
                  <td className="p-4 border text-gray-600">{review.email}</td>
                  <td className="p-4 border">{review.reviewTitle}</td>
                  <td
                    className={`p-4 border font-semibold ${
                      review.status === "approved" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {review.status}
                  </td>
                  <td className="p-4 border text-yellow-500">{renderStars(review.rating)}</td>
                  <td className="p-4 border text-gray-700">{review.comment}</td>
                  <td className="p-4 border font-semibold">{review.verifiedBuyer ? "Yes" : "No"}</td>
                  <td className="p-4 border text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 border flex flex-wrap gap-2 justify-center">
                    {review.status !== "flagged" ? (
                      <>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                          onClick={() => handleModerate(review._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                          onClick={() => handleModerate(review._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
                        onClick={() => handleModerate(review._id, "deleted")}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

)};

export default ReviewManage;
