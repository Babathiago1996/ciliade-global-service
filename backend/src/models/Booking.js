import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceRequired: {
      type: String,
      required: [true, 'Service type is required'],
      enum: ['consultation', 'measurement', 'fitting', 'custom-tailoring', 'alteration'],
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;