var helper = {
  clearCreeps: function(){
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log("Clearing non-existing creep memory:", name);
      }
    }
  },

  findSpawn: function(body){
    for(var name in Game.spawns){
      var spawn = Game.spawns[name];
      if(spawn.canCreateCreep(body) == OK){
        return spawn;
      }
    }
    return false;
  },

  createMiner: function(){
    var body = [WORK,CARRY,MOVE];
    var spawn = helper.findSpawn(body);
    if(spawn){
      var name = spawn.name + "-Miner-" + spawn.memory["minerGen"]
      spawn.createCreep(body, name, {job: "miner"});
      spawn.memory["minerGen"] += 1;
    }
  },

  getMiners: function(){
    return _.filter(Game.creeps, (creep) => {
        return creep.memory["job"] == "miner";
      }
    );
  },

  createKeeper: function(){
    var body = [WORK,CARRY,MOVE];
    var spawn = helper.findSpawn(body);
    if(spawn){
      if(!("keeperGen" in spawn.memory)){
        spawn.memory["keeperGen"] = 0;
      }
      var name = spawn.name + "-Keeper-" + spawn.memory["keeperGen"]
      spawn.createCreep(body, name, {job: "keeper"});
      spawn.memory["keeperGen"] += 1;
    }
  },

  getKeepers: function(){
    return _.filter(Game.creeps, (creep) => {
        return creep.memory["job"] == "keeper";
      }
    );
  }
}

module.exports = helper;
