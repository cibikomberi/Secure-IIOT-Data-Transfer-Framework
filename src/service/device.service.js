// services/device.service.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const deviceRepository = require("../repository/device.repository");
const mqttUserRepository = require("../repository/mqttUser.repository");
const mongoose = require("mongoose");
const mqtt = require("mqtt");

const SALT_ROUNDS = 10;

class DeviceService {
  async createDevice({ name, user }) {
    // 1️⃣ Create device
    const device = await deviceRepository.create({
      name,
      owner: user.id,
    });

    // 2️⃣ Generate API key (only shown once)
    const apiKey = crypto.randomBytes(32).toString("hex");
    const hashedKey = await bcrypt.hash(apiKey, SALT_ROUNDS);

    // 3️⃣ Topics

    const acls = [
      {
        topic: `${device._id}/up/+`, // device → backend
        acc: 2, // write
      },
      {
        topic: `${device._id}/down/+`, // backend → device
        acc: 1, // read
      },
    ];

    // 4️⃣ MQTT user
    await mqttUserRepository.create({
      username: device._id.toString(),
      password: hashedKey,
      enabled: true,
      superuser: false,
      acls,
    });

    return {
      device,
      apiKey, // 🔥 return ONLY ONCE
      topics: {
        write: `${device._id}/up/+`,
        read: `${device._id}/down/+`,
      },
    };
  }

  async listDevices(userId) {
    return deviceRepository.findByOwner(userId);
  }

  async rotateApiKey({ deviceId, user }) {
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new Error("Invalid device id");
    }

    const device = await deviceRepository.findById(deviceId);
    if (!device) {
      throw new Error("Device not found");
    }

    // 🔐 ownership check
    if (device.owner.toString() !== user.id.toString()) {
      throw new Error("Unauthorized");
    }

    // 🔑 generate new key
    const newApiKey = crypto.randomBytes(32).toString("hex");
    const hashedKey = await bcrypt.hash(newApiKey, SALT_ROUNDS);

    // ♻️ update MQTT credentials
    await mqttUserRepository.updatePassword(device._id.toString(), hashedKey);

    // 📡 force disconnect existing session
    this.disconnectDevice(device._id.toString(), newApiKey);

    return {
      apiKey: newApiKey,
    };
  }

  disconnectDevice(deviceId, apiKey) {
    const mqttConnectionOptions = {
      username: deviceId,
      password: apiKey,
      clientId: deviceId,
    };
    const client = mqtt.connect(process.env.MQTT_URL, mqttConnectionOptions);
    client.on("connect", () => {
      client.end(true); // disconnect immediately
    });
    // client.end(true);
  }
}

module.exports = new DeviceService();
