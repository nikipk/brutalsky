const express = require("express");
const socket = require("socket.io");
const app = express();
app.use(express.static("public"));
const server = app.listen(6969, "192.168.107.196");
const io = socket(server);
console.log("started");

io.on("connection", socket => {
  console.log("New connection: ", socket.handshake.address);
});
