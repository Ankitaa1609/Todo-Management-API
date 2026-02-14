const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A task must have a title"],
      trim: true,
      maxlength: [100, "Task title must be less than 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Task description must be less than 500 characters"],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must belong to a user"],
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
