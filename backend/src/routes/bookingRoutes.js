import express from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('serviceRequired').notEmpty().withMessage('Service type is required'),
    body('preferredDate').isISO8601().withMessage('Valid date is required'),
  ],
  validate,
  createBooking
);

router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

export default router;