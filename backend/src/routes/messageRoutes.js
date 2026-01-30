import express from 'express';
import { body } from 'express-validator';
import {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  validate,
  createMessage
);

router.get('/', protect, authorize('admin'), getMessages);
router.put('/:id', protect, authorize('admin'), updateMessageStatus);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

export default router;