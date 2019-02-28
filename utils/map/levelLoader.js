class LevelLoader {
  constructor() {
    this.levels = [];
    this.loadLevels();
  }
  loadLevels() {
    const Level = require("./level.js");
    const Block = require("./block.js");
    let startLevel = new Level("startLevel");
    let level1 = new Level("level1");
    let ground = new Block(0, 550, 1000, 50, "grey");
    startLevel.addBlock(ground);
    level1.addBlock(ground);
    this.levels.push(startLevel);
    this.levels.push(level1);
  }
}
module.exports = LevelLoader;
