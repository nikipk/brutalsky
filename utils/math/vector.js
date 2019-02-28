class Vector {
  constructor(tailX, tailY, headX, headY) {
    const Point = require("../math/point.js");
    this.head = new Point(headX, headY);
    this.tail = new Point(tailX, tailY);
  }
  getLength() {
    let dx = this.head.x - this.tail.x;
    let dy = this.head.y - this.tail.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  setLength(newLength) {
    let length = this.getLength();
    this.head.x = (this.head.x / length) * newLength;
    this.head.y = (this.head.y / length) * newLength;
  }
  getAngle() {
    return Math.atan2(head.y - tail.y, head.x - tail.x);
  }
  setAngle(newAngle) {
    this.head.x =
      Math.cos(newAngle) * this.tail.x - Math.sin(newAngle) * this.head.x;
    this.head.y =
      Math.sin(newAngle) * this.tail.y + Math.cos(newAngle) * this.head.y;
  }
  add(newVector) {
    let dx = newVector.head.x - newVector.tail.x;
    let dy = newVector.head.y - newVector.tail.y;
    return new Vector(
      this.tail.x,
      this.tail.y,
      this.head.x + dx,
      this.head.y + dy
    );
  }
  subtract(newVector) {
    let dx = newVector.head.x - newVector.tail.x;
    let dy = newVector.head.y - newVector.tail.y;
    return new Vector(
      this.tail.x,
      this.tail.y,
      this.head.x - dx,
      this.head.y - dy
    );
  }
  multiply(factor) {
    return new Vector(
      this.tail.x,
      this.tail.y,
      this.head.x * factor,
      this.head.y * factor
    );
  }
  divide(divisor) {
    return new Vector(
      this.tail.x,
      this.tail.y,
      this.head.x / divisor,
      this.head.y / divisor
    );
  }
  addTo(newVector) {
    let dx = newVector.head.x - newVector.tail.x;
    let dy = newVector.head.y - newVector.tail.y;
    this.head.x += dx;
    this.head.y += dy;
  }
  subtractFrom(newVector) {
    let dx = newVector.head.x - newVector.tail.x;
    let dy = newVector.head.y - newVector.tail.y;
    this.head.x -= dx;
    this.head.y -= dy;
  }
  multiplyBy(factor) {
    this.head.x *= factor;
    this.head.y *= factor;
  }
  divideBy(divisor) {
    this.head.x /= divisor;
    this.head.y /= divisor;
  }
}
module.exports = Vector;
