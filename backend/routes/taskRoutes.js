import express from 'express';
import { createTask, assignTask, getTasks, updateTaskStatus, getTaskStats } from '../controllers/taskController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, verifyRole('admin', 'manager', 'customer'), createTask);
router.get('/', verifyToken, getTasks);
router.get('/stats', verifyToken, getTaskStats);
router.post('/assign', verifyToken, verifyRole('admin', 'manager'), assignTask);
router.put('/status', verifyToken, updateTaskStatus);

export default router;
