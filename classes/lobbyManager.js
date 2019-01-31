class LobbyManager {
  constructor(maxNumberPlayers) {
    this.maxNumberPlayers = maxNumberPlayers;
    this.lobbies = [];
  }
  createNewLobby(lobbyName) {
    const Lobby = require("./lobby.js");
    this.lobbies.push(new Lobby(lobbyName));
  }
  lobbyFull(lobbyName) {
    let full = true;
    this.lobbies.forEach(lobby => {
      if (lobby.name == lobbyName) {
        if (lobby.players.length < this.maxNumberPlayers) {
          full = false;
        }
      }
    });
    return full;
  }
  addPlayerToLobby(player, lobbyName) {
    this.lobbies.forEach(lobby => {
      if (lobby.name == lobbyName) {
        lobby.players.push(player);
      }
    });
  }
  getPlayerLobby(playerID) {
    let name;
    this.lobbies.forEach(lobby => {
      if (lobby.containsPlayer(playerID)) {
        name = lobby;
      }
    });
    return name;
  }
  lobbyExists(lobbyName) {
    if (this.lobbies.length > 0) {
      for (let i = 0; i < this.lobbies.length; i++) {
        if (this.lobbies[i].name == lobbyName) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }
}
module.exports = LobbyManager;
