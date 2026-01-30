import dotenv from 'dotenv';

// CRITICAL: Load environment variables BEFORE importing anything else
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDatabase from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import { startEmailScheduler } from './utils/emailScheduler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import measurementRoutes from './routes/measurementRoutes.js';
import productRoutes from './routes/productRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// Connect to database
connectDatabase();

// Initialize app
const app = express();
app.set("trust proxy", 1)


// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "https://ciliade-global-service.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

// Start email scheduler
startEmailScheduler();

const PORT = process.env.PORT || 5008;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎩  CILIADE TAILORING COMPANY - BACKEND SERVER         ║
║                                                           ║
║   Server running on port ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});