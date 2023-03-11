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
        var resourceIndex = Math.floor(Math.random() * allResources.length)
        var spawnsFull = false
        if (allResources.length >= 1) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= creep.store.getCapacity(RESOURCE_ENERGY)) {
                target = allResources[resourceIndex];  // If resource on the ground, pickup
                if (creep.memory.resourceTargetID == undefined) {
                    creep.memory.resourceTargetID = target.id;
                }
                if (allResources.length > 0) {
                    target_source = Game.getObjectById(creep.memory.resourceTargetID)
                }
                if (target_source == null) {
                    creep.memory.resourceTargetID = target.id;
                }
                creep.moveTo(target_source)
                if (creep.pickup(target_source) == ERR_NOT_IN_RANGE && !creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.moveTo(target_source)
                }
            }
        }
        for (i in Game.spawns) {
            if (Game.spawns[i].store.getFreeCapacity(RESOURCE_ENERGY) == 0) // Check if spawn is full
                var spawnsFull = true
        }
        const targetExtend = creep.room.find(FIND_STRUCTURES, {
            filter: (extendFull) => {
                return (extendFull.structureType == STRUCTURE_EXTENSION) && extendFull.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        });
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && targetExtend.length > 0) { // If full, fill extensions
            targetIndex = Math.floor(Math.random() * targetExtend.length)
            targetExtendValue = targetExtend[targetIndex]
            if (creep.memory.extendTargetID == undefined) {
                creep.memory.extendTargetID = targetExtendValue.id;
            }
            if (!targetExtend.includes(creep.memory.extendTargetID)) {
                creep.memory.extendTargetID = targetExtendValue.id;
            }
            if (targetExtend.length > 0) {
                target_extend = Game.getObjectById(creep.memory.extendTargetID)
            }
            if (target_extend == null) {
                creep.memory.extendTargetID = targetExtendValue.id;
            }
            creep.moveTo(target_extend)
            creep.transfer(target_extend, RESOURCE_ENERGY)
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