const express = require("express");
const socket = require("socket.io");
const LobbyManager = require("./utils/player/lobbyManager.js");
const LevelLoader = require("./utils/map/levelLoader.js");
const Player = require("./utils/player/player.js");

const app = express();
app.use(express.static("public"));
const ip = "192.168.107.196";
const port = 6969;
const server = app.listen(port, ip);
const io = socket(server);
console.log("running on: http://" + ip + ":" + port);

let lobbySize = 2;
let lobbyManager = new LobbyManager(lobbySize);
let levelLoader = new LevelLoader();

console.log(levelLoader);

io.on("connection", socket => {
  console.log("New connection: ", socket.id);
  let player = new Player(socket.id, "Player", 200, 200);
  socket.emit("upd_playerData", player);
  updateLobbyList();
  socket.emit("upd_level", levelLoader.levels[0]);
  socket.on("join", data => {
    let playerLobby = lobbyManager.getPlayerLobby(socket.id);
    if (lobbyManager.lobbyExists(data.lobbyName)) {
      if (playerLobby) {
        if (!lobbyManager.lobbyFull(data.lobbyName)) {
          if (playerLobby.name !== data.lobbyName) {
            lobbyManager.removePlayer(socket.id);
            socket.join(data.lobbyName);
            socket.emit("upd_lobby", data.lobbyName);
            lobbyManager.addPlayerToLobby(player, data.lobbyName);
            socket.emit("upd_playerData", player);
            updateLobbyList();
            console.log("user: ", socket.id, "joined lobby:", data.lobbyName);
            socket.emit(
              "cookies",
              lobbyManager.getPlayerLobby(socket.id).cookies
            );
          } else {
            socket.emit("alert", "You are already in this lobby!");
          }
        } else {
          socket.emit("alert", "This lobby is already full!");
        }
      } else {
        if (!lobbyManager.lobbyFull(data.lobbyName)) {
          socket.join(data.lobbyName);
          socket.emit("upd_lobby", data.lobbyName);
          lobbyManager.addPlayerToLobby(player, data.lobbyName);
          socket.emit("upd_playerData", player);
          updateLobbyList();
          console.log("user: ", socket.id, "joined lobby:", data.lobbyName);
          socket.emit(
            "cookies",
            lobbyManager.getPlayerLobby(socket.id).cookies
          );
        } else {
          socket.emit("alert", "This lobby is already full!");
        }
      }
    } else {
      if (playerLobby) {
        console.log(lobbyManager.lobbies);
        lobbyManager.removePlayer(socket.id);
        updateLobbyList();
        console.log(lobbyManager.lobbies);
      }
      lobbyManager.createNewLobby(data.lobbyName);
      socket.join(data.lobbyName);
      socket.emit("upd_lobby", data.lobbyName);
      lobbyManager.addPlayerToLobby(player, data.lobbyName);
      socket.emit("upd_playerData", player);
      updateLobbyList();
      console.log("user:", socket.id, "joined lobby:", data.lobbyName);
      socket.emit("cookies", lobbyManager.getPlayerLobby(socket.id).cookies);
    }
    console.log(lobbyManager.lobbies[0]);
  });
  socket.on("cookies", () => {
    let playerLobby = lobbyManager.getPlayerLobby(socket.id);
    if (playerLobby) {
      playerLobby.cookies++;
      io.to(playerLobby.name).emit("cookies", playerLobby.cookies);
    } else {
      socket.emit("alert", "You have to join a lobby to collect COOKIES!");
    }
  });
  socket.on("disconnect", () => {
    console.log("disconnected: ", socket.id);
    lobbyManager.removePlayer(socket.id);
    socket.disconnect();
    updateLobbyList();
    console.log(lobbyManager.lobbies);
  });
});

function updateLobbyList() {
  let lobbyList = [];
  lobbyManager.lobbies.forEach(lobby => {
    lobbyList.push({
      name: lobby.name,
      players: lobby.players.length + "/" + lobbyManager.maxNumberPlayers
    });
  });
  io.emit("upd_lobbyList", lobbyList)
}