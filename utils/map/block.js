class Block {
  constructor(x, y, width, height, color) {
    const Point = require("../math/point.js");
    this.position = new Point(x, y);
    this.width = width;
    this.height = height;
    this.color = color;
  }
}
module.exports = Block;
