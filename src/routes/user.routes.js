// routes/platformUser.routes.js
const express = require("express");
const controller = require("../controllers/user.controller");
const { createUserValidator } = require("../validator/user.validator");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  createUserValidator,
  controller.createUser
);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
