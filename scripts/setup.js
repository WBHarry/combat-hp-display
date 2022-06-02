import ActorConverterMenu from '../module/ActorConverterMenu.js';
import ResourceDisplayMenu from '../module/ResourceDisplayMenu.js';

export const registerGameSettings = () => {
    game.settings.registerMenu("combat-hp-display", "actor-converter", {
        name: game.i18n.localize('combat-hp-display.actorConverter.label'),
        label: game.i18n.localize('combat-hp-display.actorConverter.menuButton'),
        hint: "",
        icon: "fas fa-solid fa-shapes",
        type: ActorConverterMenu,
        restricted: true
    });

    game.settings.registerMenu("combat-hp-display", "hp-display-settings", {
        name: game.i18n.localize('combat-hp-display.hpDisplaySettings.label'),
        label: game.i18n.localize('combat-hp-display.hpDisplaySettings.menuButton'),
        hint: "",
        icon: "fas fa-solid fa-shapes",
        type: ResourceDisplayMenu,
        restricted: true
    });

    game.settings.register('combat-hp-display', 'convert-settings', {
        name: 'Convert Settings',
        hint: 'Convert Settings',
        scope: 'world',
        default: {
            from: 50,
            to: 30,
        },
        config: false,
        type: Object,
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