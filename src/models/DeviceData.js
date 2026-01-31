const mongoose = require("mongoose");

const DeviceDataSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    timeseries: {
      timeField: "createdAt",
    },
  },
);

module.exports = mongoose.model("DeviceData", DeviceDataSchema);
