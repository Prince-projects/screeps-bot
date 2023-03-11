/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('attack');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function (creep) {
        var attackNow = true
        const targetStruct = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        creep.say("humngry", true)
        if (creep.pos.getRangeTo(Game.spawns['Spawn1']) < 5) {
            creep.moveTo(0, 0)
        }

        if (target && creep.room.name == "W1N3") {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        if (!target && creep.room.name == "W1N3") {
            if (targetStruct) {
                if (creep.attack(targetStruct) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetStruct);
                }
            }
        }
        if (attackNow) {
            const route = Game.map.findRoute(creep.room, "W1N3");
            if (route.length > 0) {
                console.log('Now heading to room ' + route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }
        }
    }
};