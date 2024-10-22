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

Hooks.on('preCreateScene', async (scene) => {
    const { colorOverride, gridOverride } = game.settings.get('combat-hp-display', 'grid-display');
    if(colorOverride.enabled || gridOverride){
        scene.updateSource({ 
            grid: {
                color: colorOverride.enabled ? Color.from(colorOverride.color) : scene.grid.color,
                type: gridOverride.enabled ? gridOverride.type : scene.grid.type,
            } 
        }, { diff: false });
    }
});