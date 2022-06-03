import DisplayBarConvertionMenu from '../module/DisplayBarConvertionMenu.js';
import DisplayBarSettingsMenu from '../module/DisplayBarSettingsMenu.js';

export const registerGameSettings = () => {
    game.settings.registerMenu("combat-hp-display", "hp-display-settings", {
        name: game.i18n.localize('combat-hp-display.hpDisplaySettings.label'),
        label: game.i18n.localize('combat-hp-display.hpDisplaySettings.title'),
        hint: "",
        icon: "fas fa-cog",
        type: DisplayBarSettingsMenu,
        restricted: true
    });

    game.settings.registerMenu("combat-hp-display", "actor-converter", {
        name: game.i18n.localize('combat-hp-display.actorConverter.label'),
        label: game.i18n.localize('combat-hp-display.actorConverter.title'),
        hint: "",
        icon: "fas fa-exchange-alt",
        type: DisplayBarConvertionMenu,
        restricted: true
    });

    game.settings.register("combat-hp-display", "out-of-combat-display", {
        name: "Out Of Combat HP Display",
        hint: "The HP Display behehavior used when not in combat",
        scope: "world",
        config: false,
        type: Object,
        default: {
            friendly: 0,
            neutral: 0,
            hostile: 0,
        },
    });
    
    game.settings.register("combat-hp-display", "combat-display", {
        name: "Combat HP Display",
        hint: "The HP Display behehavior used when in combat",
        scope: "world",
        config: false,
        type: Object,
        default: {
            friendly: 50,
            neutral: 50,
            hostile: 50,
        },
    });
};

export const migrateDataStructures = () => {
    const outOfCombat = game.settings.get('combat-hp-display', 'out-of-combat-display');
    if(typeof outOfCombat !== 'object'){
        game.settings.set('combat-hp-display', 'out-of-combat-display', {
            friendly: outOfCombat,
            neutral: outOfCombat,
            hostile: outOfCombat,
        });
    }

    const inCombat = game.settings.get('combat-hp-display', 'combat-display');
    if(typeof inCombat !== 'object'){
        game.settings.set('combat-hp-display', 'combat-display', {
            friendly: inCombat,
            neutral: inCombat,
            hostile: inCombat,
        });
    }
};