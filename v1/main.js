var creepManager = require("manager.creeps");

module.exports.loop = function () {
  creepManager.initialize();
  creepManager.operate();
}
