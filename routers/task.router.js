const express = require("express");
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * TASK ROUTES (AUTHENTICATED USERS)
 */
router.use(authMiddleware.protect);

router
  .route("/")
  .post(taskController.createTask)
  .get(taskController.getMyTasks);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
