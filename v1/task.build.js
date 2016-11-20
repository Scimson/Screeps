var buildTask = {

  name: "build",

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
        step: "build",
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
        task.step = "build";
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

  build: function(task, creep){
    var target = Game.getObjectById(task.target);
    if(target.progress == target.progressTotal){
      this.complete(task, creep);
    }
    else if(creep.carry.energy > 0){

      if(creep.build(target) == ERR_NOT_IN_RANGE){
        creep.moveTo(target);
      }
    }
    else{
      task.step = "gather";
      this.gather(task, creep);
    }
  },

  gather: function(task, creep){
    if(creep.carry.energy < creep.carryCapacity){
      var depots = creep.room.find(FIND_STRUCTURES,{
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy > 210;
        }
      });
      if(depots.length > 0){
        var target = creep.pos.findClosestByPath(depots);
        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
          creep.moveTo(target);
        }
    }
    }
    else{
      task.step = "build";
      this.build(task, creep);
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

module.exports = buildTask;
