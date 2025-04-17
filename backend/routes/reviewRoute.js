import express from "express";
import { approvedReviews, deleteReview, getAllReviews, getUserReviews, moderateReview, submitReview, updateReview } from '../controller/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', 
    (req, res, next) => {
        console.log("🌐 Request received:", {
            method: req.method,
            path: req.path,
            ip: req.ip,
            time: new Date().toISOString()
        });
        next();
    },
    authMiddleware(),
    (req, res, next) => {
        console.log("🟢 Auth successful for user:", req.user.email);
        next();
    },
    submitReview
);

router.get('/user-review', 
    (req, res, next) => {
      console.log(`📥 Review request from IP: ${req.ip}`);
      next();
    },
    authMiddleware(),
    (req, res, next) => {
      console.log(`👤 Auth passed for user: ${req.user.email}`);
      next();
    },
    getUserReviews
  );
  
  router.put('/update/:id', 
    (req, res, next) => {
      console.log(`📥 Update request for review: ${req.params.id}`);
      next();
    },
    authMiddleware(),
    (req, res, next) => {
      console.log(`👤 Auth passed for user: ${req.user.email}`);
      next();
    },
    updateReview
  );

router.delete('/delete/:id', 
  (req, res, next) => {
    console.log(`📥 Delete request for review: ${req.params.id}`);
    next();
  },
  authMiddleware(),
  (req, res, next) => {
    console.log(`👤 Auth passed for user: ${req.user.email}`);
    next();
  },
  deleteReview
);

router.get('/all-reviews', getAllReviews)
router.get('/approved', approvedReviews);
router.put('/moderate/:id', moderateReview);

export default router;