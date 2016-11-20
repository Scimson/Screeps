function Task(name) {
    this.name = name;
}

// Functionality Methods

Task.prototype.initialize = function(mem) {
    if (!(this.name in mem)) {
        console.log("Initialize Task Memory:", this.name)
        mem[this.name] = new Object();
    }
    this.memory = mem[this.name];
    if (!("tasks" in this.memory)) {
        (
            this.memory.tasks = new Object());
    }
    if (!("assigned" in this.memory)) {
        this.memory.assigned = [];
    }
    if (!("unassigned" in this.memory)) {
        this.memory.unassigned = [];
    }
};

Task.prototype.createTask = function(id, target) {
    if (!(id in this.memory.tasks)) {
        var task = {
            id: id,
            creep: null,
            step: this.name,
            nextStep: null,
            target: target
        }
        this.memory.tasks[id] = task;
        this.memory.unassigned.push(id);
    }
};

Task.prototype.assign = function(caste) {
    var unassigned = [];
    for (var index in this.memory.unassigned) {
        var taskId = this.memory.unassigned[index];
        if (!(taskId in this.memory.tasks)) {
            continue;
        }
        var task = this.memory.tasks[taskId];
        var creepName = caste.acquire();
        if (creepName) {
            var creep = Game.creeps[creepName];
            creep.memory.task = this.name;
            task.creep = creepName;
            this.memory.assigned.push(taskId);
        } else {
            unassigned.push(taskId);
        }
    }
    this.memory.unassigned = unassigned;
};

Task.prototype.organize = function(ids) {
    for (var taskId in this.memory.tasks) {
        if (!(taskId in ids)) {
            var task = this.memory.tasks[taskId];
            var creep = null;
            if (task.creep in Game.creeps) {
                creep = Game.creeps[task.creep];
            }
            this.complete(task, creep);
            delete this.memory.tasks[taskId];
        }
    }
    var assigned = [];
    for (var index in this.memory.assigned) {
        var taskId = this.memory.assigned[index];
        if (!(taskId in this.memory.tasks)) {
            continue;
        }
        var task = this.memory.tasks[taskId];
        if (task.creep == null || !(task.creep in Game.creeps) || task.step == null) {
            if (task.creep != null && task.creep in Game.creeps) {
                Game.creeps[task.creep].memory.task = null;
            }
            task.creep = null;
            task.step = this.name;
            this.memory.unassigned.push(taskId);
        } else {
            assigned.push(taskId)
        }
    }
    this.memory.assigned = assigned;
};

Task.prototype.executeAll = function() {
    for (var index in this.memory.assigned) {
        var taskId = this.memory.assigned[index];
        var task = this.memory.tasks[taskId];
        var creep = Game.creeps[task.creep];
        this[task.step](task, creep);
    }
};

Task.prototype.complete = function(task, creep) {
    if (task) {
        task.step = null;
        task.creep = null;
    }
    if (creep) {
        creep.memory.task = null;
    }
};

Task.prototype.nextStep = function(task, creep, nextStep) {
    this.next(task, creep, task.nextStep, nextStep);
};

Task.prototype.next = function(task, creep, step, nextStep) {
    if (step == undefined || step == null) {
        return this.complete(task, creep);
    }
    if (nextStep) {
        task.nextStep = nextStep;
    }
    task.step = step;
    this[task.step](task, creep);
};

// Shared Actions Methods

Task.prototype.gather = function(task, creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        var depots = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                    _.sum(structure.store) > 0;
            }
        });
        if (depots.length == 0) {
            depots = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION);
                }
            });
        }
        if (depots.length > 0) {
            var target = creep.pos.findClosestByPath(depots);
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    } else {
        this.nextStep(task, creep);
    }
};

Task.prototype.deposit = function(task, creep) {
    if (creep.carry.energy > 0) {
        var depots = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });
        if (depots.length == 0) {
            depots = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        _.sum(structure.store) < structure.storeCapacity;
                }
            });
        }
        if (depots.length == 0) {
            depots = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE ||
                        structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN;
                }
            });
        }
        if (depots.length > 0) {
            var target = creep.pos.findClosestByPath(depots);
            var result = creep.transfer(target, RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (result == ERR_FULL) {
                this.next(task, creep, "upgradeController");
            }
        } else {
            this.next(task, creep, "upgradeController");
        }
    } else {
        this.nextStep(task, creep);
    }
};

Task.prototype.upgradeController = function(task, creep) {
    if (creep.carry.energy > 0) {
        var controllers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTROLLER;
            }
        });
        if (controllers.length > 0) {
            if (creep.transfer(controllers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controllers[0]);
            }
        }
    } else {
        this.nextStep(task, creep);
    }
};

module.exports = Task;
