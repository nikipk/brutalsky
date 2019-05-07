class Player {
  constructor(ID, name, x, y) {
    const Point = require("../math/point.js");
    this.ID = ID;
    this.name = name;
    this.position = new Point(x, y);
    this.animationFrame = 0;
  }
}
module.exports = Player;
