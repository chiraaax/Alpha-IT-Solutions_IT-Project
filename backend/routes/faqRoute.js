import express from 'express';
import { addFAQ, deleteFAQ, getFAQs, incrementFAQViews, updateFAQ } from '../controller/faqController.js';

const router = express.Router();

router.get('/get-faqs', getFAQs);
router.post('/add-faqs', addFAQ);
router.put('/update-faq/:id', updateFAQ);
router.delete('/delete-faq/:id', deleteFAQ);
router.put('/increment-views/:id', incrementFAQViews);

export default router;