require("dotenv").config();
const http = require("http");
const app = require("./app");
const initSocket = require("./websocket/socket");
require("./mqtt/client");
const connectDB = require("./config/db");

connectDB()
const server = http.createServer(app);
initSocket(server);

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
