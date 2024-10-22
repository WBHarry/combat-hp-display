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
        width: 400,
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
        const gridTypes = Object.keys(foundry.CONST.GRID_TYPES).map(key => {
            const value = foundry.CONST.GRID_TYPES[key];
            switch(value) {
                case 0:
                    return { value, name: game.i18n.localize('SCENES.GridGridless') };
                case 1:
                    return { value, name: game.i18n.localize('SCENES.GridSquare') };
                case 2:
                    return { value, name: game.i18n.localize('SCENES.GridHexOddR') };
                case 3:
                    return { value, name: game.i18n.localize('SCENES.GridHexEvenR') };
                case 4:
                    return { value, name: game.i18n.localize('SCENES.GridHexOddQ') };
                case 5:
                    return { value, name: game.i18n.localize('SCENES.GridHexEvenQ') };
            }
        });
        return {
            grid: this.gridSettings,
            gridTypes: gridTypes,
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