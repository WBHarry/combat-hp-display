import { useTemplatesPath } from '../scripts/combat-hp-display-helpers.js';

export default class GridSettingsMenu extends FormApplication {
    constructor() {
        super({}, {title: game.i18n.localize('combat-hp-display.gridSettings.title')});
        const settings = game.settings.get('combat-hp-display', 'grid-display');
        this.gridSettings = {
            ...settings,
        };
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        width: 300,
        id: 'resource-display-menu',
        template: useTemplatesPath('gridMenu.hbs'),
        closeOnSubmit: false,
        submitOnChange: true,
        classes: ["combat-hp-display", "grid-menu"],
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return {
            grid: this.gridSettings,
        }
    }

    async _updateObject(event, formData) {
        this.gridSettings = foundry.utils.expandObject(formData).grid;

        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        $(html).find('#save').click(event => {
            game.settings.set('combat-hp-display', 'grid-display', this.gridSettings);
            this.close();
        });
    }
}