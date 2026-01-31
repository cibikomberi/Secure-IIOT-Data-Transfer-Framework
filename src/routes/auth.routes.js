// routes/auth.routes.js
const express = require("express");
const controller = require("../controllers/auth.controller");
const { loginValidator } = require("../validator/auth.validator");

const router = express.Router();

router.post("/login", loginValidator, controller.login);

module.exports = router;
