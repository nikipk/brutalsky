const express = require("express");
const socket = require("socket.io");
const LobbyManager = require("./classes/lobbyManager.js");
const Player = require("./classes/player.js");

const app = express();
app.use(express.static("public"));
const ip = "192.168.1.107";
const port = 6868;
const server = app.listen(port, ip);
const io = socket(server);
console.log("running on: http://" + ip + ":" + port);

let lobbyManager = new LobbyManager(2);

lobbyManager.createNewLobby("mainHub");

io.on("connection", socket => {
  console.log("New connection: ", socket.id);

  socket.on("join", lobby => {
    if (lobbyManager.lobbyExists(lobby) && !lobbyManager.lobbyFull(lobby)) {
      socket.join(lobby);
      lobbyManager.addPlayerToLobby(new Player(socket.id, 0, 0), lobby);
      console.log("joined lobby:", lobby);
    } else {
      lobbyManager.createNewLobby(socket.id);
      console.log("new lobby:", socket.id);
      socket.join(socket.id);
      lobbyManager.addPlayerToLobby(new Player(socket.id, 0, 0), socket.id);
      console.log("joined lobby:", socket.id);
    }
  });

  socket.on("cookies", () => {
    let playerLobby = lobbyManager.getPlayerLobby(socket.id);
    playerLobby.cookies++;
    console.log(lobbyManager);
    io.to(playerLobby.name).emit("cookies", playerLobby.cookies);
  });

  socket.on("disconnect", () => {
    console.log("disconnected!");
    socket.disconnect();
  });
});
