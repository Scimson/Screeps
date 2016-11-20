var CASTES = "castes";
var generalistCaste = require("caste.generalists");

var creepsManager = {

  mem: Memory,

  initialize: function(){
    if(!(CASTES in Memory)){
      Memory[CASTES] = new Object();
    }
    generalistCaste.initialize(Memory[CASTES]);
  },

  getCaste: function(){
    return generalistCaste;
  },

  operate: function(){
  //  this.clear();
    this.organize();
    this.create();
    //this.assign();
    //this.work();
  },

  create: function(){
    if(generalistCaste.size() < 18){
      generalistCaste.create();
    }
  },

  organize: function(){
    generalistCaste.organize();
  },

  assign: function(){
    generalistCaste.assign("mine");
  },

  work: function(){
    generalistCaste.work();
  },

  clear: function(){
    generalistCaste.clear();
  }
}

module.exports = creepsManager;
