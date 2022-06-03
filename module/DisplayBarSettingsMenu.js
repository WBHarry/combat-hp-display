import { hpDisplayModes, useTemplatesPath } from '../scripts/helpers.js';

export default class DisplayBarSettingsMenu extends FormApplication {
    constructor() {
        super({}, {title: game.i18n.localize('combat-hp-display.hpDisplaySettings.title')});
        this.displaySettings = {
            outOfCombat: game.settings.get('combat-hp-display', 'out-of-combat-display'),
            combat: game.settings.get('combat-hp-display', 'combat-display'),
        };

        this.displayChoises = [
            { name: "Precombat Value", value: 0, },
            ...hpDisplayModes
        ];
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        width: 400,
        id: 'resource-display-menu',
        template: useTemplatesPath('settingsMenu.hbs'),
        closeOnSubmit: false,
        submitOnChange: true,
        classes: ["combat-hp-display", "settings-menu"],
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return {
            outOfCombat: this.displaySettings.outOfCombat,
            combat: this.displaySettings.combat,
            displayChoisesFrom: this.displayChoises,
            displayChoisesTo: this.displayChoises,
        }
    }

    async _updateObject(event, formData) {
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            const settingValue = typeof value === 'boolean' ? value : Number.parseInt(value);
            setProperty(this.displaySettings, key, settingValue);
        });
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        $(html).find('#save').click(event => {
            game.settings.set('combat-hp-display', 'out-of-combat-display', this.displaySettings.outOfCombat);
            game.settings.set('combat-hp-display', 'combat-display', this.displaySettings.combat);
            this.close();
        });
    }
}