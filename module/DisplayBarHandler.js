import { translateCustomDisplayModes, getDisplayMode } from '../scripts/combat-hp-display-helpers.js';

export const startCombatUpdate = async (combat) => {
    if(game.user.isGM && combat.previous.round === 0 && combat.current.round === 1){
        const combatants = Array.from(combat.data.combatants);
        await combatUpdate(combatants);
    }
}

export const joinCombatUpdate = async (combatant) => {
    if(game.user.isGM && combatant.combat.started){
        await combatUpdate([combatant]);
    }
};

export const combatUpdate = async (combatants) => {
    const inCombat = game.settings.get("combat-hp-display", "combat-display");
    for(var i = 0; i < combatants.length; i++) {
        const combatant = combatants[i];
        await diplayBarUpdate(combatant, inCombat);
    }
};

const diplayBarUpdate = async (combatant, inCombat) => {
    const combatantDisplayMode = getDisplayMode(combatant.token.data.disposition);
    const displayBarValue = translateCustomDisplayModes(inCombat, combatantDisplayMode);
    if(game.modules.get("barbrawl")?.active){
        const origResourceBars = combatant.token.data.flags.barbrawl?.resourceBars;
        const resourceBars = deepClone(origResourceBars);
        if(resourceBars){
            Object.keys(resourceBars).forEach(key => {
                resourceBars[key] = {
                    ...resourceBars[key],
                    otherVisibility: displayBarValue,
                    ownerVisibility: -1,
                };
            });

            await combatant.token.update({
                "flags.combat-hp-display-bar-brawl-bars": origResourceBars,
                "flags.barbrawl.resourceBars": resourceBars,
            });
        }
    }
    else {
        const displayBarSettings = displayBarValue !== undefined ? { displayBars: displayBarValue } : {};
        await combatant.token.update({
            "flags.combat-hp-display": combatant.token.data.displayBars,
            ...displayBarSettings
        });
    }
};

export const deleteCombatUpdate = async (combat) => {
    const combatants = Array.from(combat.data.combatants);
    await updateDisplayMode(combatants);
}

export const deleteCombatantUpdate = async (combatant) => {
    if(combatant.parent.started){
        await updateDisplayMode([combatant]);
    }
}

const updateDisplayMode = async (combatants) => {
    for(var i = 0; i < combatants.length; i++) {
        const combatant = combatants[i];
        if(game.modules.get("barbrawl")?.active){
            if(game.user.isGM){
                await combatant.token.update({
                    "flags.barbrawl.resourceBars": combatant.token.data.flags["combat-hp-display-bar-brawl-bars"],
                });
            }
            else {
                combatant.token.object.hud.bars.removeChildren();
            }
        }
        else if(game.user.isGM){
            await combatant.token.update({displayBars: combatant.token.data.flags["flags.combat-hp-display"]});
        }
    }
}