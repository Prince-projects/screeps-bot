/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('haul');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function (creep) {
        var allResources = creep.room.find(FIND_DROPPED_RESOURCES);
        var resourceAmts = [];
        for (i in allResources) {
            var workingAmnt = allResources[i].amount
            resourceAmts.push(workingAmnt)
        }
        var highestResource = Math.max(...resourceAmts)
        var resourceIndex = resourceAmts.indexOf(highestResource)
        var spawnsFull = false
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= creep.store.getCapacity(RESOURCE_ENERGY)) {
            target = allResources[resourceIndex];  // If resource on the ground, pickup
            creep.moveTo(target)
            if (creep.pickup(target) == ERR_NOT_IN_RANGE && !creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                creep.moveTo(target)
            }
        }
        for (i in Game.spawns) {
            if (Game.spawns[i].store.getFreeCapacity(RESOURCE_ENERGY) == 0) // Check if spawn is full
                var spawnsFull = true
        }
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) { // If full, fill extensions
            const targetExtend = creep.room.find(FIND_STRUCTURES, {
                filter: (extendFull) => {
                    return (extendFull.structureType == STRUCTURE_EXTENSION) && extendFull.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });
            creep.moveTo(targetExtend[0])
            creep.transfer(targetExtend[0], RESOURCE_ENERGY)
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && !spawnsFull) { // If full and spawn not full, fill spawn
                const targetSpawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                creep.moveTo(targetSpawn)
                creep.transfer(targetSpawn, RESOURCE_ENERGY)
            }

            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && spawnsFull && targetExtend.length == 0) { // If full and spawn full, fill storage
                const targetSpawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (extendFull) => {
                        return (extendFull.structureType == STRUCTURE_STORAGE)
                    }
                });
                creep.moveTo(targetSpawn)
                creep.transfer(targetSpawn, RESOURCE_ENERGY)
            }
        }
    }
};