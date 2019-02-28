class Level {
  constructor(name) {
    this.name = name;
    this.blocks = [];
  }
  addBlock(block) {
    this.blocks.push(block);
  }
}
module.exports = Level;
