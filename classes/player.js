class Player {
  constructor(ID, x, y) {
    const Point = require("./point.js");
    const Vector = require("./vector.js");
    this.ID = ID;
    this.position = new Point(x, y);
    this.velocity = new Vector(0, 0, 0, 0);
  }
}
module.exports = Player;
