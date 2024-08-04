import { useTemplatesPath } from './scripts/combat-hp-display-helpers.js';
import { registerGameSettings, migrateDataStructures } from './scripts/setup.js';
import { deleteCombatUpdate, startCombatUpdate, joinCombatUpdate } from './module/DisplayBarHandler.js';

Hooks.once('init', function() {
    registerGameSettings();
    loadTemplates([
        useTemplatesPath('partials/tokenDisplayValues.hbs'),
        useTemplatesPath('partials/convertDisplayValue.hbs'),
    ]);
});

Hooks.once('ready', async () => {
    await migrateDataStructures();
});

Hooks.on('createCombatant', async combatant => {
    await joinCombatUpdate(combatant);
});

Hooks.on('updateCombat', async combat => {
    await startCombatUpdate(combat);
});

Hooks.on('deleteCombat', async combat => {
    await deleteCombatUpdate(combat);
});