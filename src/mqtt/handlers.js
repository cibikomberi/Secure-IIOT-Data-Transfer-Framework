const { emitSensorData } = require("../websocket/socket");
const deviceDataService = require("../service/deviceData.service");
const { decryptMqttPayload } = require("../util/crypto.util")

async function handleMessage(topic, message) {
  const value = message.toString();

  const result = decryptMqttPayload(message);  
  console.log("Decrypted message", result.data.toString()); // Outputting to console for now, need to be replaced with some other logic

  await deviceDataService.handleMessage(topic, message);
  emitSensorData({ value, timestamp: Date.now() });
}

module.exports = { handleMessage };
