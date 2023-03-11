
//TODO - Mem cleanup script, iterate and see if alive if not = del memory
// build a central resource storage, change haulers to deposit there if spawn + extension full, upgraders use only that. builders also source from that container.
// Cap out phase @ 10

// Set min amounts
const creepgatherAmount = getMineableSpots(Game.spawns['Spawn1']);
const creephaulAmount = Math.ceil(creepgatherAmount / 1.25);
const creepUpAmount = Math.ceil(creepgatherAmount);
const creepBuildAmount = Math.ceil(creepgatherAmount / 4);
const creepDefAmount = Math.ceil(creepgatherAmount / 4);
const creepAttackAmount = 0;

//Define Vars
var currentGatherCreep = 0;
var currentHaulCreep = 0;
var currentUpCreep = 0;
var currentBuildCreep = 0;
var currentDefCreep = 0;
var currentAttackCreep = 0;
var totalResource = 0;
var storablesArr = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_STORAGE]
var extensionArr = [STRUCTURE_EXTENSION]
var currentCreep = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS).length; // need to be room agnostic
var currentPhase = 0;

// Set basal parts
var gatherParts = [MOVE, WORK, WORK, MOVE]
var haulParts = [MOVE, MOVE, CARRY, CARRY, CARRY, MOVE]
var upParts = [MOVE, MOVE, WORK, CARRY, CARRY]
var buildParts = [MOVE, MOVE, CARRY, WORK, CARRY]
var defendParts = [MOVE, MOVE, ATTACK, ATTACK]
var attackParts = [MOVE, MOVE, ATTACK, ATTACK]

// Add in modules
var roleGather = require('gather')
var roleHaul = require('haul')
var roleUp = require('upgrader')
var roleBuild = require('builder')
var roleDefend = require('meele')
var roleAttack = require('attack')

//**************************************
//MAIN LOOP
//**************************************

resource_and_extension_total = getTotals() // Get total resource and extensions for use outside of func
currentPhase = phaseCalc(resource_and_extension_total[0])
spawnExtensions()
console.log("total resource count " + resource_and_extension_total)
console.log(currentPhase)

//**************************************
//PHASE AND BUILD INIT
//**************************************

function getMineableSpots(Entity) { // Function to get amount of Mineable spots in the room.
    var MineableSpots = 0
    for (source in Entity.room.find(FIND_SOURCES)) { // Get total mineable spots in the room.
        MineableSpots += getSourceSpots(Entity.room.find(FIND_SOURCES)[source])
    }
    return MineableSpots
}

function getSourceSpots(Source) { // Function to get useable slots at an Energy source.
    var freeSites = 0
    const testSites = [-1, 0, 1]
    for (const numY in testSites) {
        const Y = testSites[numY]
        for (const numX in testSites) {
            const X = testSites[numX]
            const location = Source.room.lookAt(Source.pos.x - X, Source.pos.y - Y)
            location.forEach(function (s) {
                if (s.type == 'terrain') {
                    if (s.terrain == 'plain' || s.terrain == 'swamp') {
                        freeSites++
                    }
                }
            })
        }
    }
    return freeSites
}

function getTotals() {
    // Find structures that can store resource
    var storables = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, { filter: (searchResource) => { return storablesArr.includes(searchResource.structureType) } })
    // Find all extension related items
    var extensionAmount = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, { filter: (searchExtension) => { return extensionArr.includes(searchExtension.structureType) } })
    var extensionConstructs = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES, { filter: (searchConstruct) => { return searchConstruct.structureType == STRUCTURE_EXTENSION } })
    // Find all storage related items
    var storageAmount = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, { filter: (searchStorage) => { return searchStorage.structureType == STRUCTURE_STORAGE } })
    var storageConstructs = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES, { filter: (searchConstructStorage) => { return searchConstructStorage.structureType == STRUCTURE_STORAGE } })
    // Calc totals
    var extensionTotal = extensionConstructs.length + extensionAmount.length;
    var storageTotal = storageConstructs.length + storageAmount.length;
    for (i in storables) {
        var workingNum = storables[i].store.getUsedCapacity(RESOURCE_ENERGY)
        totalResource = totalResource + workingNum;
    }
    return_arr = [totalResource, extensionTotal]
    return return_arr
}

//Calc phase
function phaseCalc(totalResource) {
    if (Game.spawns['Spawn1'].room.controller.level >= 3) {
        switch (Math.floor((totalResource / 300 * Game.spawns['Spawn1'].room.controller.level) + 1)) {
            case 0:
                currentPhase = 0;
            case 1:
                currentPhase = 1;
                break;
            case 2:
                currentPhase = 2;
                if (Game.spawns['Spawn1'].room.controller.level >= 4) {
                    // create stucture
                    var x = Game.spawns['Spawn1'].pos.x
                    var y = Game.spawns['Spawn1'].pos.y
                    Game.spawns['Spawn1'].room.createConstructionSite(x, y - 1, STRUCTURE_STORAGE)
                }
                break;
            case 3:
                currentPhase = 3;
                break;
            case 4:
                currentPhase = 4;
                break;
            case 5:
                currentPhase = 5;
                break;
            case 6:
                currentPhase = 6;
                break;
            case 7:
                currentPhase = 7;
                break;
            case 8:
                currentPhase = 8;
                break;
            case 9:
                currentPhase = 9;
                break;
            case 10:
                currentPhase = 10;
                break;
        }
    }
    return currentPhase;
}



