import express from 'express';
import { body } from 'express-validator';
import {
  createOrUpdateMeasurement,
  getMeasurement,
  getAllMeasurements,
} from '../controllers/measurementController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('height').isNumeric().withMessage('Height must be a number'),
    body('weight').isNumeric().withMessage('Weight must be a number'),
    body('chest').isNumeric().withMessage('Chest must be a number'),
    body('waist').isNumeric().withMessage('Waist must be a number'),
    body('hips').isNumeric().withMessage('Hips must be a number'),
    body('shoulderWidth').isNumeric().withMessage('Shoulder width must be a number'),
    body('sleeveLength').isNumeric().withMessage('Sleeve length must be a number'),
    body('inseam').isNumeric().withMessage('Inseam must be a number'),
    body('neckCircumference').isNumeric().withMessage('Neck circumference must be a number'),
  ],
  validate,
  createOrUpdateMeasurement
);

router.get('/', protect, getMeasurement);
router.get('/all', protect, authorize('admin'), getAllMeasurements);

export default router;