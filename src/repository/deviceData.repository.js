const DeviceData = require("../models/DeviceData");

class DeviceDataRepository {
  create(data) {
    return DeviceData.create(data);
  }
}

module.exports = new DeviceDataRepository();
