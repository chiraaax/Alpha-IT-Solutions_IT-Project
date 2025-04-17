import express from 'express';
import { addToFAQ, deleteInquiry, deleteResolvedInquiry, downloadInquiry, getAllInquiries, getUserInquiries,resolveInquiry, submitInquiry, updateInquiry } from '../controller/inquiryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

//User Routes
router.post('/submit', 
    (req, res, next) => {
        console.log("🌐 Inquiry Request:", {
            method: req.method,
            path: req.path,
            time: new Date().toISOString()
        });
        next();
    },
    authMiddleware(),
    (req, res, next) => {
        console.log("🟢 Inquiry Auth:", req.user.email);
        next();
    },
    submitInquiry
);

router.get('/my-inquiry', 
    (req, res, next) => {
        console.log(`📥 Inquiry request from IP: ${req.ip}`);
        next();
    },
    authMiddleware(),
    (req, res, next) => {
        console.log(`👤 Auth passed for user: ${req.user.email}`);
        next();
    },
    getUserInquiries
);

router.put('/update-inquiry/:id', 
    (req, res, next) => {
        console.log(`📥 Update request for review: ${req.params.id}`);
        next();
      },
      authMiddleware(),
      (req, res, next) => {
        console.log(`👤 Auth passed for user: ${req.user.email}`);
        next();
      },
       updateInquiry);

router.delete('/delete-inquiry/:id', 
    (req, res, next) => {
        console.log(`📥 Delete request for inquiry: ${req.params.id}`);
        next();
    },
    authMiddleware(),
    (req, res, next) => {
        console.log(`👤 Auth passed for user: ${req.user.id}`);
        next();
    },
    deleteInquiry
);

router.get('/download/:id', 
    (req, res, next) => {
        console.log(`📥 Download request for: ${req.params.id}`);
        next();
    },
    authMiddleware(),
    (req, res, next) => {
        console.log(`👤 Auth passed for download by: ${req.user.email}`);
        next();
    },
    downloadInquiry
);

//Admin Routes
router.get('/all-inquiries', getAllInquiries);
router.put('/resolve/:id', resolveInquiry);
router.post('/add-to-faq/:id', addToFAQ)
router.delete('/delete-resolved/:id', deleteResolvedInquiry);

export default router;