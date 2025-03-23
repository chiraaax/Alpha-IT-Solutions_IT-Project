import express from "express";
import { approvedReviews, deleteReview, getAllReviews, getUserReviews, moderateReview, submitReview, updateReview } from '../controller/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit',authMiddleware, submitReview);
router.get('/user-review', authMiddleware,getUserReviews);
router.put('/update/:id', authMiddleware, updateReview);
router.delete('/delete/:id', authMiddleware, deleteReview);

router.get('/all-reviews', getAllReviews)
router.get('/approved', approvedReviews);
router.put('/moderate/:id', moderateReview);

export default router;