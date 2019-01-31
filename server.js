const express = require("express");
const socket = require("socket.io");
const app = express();
app.use(express.static("public"));
const ip = "192.168.107.196";
const server = app.listen(6969, ip);
const io = socket(server);
console.log("running on: ", ip);

io.on("connection", socket => {
  console.log("New connection: ", socket.handshake.address);
});
