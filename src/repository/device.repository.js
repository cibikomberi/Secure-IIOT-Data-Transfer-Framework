// repositories/device.repository.js
const Device = require("../models/Device");

class DeviceRepository {
  create(data) {
    return Device.create(data);
  }

  findByOwner(userId) {
    return Device.find({ owner: userId })
      .sort({ createdAt: -1 })
      .select("-__v");
  }
  
  async findById(id) {
      return Device.findById(id);
  }
}

module.exports = new DeviceRepository();
