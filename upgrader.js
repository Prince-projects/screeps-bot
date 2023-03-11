/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('upgrader');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function (creep) {
        const targetController = Game.spawns["Spawn1"].room.controller;
        const spawn = Game.spawns["Spawn1"];
        const targetExtend = creep.room.find(FIND_STRUCTURES, {
            filter: (extendFull) => {
                return (extendFull.structureType == STRUCTURE_EXTENSION) && extendFull.store.getUsedCapacity(RESOURCE_ENERGY) == 50
            }
        });
        if (targetController.FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } } < 1); {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
                creep.moveTo(spawn)
                creep.withdraw(spawn, RESOURCE_ENERGY)
            }
        }
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.moveTo(targetExtend[0])
            creep.withdraw(targetExtend[0], RESOURCE_ENERGY)
        }
        if (creep.store.getFreeCapacity() < creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.moveTo(targetController)
            creep.upgradeController(targetController)
        }
    }
};