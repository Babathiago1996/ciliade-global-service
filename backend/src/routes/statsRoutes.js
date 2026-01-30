import express from 'express';
import { getStats, getCustomers } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getStats);
router.get('/customers', protect, authorize('admin'), getCustomers);

export default router;

