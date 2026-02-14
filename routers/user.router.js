const express = require("express");
const userController = require("../controllers/user.controller");
const authController = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * USER SELF-SERVICE ROUTES
 */
router.use(authController.protect);

router.get("/me", userController.getMe);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

module.exports = router;
