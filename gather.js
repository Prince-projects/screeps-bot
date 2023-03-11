/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('gather');
 * mod.thing == 'a thing'; // true
 */
module.exports = {
    run: function (creep) {
        creep.say("Dic")
        const target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE); // Detect sources, start harvesting
        if (target) {
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }

        if (creep.store.getFreeCapacity() == 0) { // drop on groung
            creep.drop(RESOURCE_ENERGY);
        }
    }
};