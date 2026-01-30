import Booking from '../models/Booking.js';

export const createBooking = async (req, res, next) => {
  try {
    const { serviceRequired, preferredDate, notes } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      serviceRequired,
      preferredDate,
      notes,
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      'user',
      'firstName lastName email phone'
    );

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
next(error);
}
};
export const getAllBookings = async (req, res, next) => {
try {
const bookings = await Booking.find()
.populate('user', 'firstName lastName email phone')
.sort({ createdAt: -1 });
res.status(200).json({
  success: true,
  count: bookings.length,
  data: bookings,
})} catch (error) {
next(error);
}
};
export const updateBookingStatus = async (req, res, next) => {
try {
const { status } = req.body
const booking = await Booking.findByIdAndUpdate(
  req.params.id,
  { status },
  { new: true, runValidators: true }
).populate('user', 'firstName lastName email phone');

if (!booking) {
  return res.status(404).json({
    success: false,
    message: 'Booking not found',
  });
}

res.status(200).json({
  success: true,
  data: booking,
})} catch (error) {
next(error);
}
};