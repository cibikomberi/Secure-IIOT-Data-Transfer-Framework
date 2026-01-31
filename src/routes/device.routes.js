// routes/device.routes.js
const express = require("express");
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/device.controller");

const router = express.Router();

router.post("/", auth, controller.create);
router.get("/", auth, controller.list);
router.post("/:deviceId/rotate-key", auth, controller.rotateKey);

module.exports = router;
