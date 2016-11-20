var taskList = [
    new(require("task.upgrade"))(),
    new(require("task.mine"))(),
    new(require("task.repair"))(),
    new(require("task.build"))()
];

var creepManager = require("manager.creeps");

var taskManager = {
    initialize: function() {
        if (!("jobs" in Memory)) {
            Memory.jobs = new Object();
        }
        for (var task in taskList) {
            taskList[task].initialize(Memory.jobs);
        }
    },

    plan: function() {
        var ids = new Object();
        for (var index in taskList) {
            var task = taskList[index];
            task.plan(ids);
        }
        return ids;
    },

    execute: function() {
        var ids = this.plan();
        for (var index in taskList) {
            var task = taskList[index];
            task.organize(ids[task.name]);
        }
        for (var index in taskList) {
            var task = taskList[index];
            task.assign(creepManager.getCaste());
        }
        for (var index in taskList) {
            var task = taskList[index];
            task.executeAll();
        }
    }
}

module.exports = taskManager;
