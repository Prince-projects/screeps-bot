/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function (creep) {
        creep.say('Estorer')
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 && Game.spawns["Spawn1"].store.getUsedCapacity(RESOURCE_ENERGY) == Game.spawns["Spawn1"].store.getCapacity(RESOURCE_ENERGY)) {
            creep.moveTo(Game.spawns['Spawn1'])
            creep.withdraw(Game.spawns['Spawn1'], RESOURCE_ENERGY)
        }
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY) && creep.pos.findClosestByRange(FIND_STRUCTURES) == 0) {
            const target = creep.pos.findClosestByRange(FIND_STRUCTURES);
            if (target) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= creep.store.getCapacity(RESOURCE_ENERGY) && !creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            const targetSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (targetSite) {
                if (creep.build(targetSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetSite);
                }
            }
        }

    }
};