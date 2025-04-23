import { hpDisplayModes, barBrawlHpDisplayModes, useTemplatesPath } from '../scripts/combat-hp-display-helpers.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export default class DisplayBarSettingsMenu extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options={}) {
        super(options);

        this.displaySettings = {
            combat: game.settings.get('combat-hp-display', 'combat-display'),
        };

        this.barbrawlActive = game.modules.get("barbrawl")?.active;
        
        this.displayChoises = [
            { name: "Precombat Value", value: 0, },
            ...(this.barbrawlActive ? barBrawlHpDisplayModes : hpDisplayModes)
        ];
    }

    get title() {
        return game.i18n.localize('combat-hp-display.hpDisplaySettings.title');
    }

    static DEFAULT_OPTIONS = {
        tag: "form",
        id: "resource-display-menu",
        classes: ["combat-hp-display", "settings-menu"],
        position: { width: 300, height: "auto" },
        actions: {
            save: this.save,
        },
        form: { handler: this.updateData, submitOnChange: true },
    };

    static PARTS = {
        main: {
            id: "main",
            template: useTemplatesPath('settingsMenu.hbs'),
        },
    }

    async _prepareContext(_options) {
        const context = await super._prepareContext(_options);

        context.combat = {
            friendly: {
                ...this.displaySettings.combat.friendly,
                icon: 'fa-grin-beam',
                title: game.i18n.localize('combat-hp-display.hpDisplaySettings.friendlyTokens'),
            },
            neutral: {
                ...this.displaySettings.combat.neutral,
                icon: 'fa-meh',
                title: game.i18n.localize('combat-hp-display.hpDisplaySettings.neutralTokens'),
            },
            hostile: {
                ...this.displaySettings.combat.hostile,
                icon: 'fa-angry',
                title: game.i18n.localize('combat-hp-display.hpDisplaySettings.hostileTokens'),
            }
        };

        context.displayChoisesFrom = this.displayChoises;
        context.displayChoisesTo = this.displayChoises;
        context.barbrawlActive = this.barbrawlActive;

        return context;s
    }

    static async updateData(event, element, formData) {
        const data = foundry.utils.expandObject(formData.object);
        this.displaySettings = data.displaySettings;

        this.render();
    }

    static async save() {
        game.settings.set('combat-hp-display', 'combat-display', this.displaySettings.combat);
        this.close();
    }
}