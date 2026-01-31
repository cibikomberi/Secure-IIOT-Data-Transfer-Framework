const deviceService = require("../service/device.service");

class DeviceController {
  async create(req, res) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    try {
      const result = await deviceService.createDevice({
        name,
        user: req.user,
      });

      return res.status(201).json({
        success: true,
        device: {
          id: result.device._id,
          name: result.device.name,
        },
        apiKey: result.apiKey,
        topics: result.topics,
        note: "Store this API key securely. It will not be shown again.",
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Device already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
  }

  async list(req, res) {
    const devices = await deviceService.listDevices(req.user.id);
    res.json({ success: true, data: devices });
  }

  async rotateKey(req, res) {
    const { deviceId } = req.params;

    try {
      const result = await deviceService.rotateApiKey({
        deviceId,
        user: req.user,
      });

      return res.json({
        success: true,
        apiKey: result.apiKey,
        note: "Store this key securely. It will not be shown again.",
      });
    } catch (err) {
      const status =
        err.message === "Unauthorized"
          ? 403
          : err.message === "Device not found"
            ? 404
            : 400;

      return res.status(status).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new DeviceController();
