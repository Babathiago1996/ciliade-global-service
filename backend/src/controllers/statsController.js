import User from '../models/User.js';
import Product from '../models/Product.js';
import Message from '../models/Message.js';
import Booking from '../models/Booking.js';

export const getStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const unreadMessages = await Message.countDocuments({ isRead: false });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Recent activity
    const recentBookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          totalProducts,
          totalMessages,
          totalBookings,
          unreadMessages,
          pendingBookings,
        },
        recentActivity: {
          bookings: recentBookings,
          messages: recentMessages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};