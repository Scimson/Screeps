var helper = {

    findSpawn: function(body) {
        for (var name in Game.spawns) {
            var spawn = Game.spawns[name];
            if (spawn.canCreateCreep(body) == OK) {
                return spawn;
            }
        }
        return false;
    },

    getRooms: function() {
        var rooms = [];
        for (var spawnName in Game.spawns) {
            var spawn = Game.spawns[spawnName];
            var index = rooms.indexOf(spawn.room.name)
            if (index == -1) {
                rooms.push(spawn.room.name);
            }
        }
        return rooms.map(function(name) {
            return Game.rooms[name];
        });
    }
}

module.exports = helper;
