class LobbyManager {
  constructor(maxNumberPlayers) {
    this.maxNumberPlayers = maxNumberPlayers;
    this.lobbies = [];
  }
  /*
  logoutPlayerFromLobby(playerID, playerLobby) {
    console.log("removing player!");
    playerLobby.removePlayer(playerID);
    if (playerLobby.players.length === 0) {
      let index = this.lobbies.indexOf(playerLobby);
      this.lobbies.splice(index, 1);
    }
  }
  */
  createNewLobby(lobbyName) {
    const Lobby = require("./lobby.js");
    this.lobbies.push(new Lobby(lobbyName));
  }
  removePlayer(playerID) {
    this.lobbies.forEach(lobby => {
      if (lobby.containsPlayer(playerID)) {
        lobby.removePlayer(playerID);
        if (lobby.players.length < 1) {
          console.log("removing lobby: ", lobby.name);
          this.removeLobby(lobby.name);
        }
      }
    });
  }
  removeLobby(lobbyName) {
    let index;
    for (let i = 0; i < this.lobbies.length; i++) {
      if (this.lobbies[i].name == lobbyName) {
        index = i;
      }
    }
    this.lobbies.splice(index, 1);
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
    let playerLobby;
    this.lobbies.forEach(lobby => {
      if (lobby.containsPlayer(playerID)) {
        playerLobby = lobby;
      }
    });
    return playerLobby;
  }
  getLobby(lobbyName) {
    let lobbyRes;
    this.lobbies.forEach(lobby => {
      if (lobby.name == lobbyName) {
        lobbyRes = lobby;
      }
    });
    return lobbyRes;
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
