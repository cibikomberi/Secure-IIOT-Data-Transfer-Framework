const mqtt = require("mqtt");
const { handleMessage } = require("./handlers");

const mqttConnectionOptions = {
  clientId: process.env.MQTT_USERNAME,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};
const client = mqtt.connect(process.env.MQTT_URL, mqttConnectionOptions);

client.on("connect", () => {
  console.log("MQTT broker connected");
  client.subscribe("#");
});

client.on("message", handleMessage);

module.exports = client;
