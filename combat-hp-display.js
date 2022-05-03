import CombatHpDisplayMenu from './module/CombatHpDisplayMenu.js';
import { hpDisplayModes } from './scripts/helpers.js';

Hooks.once('init', function() {
    game.settings.registerMenu("combat-hp-display", "actor-converter", {
        name: game.i18n.localize('settings.actorConverter.label'),
        label: game.i18n.localize('settings.actorConverter.menuButton'),
        hint: "",
        icon: "fas fa-solid fa-shapes",
        type: CombatHpDisplayMenu,
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

    const displayChoises = hpDisplayModes.reduce((choices, option) => ({
        ...choices,
        [option.value]: option.name
    }), {});

    game.settings.register("combat-hp-display", "out-of-combat-display", {
        name: "Out Of Combat HP Display",
        hint: "The HP Display behehavior used when not in combat",
        scope: "world",
        config: true,
        type: Number,
        choices: {
            0: "Precombat Value",
            ...displayChoises
        },
        default: 0,
        onChange: value => {
            game.settings.set("combat-hp-display", "out-of-combat-display", value);
        }
    });
    
    game.settings.register("combat-hp-display", "combat-display", {
        name: "Combat HP Display",
        hint: "The HP Display behehavior used when in combat",
        scope: "world",
        config: true,
        type: Number,
        choices: displayChoises,
        default: 50,
        onChange: value => {
            game.settings.set("combat-hp-display", "combat-display", value);
        }
    });

    Handlebars.registerHelper('boolean', function(arg1, arg2) {
        return arg1 == arg2;
    });
});

Hooks.on('updateCombat', combat => {
    if(game.user.isGM){
        const inCombat = game.settings.get("combat-hp-display", "combat-display");
        combat.data.combatants.forEach(combatant => {
            combatant.token.update({"flags.combat-hp-display": combatant.token.data.displayBars});
            combatant.token.update({displayBars: inCombat});
        });
    }
});

Hooks.on('deleteCombat', combat => {
    if(game.user.isGM){
        const outOfCombat = game.settings.get("combat-hp-display", "out-of-combat-display");
        combat.data.combatants.forEach(combatant => {
            const newDisplayBars = outOfCombat === 0 ? combatant.token.data.flags["combat-hp-display"] : outOfCombat === 1 ? 0 : outOfCombat;
            combatant.token.update({displayBars: newDisplayBars});
        });
    }
});