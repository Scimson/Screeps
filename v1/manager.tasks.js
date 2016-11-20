var mineTask = require("task.mine");
var buildTask = require("task.build");
var taskList = [mineTask, buildTask];

var creepManager = require("manager.creeps");

var taskManager = {
  initialize: function(){
    if(!("jobs" in Memory)){
      Memory.jobs = new Object();
    }
    for(var task in taskList){
      taskList[task].initialize(Memory.jobs);
    }
  },

  plan: function(){
    var ids = new Object();

    // Mine Task
    ids[mineTask.name] = new Object()
    var sources = Game.spawns.Spawn1.room.find(FIND_SOURCES).slice(0,2);
    for(var index in sources){
      var source = sources[index];
      for(var i = 0; i < 6; i++){
        var id = source.id + "-" + i;
        mineTask.createTask(id, source.id);
        ids[mineTask.name][id] = null;
      }
    }

    // Build Task
    ids[buildTask.name] = new Object()
    var sites = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES);
    for(var index in sites){
      var site = sites[index];
      for(var i = 0; i < 1; i++){
        var id = site.id + "-" + i;
        buildTask.createTask(id, site.id);
        ids[buildTask.name][id] = null;
      }
    }

    // Return
    return ids;
  },

  execute: function(){
    var ids = this.plan();
    for(var index in taskList){
      var task = taskList[index];
      task.organize(ids[task.name]);
    }
    for(var index in taskList){
      var task = taskList[index];
      task.assign(creepManager.getCaste());
    }
    for(var index in taskList){
      var task = taskList[index];
      task.executeAll();
    }
  }
}

module.exports = taskManager;
