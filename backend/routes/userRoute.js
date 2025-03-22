import express from 'express';
import { changePassword, deleteUser, getUsers, updateUser, verifyDetails, verifyDetailsReveiws } from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/update',authMiddleware, updateUser);
router.put('/change-password', authMiddleware, changePassword);
router.delete('/delete',authMiddleware, deleteUser);
router.post('/verify-details', authMiddleware, verifyDetails);
router.post('/verify-details-review', authMiddleware, verifyDetailsReveiws);
router.get('/get-all-users', getUsers);

export default router;