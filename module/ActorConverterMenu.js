import { useTemplatesPath, hpDisplayModes, translateCustomDisplayModes, getDisplayMode } from '../scripts/helpers.js';

export default class CombatHpDisplayMenu extends FormApplication {
    constructor() {
        super({}, {title: 'Actor Converter'});

        this.settings = game.settings.get('combat-hp-display', 'convert-settings');
        this.dispositions = {
            friendly: false,
            neutral: false,
            hostile: false,
        };
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        id: 'combat-hp-display',
        template: useTemplatesPath('convertMenu.hbs'),
        width: 'auto',
        classes: ["combat-hp-display", "converter-menu"],
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return {
            ...this.settings,
            optionsFrom: [
                { value: 60, name: 'All Display Types' },
                ,...hpDisplayModes
            ],
            optionsTo: hpDisplayModes,
            dispositions: this.dispositions,
            convertDisabled: !this.dispositions.friendly && !this.dispositions.neutral && !this.dispositions.hostile,
        }
    }

    async _updateObject() {}

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".token-display-icon").click(event => {
            const disposition = event.currentTarget.id;
            setProperty(this.dispositions, disposition, !this.dispositions[disposition]);
            this.render();
        });

        html.find("#from").change(event => {
            const value = Number.parseInt(event.target.value);
            this.settings = { ...this.settings, from : value };
            game.settings.set('combat-hp-display', 'convert-settings', {
                ...this.settings,
                from: value
            });
        });

        
        html.find("#to").change(event => {
            const value = Number.parseInt(event.target.value);
            this.settings = { ...this.settings, to: value };
            game.settings.set('combat-hp-display', 'convert-settings', {
                ...this.settings,
                to: value
            });
        });

        html.find("#convert-all").click(async (event) => {
          const actors = Array.from(game.actors);
          await this.convertDisplayBars(event, actors);
        });

        html.find("#convert-map").click(async (event) => {
            const actors = game.canvas.tokens.objects.children.map(x => x.document.actor);
            await this.convertDisplayBars(event, actors);
          });
    }

    async convertDisplayBars(event, actors){
        event.stopPropagation();
        event.preventDefault();
        const from = translateCustomDisplayModes(this.settings.from);
        const to = translateCustomDisplayModes(this.settings.to);
        for(var i = 0; i < actors.length; i++){
            const actor = actors[i];
            const disposition = getDisplayMode(actor.data.token.disposition);
            if(this.dispositions[disposition]){
                if(from === 60 || actor.data.token.displayBars === from){
                    await Actor.updateDocuments([{_id: actor.id, ['token.displayBars']: to}]);
                    const activeTokens = actor.getActiveTokens();
                    for(var j = 0; j < activeTokens.length; j++){
                        await activeTokens[j].document.update({
                            'displayBars': to
                        });
                    }
                }
            }
        }
    }
}