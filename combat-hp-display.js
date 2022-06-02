import { translateCustomDisplayModes, useTemplatesPath, getDisplayMode } from './scripts/helpers.js';
import { registerGameSettings } from './scripts/setup.js';

Hooks.once('init', function() {
    registerGameSettings();
    loadTemplates([
        useTemplatesPath('partials/tokenDisplayValues.hbs'),
    ]);
});

Hooks.on('updateCombat', async combat => {
    if(game.user.isGM){
        const inCombat = game.settings.get("combat-hp-display", "combat-display");
        const combatants = Array.from(combat.data.combatants);
        for(var i = 0; i < combatants.length; i++) {
            const combatant = combatants[i];
            const combatantDisplayMode = getDisplayMode(combatant.token.data.disposition);
            const displayBarValue = translateCustomDisplayModes(inCombat[combatantDisplayMode]);
            const newDisplayBar = displayBarValue ? { displayBars: displayBarValue } : {};
            await combatant.token.update({
                "flags.combat-hp-display": combatant.token.data.displayBars,
                ...newDisplayBar
            });
        }
    }
});

Hooks.on('deleteCombat', combat => {
    if(game.user.isGM){
        const outOfCombat = game.settings.get("combat-hp-display", "out-of-combat-display");
        const combatants = Array.from(combat.data.combatants);
        for(var i = 0; i < combatants.length; i++) {
            const combatant = combatants[i];
            const combatantDisplayMode = getDisplayMode(combatant.token.data.disposition);
            const newDisplayBars = translateCustomDisplayModes(outOfCombat[combatantDisplayMode], combatant.token.data.flags["combat-hp-display"]);
            combatant.token.update({displayBars: newDisplayBars});
        }
    }
});