import express from 'express';
import { getAllUsers, approveUser, deactivateUser, deleteUser, getAdminStats } from '../controllers/adminController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', verifyToken, verifyRole('admin'), getAllUsers);
router.post('/approve-user', verifyToken, verifyRole('admin'), approveUser);
router.post('/deactivate-user', verifyToken, verifyRole('admin'), deactivateUser);
router.delete('/users/:id', verifyToken, verifyRole('admin'), deleteUser);
router.get('/stats', verifyToken, verifyRole('admin'), getAdminStats);

export default router;
