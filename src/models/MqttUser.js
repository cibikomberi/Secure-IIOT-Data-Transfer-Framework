const mongoose = require("mongoose");

const MqttUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  superuser: {
    type: Boolean,
    default: false,
  },
  acls: {
    type: [
      {
        topic: {
          type: String,
          required: true,
        },
        acc: {
          type: Number,
          required: true,
          min: 1,
          max: 4,
        },
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("User", MqttUserSchema);
