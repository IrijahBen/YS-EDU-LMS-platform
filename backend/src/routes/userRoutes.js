const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { uploadProfileImage } = require('../config/cloudinary');
const {
  updateProfile, 
  uploadAvatar, 
  getStudentDashboard, 
  getInstructorDashboard,
  getAllUsers, 
  getUserById, 
  toggleBanUser, 
  updateUserRole, 
  deleteUser,
  toggleWishlist, 
  getPlatformAnalytics,
  approveUser, // NEW: Added logic from previous step
  rejectUser   // NEW: Added logic from previous step
} = require('../controllers/userController');

// All routes after this middleware require authentication
router.use(protect);

// ─── Standard User Routes ──────────────────────────────────────────
router.put('/profile', updateProfile);
router.put('/avatar', uploadProfileImage.single('avatar'), uploadAvatar);
router.get('/dashboard', getStudentDashboard);
router.get('/instructor-dashboard', restrictTo('instructor', 'admin'), getInstructorDashboard);
router.put('/wishlist/:courseId', toggleWishlist);

// ─── Admin Management Routes ───────────────────────────────────────
router.get('/', restrictTo('admin'), getAllUsers);
router.get('/admin/analytics', restrictTo('admin'), getPlatformAnalytics);
router.get('/:id', restrictTo('admin'), getUserById);

// Admin Action Routes
router.put('/:id/ban', restrictTo('admin'), toggleBanUser);
router.put('/:id/role', restrictTo('admin'), updateUserRole);
router.delete('/:id', restrictTo('admin'), deleteUser);

// NEW: Admin Approval Routes
router.put('/:id/approve', restrictTo('admin'), approveUser);
router.delete('/:id/reject', restrictTo('admin'), rejectUser);

module.exports = router;
