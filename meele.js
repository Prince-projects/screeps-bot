/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('meele');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function (creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (creep.pos.getRangeTo(Game.spawns['Spawn1']) > 10 && !target) {
            creep.moveTo(Game.spawns["Spawn1"].pos.x - 5, Game.spawns["Spawn1"].pos.y - 5)
        }
        if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};