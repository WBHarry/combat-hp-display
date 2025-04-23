import { useTemplatesPath, hpDisplayModes, translateCustomDisplayModes, getDisplayMode } from '../scripts/combat-hp-display-helpers.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
export default class DisplayBarConvertionMenu extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(options={}) {
        super(options);

        this.settings = {
            from: {
                friendly: 60,
                neutral: 60,
                hostile: 60,
            },
            to: {
                friendly: 30,
                neutral: 30,
                hostile: 30,
            },
        }
        this.dispositions = {
            friendly: false,
            neutral: false,
            hostile: false,
        };
    }

    get title() {
        return game.i18n.localize('combat-hp-display.actorConverter.title');
    }

    static DEFAULT_OPTIONS = {
        tag: "form",
        id: "combat-hp-display",
        classes: ["combat-hp-display", "settings-menu"],
        actions: {
            convertDisplayBar: this.convertDisplayBar,
            convertAll: this.convertAll,
            convertMap: this.convertMap,
        },
        form: { handler: this.updateData, submitOnChange: true },
    };

    static PARTS = {
        main: {
            id: "main",
            template: useTemplatesPath('convertMenu.hbs'),
        },
    }

    async _prepareContext(_options) {
        const context = await super._prepareContext(_options);

        context.displayChoisesFrom = [
            ...hpDisplayModes,
            {value: 60, name: 'All Display Types'},
        ];
        context.displayChoisesTo = hpDisplayModes;
        context.dispositions = this.dispositions;
        
        context.settings = {
            friendly: {
                from: this.settings.from.friendly,
                to: this.settings.to.friendly,
                title: 'combat-hp-display.hpDisplaySettings.friendlyTokens',
            },
            neutral: {
                from: this.settings.from.neutral,
                to: this.settings.to.neutral,
                title: 'combat-hp-display.hpDisplaySettings.neutralTokens',
            },
            hostile: {
                from: this.settings.from.hostile,
                to: this.settings.to.hostile,
                title: 'combat-hp-display.hpDisplaySettings.hostileTokens',
            }
        };
        
        context.convertDisabled = !this.dispositions.friendly && !this.dispositions.neutral && !this.dispositions.hostile;

        return context;
    }

    static convertDisplayBar(event, button) {
        foundry.utils.setProperty(this.dispositions, button.id, !this.dispositions[button.id]);
        this.render();
    }

    static async convertAll(event) {
        event.stopPropagation();
        event.preventDefault();
        const actors = game.canvas.tokens.objects.children.map(x => x.document.actor);

        for(var i = 0; i < actors.length; i++){
            const actor = actors[i];
            const activeTokens = actor.getActiveTokens();
            actor.prototypeToken.update({ 'displayBars': to });
            for(var j = 0; j < activeTokens.length; j++){
                const token = activeTokens[j];
                const disposition = getDisplayMode(token.document.disposition);
                const from = translateCustomDisplayModes(this.settings.from, disposition);
                const to = translateCustomDisplayModes(this.settings.to, disposition);
            
                if((from === 60 || token.document.displayBars === from) && this.dispositions[disposition]){
                    await token.document.update({
                        'displayBars': to,
                    }); 
                }
            }
        }
    }

    static async convertMap(event) {
        event.stopPropagation();
        event.preventDefault();
        const actors = game.canvas.tokens.objects.children.map(x => x.document.actor);

        for(var i = 0; i < actors.length; i++){
            const actor = actors[i];
            const activeTokens = actor.getActiveTokens();
            for(var j = 0; j < activeTokens.length; j++){
                const token = activeTokens[j];
                const disposition = getDisplayMode(token.document.disposition);
                const from = translateCustomDisplayModes(this.settings.from, disposition);
                const to = translateCustomDisplayModes(this.settings.to, disposition);
            
                if((from === 60 || token.document.displayBars === from) && this.dispositions[disposition]){
                    await token.document.update({
                        'displayBars': to,
                    }); 
                }
            }
        }
    }

    static async updateData(event, element, formData) {
        const data = foundry.utils.expandObject(formData.object);

        this.settings = foundry.utils.mergeObject(this.settings, data.settings);
        this.render();
    }
}