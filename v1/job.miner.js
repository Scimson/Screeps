var minerJob = {
  work: function(creep){
    if(creep.carry.energy < creep.carryCapacity){
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
        creep.moveTo(sources[0]);
      }
    }

    else{
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
    }
  }
}

module.exports = minerJob;