// controllers/platformUser.controller.js
const { validationResult } = require("express-validator");
const userService = require("../service/user.service");

class PlatformUserController {
  async createUser(req, res) {
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
      const { name, email, password } = req.body;

      const user = await userService.createUser({
        name,
        email,
        password,
      });

      return res.status(201).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new PlatformUserController();
