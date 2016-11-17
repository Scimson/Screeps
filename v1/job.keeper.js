var keeperJob = {
  work: function(creep){
    if(creep.carry.energy == 0){
      var depots = creep.room.find(FIND_STRUCTURES,{
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy > 0;
        }
      });
      if(creep.withdraw(depots[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
        creep.moveTo(depots[0]);
      }
    }

    else{
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
  }
}

module.exports = keeperJob;
