import express from 'express';
import { addToFAQ, deleteInquiry, deleteResolvedInquiry, downloadInquiry, getAllInquiries, getUserInquiries,resolveInquiry, submitInquiry, updateInquiry } from '../controller/inquiryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

//User Routes
router.post('/submit', authMiddleware, submitInquiry);
router.get('/my-inquiry', authMiddleware, getUserInquiries);
router.put('/update-inquiry/:id', authMiddleware, updateInquiry);
router.delete('/delete-inquiry/:id', authMiddleware, deleteInquiry);
router.get('/download/:id', authMiddleware, downloadInquiry);

//Admin Routes
router.get('/all-inquiries', getAllInquiries);
router.put('/resolve/:id', resolveInquiry);
router.post('/add-to-faq/:id', addToFAQ)
router.delete('/delete-resolved/:id', deleteResolvedInquiry);

export default router;