class Player {
  constructor(ID, name, x, y) {
    const Point = require("../math/point.js");
    const Vector = require("../math/vector.js");
    this.ID = ID;
    this.name = name;
    this.position = new Point(x, y);
    this.velocity = new Vector(0, 0, 0, 0);
  }
}
module.exports = Player;
