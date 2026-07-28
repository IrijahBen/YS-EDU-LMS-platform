const User = require('../models/User');
const { AppError } = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
// const { sendApprovalEmail } = require('../utils/sendEmail'); // Uncomment if you have this setup

// @desc    Get all pending users
// @route   GET /api/admin/users/pending
// @access  Private/Admin
exports.getPendingUsers = asyncHandler(async (req, res, next) => {
  const pendingUsers = await User.find({ isApproved: false })
    .select('name email role createdAt')
    .sort('-createdAt'); // Sort to show the newest registrations first

  res.status(200).json({
    success: true,
    count: pendingUsers.length,
    data: pendingUsers
  });
});

// @desc    Approve a user
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
exports.approveUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.isApproved) {
    return next(new AppError('User is already approved', 400));
  }

  user.isApproved = true;
  user.approvedAt = Date.now();
  await user.save({ validateBeforeSave: false });

  // Uncomment to trigger an email notification letting them know they can log in
  // try {
  //   await sendApprovalEmail(user);
  // } catch (err) {
  //   console.error("Failed to send approval email:", err);
  // }

  res.status(200).json({
    success: true,
    message: 'User approved successfully'
  });
});

// @desc    Reject/Delete a pending user
// @route   DELETE /api/admin/users/:id/reject
// @access  Private/Admin
exports.rejectUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id, isApproved: false });

  if (!user) {
    return next(new AppError('Pending user not found', 404));
  }

  // Use findByIdAndDelete instead of .remove() for modern Mongoose compatibility
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User application rejected and removed'
  });
});
