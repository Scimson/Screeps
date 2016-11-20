var Task = require("task");
var helper = require("helper");

function BuildTask() {
    Task.call(this, "build");
};

BuildTask.prototype = Object.create(Task.prototype);
BuildTask.prototype.constructor = BuildTask;

BuildTask.prototype.plan = function(ids) {
    ids[this.name] = new Object();
    var rooms = helper.getRooms();
    var count = 0;
    for (var roomName in rooms) {
        var room = rooms[roomName];
        var sites = room.find(FIND_CONSTRUCTION_SITES);
        for (var index in sites) {
            if (count > 3) {
                break;
            }
            var site = sites[index];
            for (var i = 0; i < 1; i++) {
                if (++count > 3) {
                    break;
                }
                var id = site.id + "-" + i;
                this.createTask(id, site.id);
                ids[this.name][id] = null;
            }
        }
    }
    return count;
};

BuildTask.prototype.build = function(task, creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        this.next(task, creep, "gather", "construct");
    } else {
        this.next(task, creep, "construct");
    }
};

BuildTask.prototype.construct = function(task, creep) {
    var target = Game.getObjectById(task.target);
    if (target.progress == target.progressTotal) {
        this.complete(task, creep);
    } else if (creep.carry.energy > 0) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        this.complete(task, creep);
    }
};

module.exports = BuildTask;
