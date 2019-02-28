class Lobby {
  constructor(name) {
    this.name = name;
    this.players = [];
    this.cookies = 0;
  }
  containsPlayer(playerID) {
    let found = false;
    this.players.forEach(player => {
      if (player.ID == playerID) {
        found = true;
      }
    });
    return found;
  }
  removePlayer(playerID) {
    let index;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].ID == playerID) {
        index = i;
      }
    }
    this.players.splice(index, 1);
  }
}

module.exports = Lobby;
