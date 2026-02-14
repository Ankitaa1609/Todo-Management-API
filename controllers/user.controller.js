const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

/**
 * FILTER ALLOWED FIELDS
 * Prevent role escalation or forbidden updates
 */
const filterAllowedFields = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

/**
 * GET CURRENT USER PROFILE
 * GET /api/v1/users/me
 */
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * UPDATE CURRENT USER PROFILE
 * PATCH /api/v1/users/updateMe
 *
 * ❌ Cannot update role
 * ❌ Cannot update password here
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Reject password updates
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword.",
        400,
      ),
    );
  }

  // 2) Filter allowed fields
  const filteredBody = filterAllowedFields(req.body, "name", "email");

  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError("No valid fields to update", 400));
  }

  // 3) Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

/**
 * SOFT DELETE CURRENT USER
 * DELETE /api/v1/users/deleteMe
 */
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
