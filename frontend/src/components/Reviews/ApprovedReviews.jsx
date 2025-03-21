import React, { useState, useEffect } from "react";
import axios from "axios";

function ApprovedReviews() {
    const [approvedReviews, setApprovedReviews] = useState([]);

    useEffect(() => {
        const fetchApprovedReviews = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/reviews/approved");
                setApprovedReviews(response.data);
            } catch (error) {
                console.error("Error fetching approved reviews:", error);
            }
        };

        fetchApprovedReviews();
    }, []);

    // Function to generate stars based on rating
    const renderStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

  return (
    <div>
      <h2>Customer Reviews</h2>
      {approvedReviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        approvedReviews.map((review) => (
          <div key={review._id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
            <p><strong>User:</strong> {review.userName}</p>
            <p><strong>Rating:</strong> {renderStars(review.rating)}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            {review.verifiedBuyer && <p style={{ color: "green", fontWeight: "bold" }}>✔ Verified Buyer</p>}
          </div>
        ))
      )}
    </div>
  )
}

export default ApprovedReviews
