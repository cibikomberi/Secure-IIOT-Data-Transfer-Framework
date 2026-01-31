// repositories/mqttUser.repository.js
const MqttUser = require("../models/MqttUser");

class MqttUserRepository {
  create(data) {
    return MqttUser.create(data);
  }
  
  updatePassword(username, password) {
    return MqttUser.updateOne(
      { username },
      { $set: { password } }
    );
  }
}

module.exports = new MqttUserRepository();
