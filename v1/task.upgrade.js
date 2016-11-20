var Task = require("task");
var helper = require("helper");

function UpgradeTask() {
    Task.call(this, "upgrade");
};

UpgradeTask.prototype = Object.create(Task.prototype);
UpgradeTask.prototype.constructor = UpgradeTask;

UpgradeTask.prototype.plan = function(ids) {
    ids[this.name] = new Object();
    var rooms = helper.getRooms();
    var controllers = rooms.map(function(room) {
        return room.controller;
    });
    var count = 0;
    for (var index in controllers) {
        var controller = controllers[index];
        for (var i = 0; i < 1; i++) {
            count++;
            var id = controller.id + "-" + i;
            this.createTask(id, controller.id);
            ids[this.name][id] = null;
        }
    }
    return count;
};


UpgradeTask.prototype.upgrade = function(task, creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        this.next(task, creep, "gather", "upgrade");
    } else {
        this.next(task, creep, "upgradeController", "complete");
    }
};

module.exports = UpgradeTask;
