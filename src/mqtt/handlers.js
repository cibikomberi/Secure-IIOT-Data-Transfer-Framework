const { emitSensorData } = require("../websocket/socket");
const deviceDataService = require("../service/deviceData.service");

async function handleMessage(topic, message) {
  const value = message.toString();
  console.log(topic, message.toString());
  await deviceDataService.handleMessage(topic, message);
  emitSensorData({ value, timestamp: Date.now() });
}

module.exports = { handleMessage };
