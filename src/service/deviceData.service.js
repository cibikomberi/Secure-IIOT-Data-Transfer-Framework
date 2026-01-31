const mongoose = require("mongoose");
const deviceDataRepository = require("../repository/deviceData.repository");

class DeviceDataService {
  async handleMessage(topic, payload) {
    /**
     * topic format:
     * <deviceId>/up/<key>
     */
    const parts = topic.split("/");

    // basic guard
    if (parts.length < 3 || parts[1] !== "up") {
      return; // ignore unrelated topics
    }

    const deviceId = parts[0];
    const key = parts.slice(2).join("/"); // supports nested keys if needed

    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      return;
    }

    // encrypted payload → store directly
    const value =
      Buffer.isBuffer(payload) ? payload.toString("utf8") : String(payload);

    await deviceDataRepository.create({
      device: deviceId,
      key,
      value,
    });
  }
}

module.exports = new DeviceDataService();
