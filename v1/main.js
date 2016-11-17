var minerJob = require("job.miner");
var keeperJob = require("job.keeper");
var helper = require("helper")

var minerCapacity = 2;
var keeperCapacity = 1;

module.exports.loop = function () {
  helper.clearCreeps()

  if(helper.getMiners().length < minerCapacity){
    console.log('Not enough Miners')
    helper.createMiner()
  }

  if(helper.getKeepers().length < keeperCapacity){
    console.log('Not enough Keepers')
    helper.createKeeper()
  }

  for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    if(creep.memory.job == "miner") {
      minerJob.work(creep);
    }
    else if(creep.memory.job == "keeper") {
      keeperJob.work(creep);
    }
  }

}