// add more extension phases
function spawnExtensions() {
    if (Game.spawns['Spawn1'].room.controller.level >= 2 && resource_and_extension_total[1] < 5 * (currentPhase + 1)) {
        // create extensions
        console.log("Attempting Extension Create...")
        var upper_bound_x = Game.spawns['Spawn1'].pos.x + 2
        var upper_bound_y = Game.spawns['Spawn1'].pos.y + 2
        var lower_bound_x = Game.spawns['Spawn1'].pos.x - 2
        var lower_bound_y = Game.spawns['Spawn1'].pos.y - 2
        var x_final = Math.floor(Math.random() * upper_bound_x + lower_bound_x);
        var y_final = Math.floor(Math.random() * upper_bound_y + lower_bound_x);
        if (!x_final == Game.spawns["Spawn1"].pos.x && !y_final == (Game.spawns["Spawn1"].pos.y - 1)) {
            Game.spawns['Spawn1'].room.createConstructionSite(x_final, y_final, STRUCTURE_EXTENSION)
        }
    }
}
// concat arrs to make more

//**************************************
//COUNT INIT
//**************************************
for (i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'gather')
        currentGatherCreep++
}
for (i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'haul')
        currentHaulCreep++
}
for (i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'upgrader')
        currentUpCreep++
}
for (i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'builder')
        currentBuildCreep++
}
for (i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'meele')
        currentDefCreep++
}
for (i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'attack')
        currentAttackCreep++
}
if (currentHaulCreep == 0 && currentGatherCreep == 0) {
    currentPhase = 0;
}
if (currentPhase > 1) {
    for (let i = 1; i < currentPhase; i++) {
        gatherParts = gatherParts.concat(gatherParts)
        haulParts = haulParts.concat(haulParts)
        upParts = upParts.concat(upParts)
        buildParts = buildParts.concat(buildParts)
        defendParts = defendParts.concat(defendParts)
        attackParts = attackParts.concat(attackParts)

    }
}

//**************************************
//SPAWNING INIT
//**************************************

// Spawning initial gather creep on each spawn to hit cap
if (creepgatherAmount > currentGatherCreep) {
    for (i in Game.spawns) {
        var currentTimeCreep = "Creep" + Game.time;
        Game.spawns[i].spawnCreep(gatherParts, 'Creep' + Game.time, { memory: { role: 'gather' } });
    };
};
// Spawning initial haul creep on each spawn to hit cap
if (creephaulAmount > currentHaulCreep && currentGatherCreep > 0) {
    for (i in Game.spawns) {
        var currentTimeCreep = "Creep" + Game.time;
        Game.spawns[i].spawnCreep(haulParts, 'Creep' + Game.time, { memory: { role: 'haul' } });
    };
};
// Spawning initial upgrader creep on each spawn to hit cap
if (creepUpAmount > currentUpCreep && currentGatherCreep > 0) {
    for (i in Game.spawns) {
        var currentTimeCreep = "Creep" + Game.time;
        Game.spawns[i].spawnCreep(upParts, 'Creep' + Game.time, { memory: { role: 'upgrader' } });
    };
};
// Spawning initial builder creep on each spawn to hit cap
if (Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
    if (creepBuildAmount > currentBuildCreep && currentGatherCreep > 0) {
        for (i in Game.spawns) {
            var currentTimeCreep = "Creep" + Game.time;
            Game.spawns[i].spawnCreep(buildParts, 'Creep' + Game.time, { memory: { role: 'builder' } });
        };
    };
}
// spawning initial defender creeps
if (creepDefAmount > currentDefCreep && currentGatherCreep > 0) {
    for (i in Game.spawns) {
        var currentTimeCreep = "Creep" + Game.time;
        Game.spawns[i].spawnCreep(defendParts, 'Creep' + Game.time, { memory: { role: 'meele' } });
    };
};
// spawning initial attack creeps
if (creepAttackAmount > currentAttackCreep && currentGatherCreep > 0) {
    for (i in Game.spawns) {
        var currentTimeCreep = "Creep" + Game.time;
        Game.spawns[i].spawnCreep(attackParts, 'Creep' + Game.time, { memory: { role: 'attack' } });
    };
};

// Clear dead screeps from memory
for (var i in Memory.creeps) {
    if (!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}
//**************************************
//MODULE INIT
//**************************************

// If gather role, begin gather module.
for (const i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'gather') {
        roleGather.run(Game.creeps[i])
    };
};
// If haul role, begin haul module.
for (const i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'haul') {
        roleHaul.run(Game.creeps[i])
    };
};

// If haul role, begin haul module.
for (const i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'upgrader') {
        roleUp.run(Game.creeps[i])
    };
};
// If build role, begin haul module.
for (const i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'builder') {
        roleBuild.run(Game.creeps[i])
    };
};
// If build role, begin haul module.
for (const i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'meele') {
        roleDefend.run(Game.creeps[i])
    };
};
// If build role, begin haul module.
for (const i in Game.creeps) {
    if (Game.creeps[i].memory.role == 'attack') {
        roleAttack.run(Game.creeps[i])
    };
};