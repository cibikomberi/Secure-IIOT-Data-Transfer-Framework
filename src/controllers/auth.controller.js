// controllers/auth.controller.js
const { validationResult } = require("express-validator");
const authService = require("../service/auth.service");

class AuthController {
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg,
        })),
      });
    }

    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new AuthController();
