var Task = require("task");
var helper = require("helper");

function RepairTask() {
    Task.call(this, "repair");
};

RepairTask.prototype = Object.create(Task.prototype);
RepairTask.prototype.constructor = RepairTask;

RepairTask.prototype.plan = function(ids) {
    ids[this.name] = new Object();
    if (!("repairs" in Memory)) {
        Memory.repairs = [];
    }
    var rooms = helper.getRooms();
    var count = 0;
    var repairs = [];

    // Check for repair completion
    for (var index in Memory.repairs) {
        var structureId = Memory.repairs[index];
        var structure = Game.getObjectById(structureId);
        if (structure.hits < structure.hitsMax) {
            repairs.push(structureId);
        }
    }
    Memory.repairs = repairs;

    // Find new reparations needed
    for (var roomName in rooms) {
        var room = rooms[roomName];
        var structures = room.find(FIND_STRUCTURES, {
            filter: function(structure) {
                return structure.hits < (structure.hitsMax * 0.8);
            }
        });
        for (var index in structures) {
            var structure = structures[index];
            var repairIndex = Memory.repairs.indexOf(structure.id);
            if (repairIndex == -1) {
                Memory.repairs.push(structure.id);
            }
        }
    }

    // Create Tasks
    for (var index in Memory.repairs) {
        if (count > 3) {
            break;
        }
        var structureId = Memory.repairs[index];
        for (var i = 0; i < 1; i++) {
            if (++count > 3) {
                break;
            }
            var id = structureId + "-" + i;
            this.createTask(id, structureId);
            ids[this.name][id] = null;
        }
    }

    return count;
};

RepairTask.prototype.repair = function(task, creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        this.next(task, creep, "gather", "mend");
    } else {
        this.next(task, creep, "mend");
    }
};

RepairTask.prototype.mend = function(task, creep) {
    var target = Game.getObjectById(task.target);
    if (target.hits == target.hitsMax) {
        this.complete(task, creep);
    } else if (creep.carry.energy > 0) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        this.complete(task, creep);
    }
};

module.exports = RepairTask;
