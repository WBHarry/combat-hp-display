import { useTemplatesPath } from '../scripts/combat-hp-display-helpers.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export default class GridSettingsMenu extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options={}) {
        super(options);

        const settings = game.settings.get('combat-hp-display', 'grid-display');
        this.gridSettings = {
            ...settings,
        };
    }

    get title() {
        return game.i18n.localize('combat-hp-display.gridSettings.title');
    }

    static DEFAULT_OPTIONS = {
        tag: "form",
        id: "resource-display-menu",
        classes: ["combat-hp-display", "settings-menu"],
        position: { width: "400", height: "auto" },
        actions: {
            save: this.save,
        },
        form: { handler: this.updateData, submitOnChange: true },
    };

    static PARTS = {
        main: {
            id: "main",
            template: useTemplatesPath('gridMenu.hbs'),
        },
    }

    async _prepareContext(_options) {
        const context = await super._prepareContext(_options);

        context.grid = this.gridSettings;
        context.gridTypes = Object.keys(foundry.CONST.GRID_TYPES).map(key => {
            const value = foundry.CONST.GRID_TYPES[key];
            const sceneLocalisationPrefix = game.version.split('.')[0] === '13' ? 'SCENE' : 'SCENES';
            switch(value) {
                case 0:
                    return { value, name: game.i18n.localize(`${sceneLocalisationPrefix}.GridGridless`) };
                case 1:
                    return { value, name: game.i18n.localize(`${sceneLocalisationPrefix}.GridSquare`) };
                case 2:
                    return { value, name: game.i18n.localize(`${sceneLocalisationPrefix}.GridHexOddR`) };
                case 3:
                    return { value, name: game.i18n.localize(`${sceneLocalisationPrefix}.GridHexEvenR`) };
                case 4:
                    return { value, name: game.i18n.localize(`${sceneLocalisationPrefix}.GridHexOddQ`) };
                case 5:
                    return { value, name: game.i18n.localize(`${sceneLocalisationPrefix}.GridHexEvenQ`) };
            }
        });

        return context;
    }

    static async updateData(event, element, formData) {
        const data = foundry.utils.expandObject(formData.object);

        this.gridSettings = foundry.utils.mergeObject(this.gridSettings, data.grid);
        this.render();
    }

    static async save(_, button) {
        game.settings.set('combat-hp-display', 'grid-display', this.gridSettings);
        this.close();
    }
}