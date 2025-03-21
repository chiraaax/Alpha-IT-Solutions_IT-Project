import Review from "../models/reviewModel.js";
import mongoose from "mongoose";

const inappropriateWords = [
  "useless", "garbage", "piece of crap", "scam", "fraud", "ripoff", "junk",
  "terrible", "horrible", "disappointing", "worst", "awful", "shitty", "pathetic",
  "disgusting", "waste", "overpriced", "defective", "broken", "inferior",
];

export const submitReview = async (req, res) => {
  try {
      const { fullName, email, rating, comment, reviewTitle } = req.body;

      if (!req.user || !req.user._id) {
          return res.status(401).json({ message: "Unauthorized: User ID missing" });
      }

      if (!rating || !comment || !reviewTitle || !fullName || !email) {
          return res.status(400).json({ message: "All required fields must be filled." });
      }

      const userId = new mongoose.Types.ObjectId(req.user._id); // Ensure correct ObjectId type
      console.log("Received review request:", { userId, rating, comment });

      // Check if the user has a completed order
      const hasPurchased = await Order.findOne({ 
        userId: userId.toString(),  // Convert userId to string before querying
        status: "completed" 
      });
      console.log("Has completed order:", hasPurchased);

      if (!hasPurchased) {
          console.log("User has not purchased a completed order.");
          return res.status(400).json({ message: "Only verified buyers can leave reviews." });
      }

      // Check for inappropriate content (ensure the function exists)
      if (typeof containsInappropriateContent === "function" && containsInappropriateContent(comment)) {
          console.log("Inappropriate content detected in comment.");
          return res.status(400).json({ message: "Your review contains inappropriate content." });
      }

      let status = "pending";
      let flaggedReason = "";

      // Check for inappropriate words
      for (const word of inappropriateWords) {
          if (comment.toLowerCase().includes(word)) {
              status = "flagged";
              flaggedReason = `Contains inappropriate language: ${word}`;
              break;
          }
      }

      // Create and save review
      const newReview = new Review({
          userId,
          rating,
          comment,
          fullName,
          email,
          reviewTitle,
          verifiedBuyer: true,
          status,
          flaggedReason
      });

      await newReview.save();
      console.log("Review saved successfully.");
      res.status(201).json({ message: "Review submitted and pending approval." });

  } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Moderate a Flagged Review (Approve/Reject)
export const moderateReview = async (req, res) => {
  try {
    const { action } = req.body;
    const reviewId = req.params.id;

    console.log(`Updating review: ${reviewId} with action: ${action}`);

    if (action.toLowerCase() === "rejected" || action.toLowerCase() === "deleted") {
      // If the review is rejected, delete it from the database
      const deletedReview = await Review.findByIdAndDelete(reviewId);

      if (!deletedReview) {
        return res.status(404).json({ message: "Review not found." });
      }

      console.log("Successfully deleted review:", deletedReview);
      return res.json({ message: "Review rejected and deleted successfully." });
    }

    // If the review is approved, update the status to "approved"
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status: "approved", flaggedReason: "" },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    console.log("Successfully updated review:", updatedReview);
    res.json({ message: "Review approved successfully.", updatedReview });

  } catch (error) {
    console.error("Error updating/deleting review:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserReviews = async (req, res) => {
  try {
      const reviews = await Review.find({ userId: req.user.id });
      res.json(reviews);
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};

export const updateReview = async (req, res) => {
  try {
      console.log("Received request to update review");
      console.log("Review ID:", req.params.id);
      console.log("User ID from request:", req.user?.id);
      console.log("Received Data:", req.body);

      const { rating, comment, reviewTitle } = req.body; // Extract rating and comment
      const review = await Review.findById(req.params.id);
      
      if (!review) {
        console.log("Review not found in database.");
        return res.status(404).json({ message: "Review not found." });
      }
  
      console.log("Review found:", review);
  
      // Check whether the user is logged in and owns the review
      if (review.userId.toString() !== req.user.id) {
        console.log("Unauthorized access attempt by user:", req.user.id);
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Check if the review is within the 24-hour edit window
      const timeElapsed = (Date.now() - new Date(review.createdAt)) / (1000 * 60 * 60);
      console.log("Time elapsed since review creation (hours):", timeElapsed);
      if (timeElapsed > 24) {
        console.log("Review edit window exceeded.");
        return res.status(400).json({ message: "You can only edit a review within 24 hours." });
      }

      // Update review
      review.rating = rating;
      review.comment = comment;
      review.reviewTitle = reviewTitle;
      await review.save();

      console.log("Review updated successfully:", review);
      res.json({ message: "Review updated successfully.", review });
  } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Server error", error });
  }
};

export const deleteReview = async (req, res) => {
  try {
      console.log("Delete request received for review ID:", req.params.id);  // Debugging

      const { id } = req.params;  // Ensure this matches route
      const review = await Review.findById(id);

      if (!review) {
          console.log("Review not found in database");  // Debugging
          return res.status(404).json({ message: "Review not found." });
      }

      const timeElapsed = (Date.now() - new Date(review.createdAt)) / (1000 * 60 * 60);
      console.log("Time elapsed since review creation:", timeElapsed);  // Debugging

      if (timeElapsed > 24) {
          console.log("Delete attempt outside 24-hour window");  // Debugging
          return res.status(400).json({ message: "You can only delete a review within 24 hours." });
      }

      await review.deleteOne();
      console.log("Review deleted successfully");  // Debugging
      res.json({ message: "Review deleted successfully." });
  } catch (error) {
      console.error("Server error while deleting review:", error);  // Debugging
      res.status(500).json({ message: "Server error", error });
  }
};

export const approvedReviews = async(req, res) => {
  try {
    const approvedReviews = await Review.find({ status: "approved" });
    res.json(approvedReviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch approved reviews" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
      const reviews = await Review.find(); // Fetch all reviews from the database

      if (!reviews.length) {
          return res.status(404).json({ message: "No reviews found." });
      }

      res.json({ message: "Reviews fetched successfully.", reviews });
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
};