import { useTemplatesPath, hpDisplayModes, translateCustomDisplayModes, getDisplayMode } from '../scripts/combat-hp-display-helpers.js';

export default class DisplayBarConvertionMenu extends FormApplication {
    constructor() {
        super({}, {title: game.i18n.localize('combat-hp-display.actorConverter.title')});

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

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        width: 400,
        id: 'combat-hp-display',
        template: useTemplatesPath('convertMenu.hbs'),
        width: 'auto',
        closeOnSubmit: false,
        submitOnChange: true,
        classes: ["combat-hp-display", "converter-menu"],
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return {
            ...this.settings,
            displayChoisesFrom: [
                ...hpDisplayModes,
                {value: 60, name: 'All Display Types'},
            ],
            displayChoisesTo: hpDisplayModes,
            dispositions: this.dispositions,
            convertDisabled: !this.dispositions.friendly && !this.dispositions.neutral && !this.dispositions.hostile,
        }
    }

    async _updateObject(event, formData) {
        Object.keys(formData).forEach(key => {
            setProperty(this.settings, key, Number.parseInt(formData[key]));
        });
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".token-display-button").click(event => {
            const disposition = event.currentTarget.id;
            setProperty(this.dispositions, disposition, !this.dispositions[disposition]);
            this.render();
        });

        html.find("#from").change(event => {
            const value = Number.parseInt(event.target.value);
            this.settings = { ...this.settings, from : value };
        });

        
        html.find("#to").change(event => {
            const value = Number.parseInt(event.target.value);
            this.settings = { ...this.settings, to: value };
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
        for(var i = 0; i < actors.length; i++){
            const actor = actors[i];
            const disposition = getDisplayMode(actor.token.disposition);
            const from = translateCustomDisplayModes(this.settings.from, disposition);
            const to = translateCustomDisplayModes(this.settings.to, disposition);
            if(this.dispositions[disposition]){
                if(from === 60 || actor.token.displayBars === from){
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