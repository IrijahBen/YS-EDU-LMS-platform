
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const discussionRoutes = require('./routes/discussionRoutes');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// ─── CORS CONFIGURATION ──────────────────────────────────────────────────────

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://ys-edu-lms-platform.vercel.app',
  process.env.CLIENT_URL
]
  .filter(Boolean)
  .map(origin => origin.trim().replace(/\/$/, ''));

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  optionsSuccessStatus: 204,
  maxAge: 86400
};

// Register CORS before API routes and other middleware
app.use(cors(corsOptions));

// ─── SOCKET.IO SETUP ─────────────────────────────────────────────────────────

const io = new Server(server, {
  cors: corsOptions
});

// Make Socket.IO accessible in routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Join personal notification room
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join course discussion room
  socket.on('join_course', (courseId) => {
    socket.join(`course_${courseId}`);
  });

  socket.on('leave_course', (courseId) => {
    socket.leave(`course_${courseId}`);
  });

  // Typing indicators
  socket.on('typing', ({ courseId, userId, userName }) => {
    socket.to(`course_${courseId}`).emit('user_typing', {
      userId,
      userName
    });
  });

  socket.on('stop_typing', ({ courseId, userId }) => {
    socket.to(`course_${courseId}`).emit('user_stop_typing', {
      userId
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─── SECURITY MIDDLEWARE ─────────────────────────────────────────────────────

app.use(helmet({
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
}));

// ─── RATE LIMITING ───────────────────────────────────────────────────────────

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 100 : 10,
  message: {
    success: false,
    message: 'Too many auth attempts. Please try again later.'
  }
});

app.use('/api', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── BODY PARSING ────────────────────────────────────────────────────────────

// Preserve raw body for payment webhook verification
app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' })
);

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.use(cookieParser(process.env.COOKIE_SECRET));

// ─── LOGGING ─────────────────────────────────────────────────────────────────

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── API ROUTES ──────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/discussions', discussionRoutes);

// ─── ROOT ROUTE ──────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎓 YS EDU API',
    version: '1.0.0',
    docs: '/api/health'
  });
});

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LMS API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────

app.use(errorHandler);

// ─── START SERVER ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log('🌐 Allowed CORS origins:', allowedOrigins);
});

// ─── ERROR HANDLING ──────────────────────────────────────────────────────────

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err.message);

  server.close(() => process.exit(1));
});

module.exports = { app, io };
