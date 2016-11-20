var creepManager = require("manager.creeps");
var taskManager = require("manager.tasks");

module.exports.loop = function() {
    creepManager.initialize();
    taskManager.initialize();
    creepManager.operate();
    taskManager.execute();
}
