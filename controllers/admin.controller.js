const mongoose = require("mongoose");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

/**
 * Utility: validate MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Utility: filter allowed fields
 */
const filterAllowedFields = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

/**
 * GET ALL USERS (ADMIN) — PAGINATED
 * GET /api/v1/admin/users?page=1&limit=10
 */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  if (page < 1 || limit < 1) {
    return next(new AppError("Page and limit must be positive numbers", 400));
  }

  if (limit > 100) {
    return next(new AppError("Limit cannot be greater than 100", 400));
  }

  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    User.find().sort("-createdAt").skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  // Optional: page overflow check
  if (skip >= totalUsers && totalUsers !== 0) {
    return next(new AppError("This page does not exist", 404));
  }

  res.status(200).json({
    status: "success",
    results: users.length,
    pagination: {
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      limit,
    },
    data: {
      users,
    },
  });
});

/**
 * UPDATE ANY USER (ADMIN)
 * PATCH /api/v1/admin/users/:id
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return next(new AppError("Invalid user ID", 400));
  }

  const filteredBody = filterAllowedFields(
    req.body,
    "name",
    "email",
    "role",
    "active",
  );

  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError("No valid fields to update", 400));
  }

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * SOFT DELETE ANY USER (ADMIN)
 * DELETE /api/v1/admin/users/:id
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return next(new AppError("Invalid user ID", 400));
  }

  if (req.params.id === req.user.id) {
    return next(new AppError("You cannot delete your own admin account.", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true },
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
