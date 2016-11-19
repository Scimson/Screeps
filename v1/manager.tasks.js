var taskManager = {
  initialize: function(){

  },

  collect: function(creep){
    if(creep.carry.energy < creep.carryCapacity){
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
        creep.moveTo(sources[0]);
      }
    }
    else{
      creep.memory.task = "deposit";
      this.deposit(creep);
    }
  },

  deposit: function(creep){
    if(creep.carry.energy > 0){
      var depots = creep.room.find(FIND_STRUCTURES,{
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity;
        }
      });
      if(depots.length > 0){
        if(creep.transfer(depots[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
          creep.moveTo(depots[0]);
        }
      }
      else{
          creep.memory.task = "upgrade";
          this.upgrade(creep);
      }
    }
    else{
      creep.memory.task = null;
    }
  },

  upgrade: function(creep){
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
      creep.memory.task = null;  
    }
  },

  mine: function(creep){
    if(creep.carry.energy < creep.carryCapacity){
      creep.memory.task = "collect";
      this.collect(creep);
    }
    else{
      creep.memory.task = "deposit";
      this.deposit(creep);
    }
  },

}

module.exports = taskManager;
