var helper = require("helper");
//var taskManager = require("manager.tasks");

var generalistsCaste = {

    name: "Generalists",
    capacity: 10,
    GEN: "generation",
    WAITING: "waiting",
    WORKING: "working",
    CREATING: "creating",
    TASK: "task",

    initialize: function(mem) {
        if (!(this.name in mem)) {
            console.log("Initialize caste memory:", this.name)
            mem[this.name] = new Object();
        }
        this.memory = mem[this.name];
        if (!(this.GEN in this.memory)) {
            console.log("Initialize generation:", this.name)
            this.memory[this.GEN] = 0;
        }
        if (!(this.WORKING in this.memory)) {
            console.log("Initialize working:", this.name)
            this.memory[this.WORKING] = [];
        }
        if (!(this.WAITING in this.memory)) {
            console.log("Initialize waiting:", this.name)
            this.memory[this.WAITING] = [];
        }
        if (!(this.CREATING in this.memory)) {
            console.log("Initialize creating:", this.name)
            this.memory[this.CREATING] = [];
        }
    },

    size: function() {
        return this.memory[this.CREATING].length + this.memory[this.WAITING].length + this.memory[this.WORKING].length;
    },

    available: function() {
        return this.memory[this.WAITING].length;
    },

    create: function() {
        var body = [WORK, WORK, CARRY, MOVE]; // Figure out a way to do better on this.
        var spawn = helper.findSpawn(body);
        if (spawn) {
            if (spawn.canCreateCreep(body) == OK) {
                var name = this.name + "-" + this.memory[this.GEN]++;
                console.log("Spawning: ", name)
                spawn.createCreep(body, name, {
                    caste: this.name
                });
                this.memory[this.CREATING].push(name);
            }
        }
    },

    organize: function() {
        this.clearGroup(this.WAITING);
        this.clearGroup(this.WORKING);
        var creating = [];
        for (var index in this.memory[this.CREATING]) {
            var name = this.memory[this.CREATING][index];
            if (name in Game.creeps && Game.creeps[name].spawning) {
                console.log(name, "Still spawning")
                creating.push(name);
            } else if (name in Game.creeps) {
                console.log(name, "Now Ready", this.memory[this.CREATING])
                this.memory[this.WAITING].push(name);
            } else {
                delete Memory.creeps[name];
                console.log("Clearing failed creation creep:", name);
            }
        }
        this.memory[this.CREATING] = creating;
        this.reorganize();
    },

    reorganize: function() {
        var stillWorking = [];
        for (var index in this.memory[this.WORKING]) {
            var name = this.memory[this.WORKING][index];
            var creep = Game.creeps[name];
            if (!(this.TASK in creep.memory) || !(creep.memory[this.TASK])) {
                this.memory[this.WAITING].push(name);
            } else {
                stillWorking.push(name);
            }
        }
        this.memory[this.WORKING] = stillWorking;
    },

    acquire: function() {
        if (this.available() > 0) {
            var name = this.memory[this.WAITING].shift();
            this.memory[this.WORKING].push(name);
            return name;
        }
        return false;
    },

    assign: function(task) {
        if (this.available() > 0) {
            var name = this.memory[this.WAITING].shift();
            Game.creeps[name].memory[this.TASK] = task;
            this.memory[this.WORKING].push(name);
            return true;
        }
        return false;
    },

    localize: function(flagName) {
        if (flagName in Game.flags) {
            var flag = Game.flags[flagName];
            for (var index in this.memory[this.WAITING]) {
                var creepName = this.memory[this.WAITING][index];
                var creep = Game.creeps[creepName];
                creep.moveTo(flag);
            }
        }

    },

    /*work: function(){
      var stillWorking = [];
      for(var index in this.memory[this.WORKING]){
        var name = this.memory[this.WORKING][index];
        console.log(name, "Is working")
        var creep = Game.creeps[name];
        if(!(this.TASK in creep.memory) || !(creep.memory[this.TASK])){
          this.memory[this.WAITING].push(name);
        }
        else{
          var task = creep.memory[this.TASK];
          taskManager[task](creep);
          stillWorking.push(name);
        }
      }
      this.memory[this.WORKING] = stillWorking;
    },*/

    clearGroup: function(group) {
        var alive = [];
        for (var index in this.memory[group]) {
            var name = this.memory[group][index];
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log("Clearing non-existing creep memory:", name);
            } else {
                alive.push(name);
            }
        }
        this.memory[group] = alive;
    },
}

module.exports = generalistsCaste;
