import { translateCustomDisplayModes, getDisplayMode } from '../scripts/helpers.js';

export const startCombatUpdate = async (combat) => {
    if(game.user.isGM && combat.previous.round === 0 && combat.current.round === 1){
        const combatants = Array.from(combat.data.combatants);
        await combatUpdate(combatants);
    }
}

export const joinCombatUpdate = async (combatant) => {
    if(combatant.combat.started){
        await combatUpdate([combatant]);
    }
};

export const combatUpdate = async (combatants) => {
    const inCombat = game.settings.get("combat-hp-display", "combat-display");
    for(var i = 0; i < combatants.length; i++) {
        const combatant = combatants[i];
        const combatantDisplayMode = getDisplayMode(combatant.token.data.disposition);
        const displayBarValue = translateCustomDisplayModes(inCombat, combatantDisplayMode);
        const newDisplayBar = displayBarValue !== undefined ? { displayBars: displayBarValue } : {};
        await combatant.token.update({
            "flags.combat-hp-display": combatant.token.data.displayBars,
            ...newDisplayBar
        });
    }
};

export const deleteCombatUpdate = (combat) => {
    if(game.user.isGM){
        const combatants = Array.from(combat.data.combatants);
        updateDisplayMode(combatants);
    }
}

export const deleteCombatantUpdate = (combatant) => {
    if(game.user.isGM && combatant.parent.started){
        updateDisplayMode([combatant]);
    }
}

const updateDisplayMode = (combatants) => {
    const outOfCombat = game.settings.get("combat-hp-display", "out-of-combat-display");
    for(var i = 0; i < combatants.length; i++) {
        const combatant = combatants[i];
        const combatantDisplayMode = getDisplayMode(combatant.token.data.disposition);
        const newDisplayBars = translateCustomDisplayModes(outOfCombat, combatantDisplayMode, combatant.token.data.flags["combat-hp-display"]);
        combatant.token.update({displayBars: newDisplayBars});
    }
}