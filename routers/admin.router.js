const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * ADMIN ONLY ROUTES
 */
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo("admin"));

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
