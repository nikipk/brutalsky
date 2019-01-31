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
}

module.exports = Lobby;
