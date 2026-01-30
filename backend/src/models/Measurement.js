import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [100, 'Height must be at least 100cm'],
      max: [250, 'Height must not exceed 250cm'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [30, 'Weight must be at least 30kg'],
      max: [300, 'Weight must not exceed 300kg'],
    },
    chest: {
      type: Number,
      required: [true, 'Chest measurement is required'],
      min: [60, 'Chest must be at least 60cm'],
    },
    waist: {
      type: Number,
      required: [true, 'Waist measurement is required'],
      min: [50, 'Waist must be at least 50cm'],
    },
    hips: {
      type: Number,
      required: [true, 'Hips measurement is required'],
      min: [60, 'Hips must be at least 60cm'],
    },
    shoulderWidth: {
      type: Number,
      required: [true, 'Shoulder width is required'],
      min: [30, 'Shoulder width must be at least 30cm'],
    },
    sleeveLength: {
      type: Number,
      required: [true, 'Sleeve length is required'],
      min: [50, 'Sleeve length must be at least 50cm'],
    },
    inseam: {
      type: Number,
      required: [true, 'Inseam is required'],
      min: [60, 'Inseam must be at least 60cm'],
    },
    neckCircumference: {
      type: Number,
      required: [true, 'Neck circumference is required'],
      min: [30, 'Neck circumference must be at least 30cm'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Measurement = mongoose.model('Measurement', measurementSchema);

export default Measurement;