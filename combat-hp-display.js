import { useTemplatesPath } from './scripts/helpers.js';
import { registerGameSettings, migrateDataStructures } from './scripts/setup.js';
import { deleteCombatUpdate, deleteCombatantUpdate, startCombatUpdate, joinCombatUpdate } from './module/DisplayBarHandler.js';

Hooks.once('init', function() {
    registerGameSettings();
    loadTemplates([
        useTemplatesPath('partials/tokenDisplayValues.hbs'),
        useTemplatesPath('partials/convertDisplayvalue.hbs'),
    ]);
});

Hooks.once('ready', function() {
    migrateDataStructures();
});

Hooks.on('createCombatant', async combatant => {
    await joinCombatUpdate(combatant);
});

Hooks.on('updateCombat', async combat => {
    await startCombatUpdate(combat);
});

Hooks.on('deleteCombat', combat => {
    deleteCombatUpdate(combat);
});

Hooks.on('deleteCombatant', combatant => {
    deleteCombatantUpdate(combatant);
});