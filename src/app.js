const express = require("express");
const deviceRoutes = require("./routes/device.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);

module.exports = app;
