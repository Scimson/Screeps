var mineTask = {

  name: "mine",

  initialize: function(mem){
    if(!(this.name in mem)){
      console.log("Initialize Task Memory:", this.name)
      mem[this.name] = new Object();
    }
    this.memory = mem[this.name];
    if(!("tasks" in this.memory)){(
      this.memory.tasks = new Object());
    }
    if(!("assigned" in this.memory)){
      this.memory.assigned = [];
    }
    if(!("unassigned" in this.memory)){
      this.memory.unassigned = [];
    }
  },

  createTask: function(id, target){
    if(!(id in this.memory.tasks)){
      var task = {
        id: id,
        creep: null,
        step: "mine",
        target: target
      }
      this.memory.tasks[id] = task;
      this.memory.unassigned.push(id);
    }
  },

  assign: function(caste){
    var unassigned = [];
    for(var index in this.memory.unassigned){
      var taskId = this.memory.unassigned[index];
      if (!(taskId in this.memory.tasks)){
        continue;
      }
      var task = this.memory.tasks[taskId];
      var creepName = caste.acquire();
      if(creepName){
        var creep = Game.creeps[creepName];
        creep.memory.task = this.name;
        task.creep = creepName;
        this.memory.assigned.push(taskId);
      }
      else{
        unassigned.push(taskId);
      }
    }
    this.memory.unassigned = unassigned;
  },

  organize: function(ids){
    for(var taskId in this.memory.tasks){
      if(!(taskId in ids)){
        var task = this.memory.tasks[taskId];
        var creep = null;
        if(task.creep in Game.creeps){
          creep = Game.creeps[task.creep];
        }
        this.complete(task, creep);
        delete this.memory.tasks[taskId];
      }
    }
    var assigned = [];
    for(var index in this.memory.assigned){
      var taskId = this.memory.assigned[index];
      if (!(taskId in this.memory.tasks)){
        continue;
      }
      var task = this.memory.tasks[taskId];
      if(task.creep == null || !(task.creep in Game.creeps) || task.step == null){
        if(task.creep != null && task.creep in Game.creeps){
          Game.creeps[task.creep].memory.task = null;
        }
        task.creep = null;
        task.step = "mine";
        this.memory.unassigned.push(taskId);
      }
      else{
        assigned.push(taskId)
      }
    }
    this.memory.assigned = assigned;
  },

  executeAll: function(){
    for(var index in this.memory.assigned){
      var taskId = this.memory.assigned[index];
      var task = this.memory.tasks[taskId];
      var creep = Game.creeps[task.creep];
      this[task.step](task, creep);
    }
  },

  mine: function(task, creep){
    if(creep.carry.energy < creep.carryCapacity){
      var target = Game.getObjectById(task.target);
      if(creep.harvest(target) == ERR_NOT_IN_RANGE){
        creep.moveTo(target);
      }
    }
    else{
      task.step = "deposit";
      this.deposit(task, creep);
    }
  },

  deposit: function(task, creep){
    if(creep.carry.energy > 0){
      var depots = creep.room.find(FIND_STRUCTURES,{
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity;
        }
      });
      if(depots.length > 0){
        var target = creep.pos.findClosestByPath(depots);
        var result = creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE){
          creep.moveTo(target);
        }
        else if(result == ERR_FULL){
          task.step = "upgrade";
          this.upgrade(task, creep);
        }
      }
      else{
        var depots = creep.room.find(FIND_STRUCTURES,{
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN);
          }
        });
        if(depots.length > 0){
          var target = creep.pos.findClosestByPath(depots);
          var result = creep.transfer(target, RESOURCE_ENERGY);
          if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(target);
          }
          else if(result == ERR_FULL){
            task.step = "upgrade";
            this.upgrade(task, creep);
          }
        }
        else{
            task.step = "upgrade";
            this.upgrade(task, creep);
        }
      }
    }
    else{
      this.complete(task, creep);
    }
  },

  upgrade: function(task, creep){
    if(creep.carry.energy > 0){
      var controllers = creep.room.find(FIND_STRUCTURES,{
        filter: (structure) => {
          return structure.structureType == STRUCTURE_CONTROLLER;
        }
      });
      if(controllers.length > 0){
        if(creep.transfer(controllers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
          creep.moveTo(controllers[0]);
        }
      }
    }
    else{
      this.complete(task, creep);
    }
  },

  complete: function(task, creep){
    if(task){
      task.step = null;
      task.creep = null;
    }
    if(creep){
      creep.memory.task = null;
    }
  }
}

module.exports = mineTask;
