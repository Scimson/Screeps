var Task = require("task");
var helper = require("helper");

function MineTask() {
    Task.call(this, "mine");
};

MineTask.prototype = Object.create(Task.prototype);
MineTask.prototype.constructor = MineTask;

MineTask.prototype.plan = function(ids) {
    ids[this.name] = new Object();
    var rooms = helper.getRooms();
    var count = 0;
    for (var roomName in rooms) {
        var room = rooms[roomName];
        var sources = room.find(FIND_SOURCES).slice(0, 2);
        for (var index in sources) {
            var source = sources[index];
            for (var i = 0; i < 6; i++) {
                count++;
                var id = source.id + "-" + i;
                this.createTask(id, source.id);
                ids[this.name][id] = null;
            }
        }
    }
    return count;
};

MineTask.prototype.mine = function(task, creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        var target = Game.getObjectById(task.target);
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        this.next(task, creep, "deposit", "complete");
    }
};

module.exports = MineTask;
