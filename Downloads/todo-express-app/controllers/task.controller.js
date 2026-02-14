const Task = require("../models/taskModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

/**
 * CREATE TASK
 */
exports.createTask = catchAsync(async (req, res, next) => {
  // 1) Check body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new AppError("Request body cannot be empty", 400));
  }

  // 2) Required fields check
  if (!req.body.title) {
    return next(new AppError("Task title is required", 400));
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    user: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: { task },
  });
});

/**
 * GET ALL TASKS (of logged-in user)
 */
exports.getMyTasks = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  if (page < 1 || limit < 1) {
    return next(new AppError("Page and limit must be positive numbers", 400));
  }

  if (limit > 100) {
    return next(new AppError("Limit cannot be greater than 100", 400));
  }

  const skip = (page - 1) * limit;

  const [tasks, totalTasks] = await Promise.all([
    Task.find({ user: req.user.id }).sort("-createdAt").skip(skip).limit(limit),
    Task.countDocuments({ user: req.user.id }),
  ]);

  res.status(200).json({
    status: "success",
    results: tasks.length,
    pagination: {
      totalTasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      limit,
    },
    data: { tasks },
  });
});

/**
 * GET SINGLE TASK
 */
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

/**
 * UPDATE TASK
 */
exports.updateTask = catchAsync(async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new AppError("Update body cannot be empty", 400));
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { task },
  });
});

/**
 * DELETE TASK (HARD DELETE)
 */
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
