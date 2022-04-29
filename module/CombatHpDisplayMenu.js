import { useTemplatesPath, hpDisplayModes } from '../scripts/helpers.js';

export default class CombatHpDisplayMenu extends FormApplication {
    constructor() {
        super({}, {title: 'Actor Converter'});

        this.settings = game.settings.get('combat-hp-display', 'convert-settings');
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        id: 'combat-hp-display',
        template: useTemplatesPath('menu.hbs'),
        width: 'auto',
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return {
            ...this.settings,
            options: hpDisplayModes
        }
    }

    async _updateObject() {}

    activateListeners(html) {
        super.activateListeners(html);

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

        html.find("#convert-all").click((event) => {
          event.stopPropagation();
          event.preventDefault();
          game.actors.forEach(actor => {
            if(actor.data.token.displayBars === this.settings.from){
                actor.data.document.update({
                    'token.displayBars': this.settings.to
                });
            }
          })
        });

        html.find("#convert-map").click((event) => {
            event.stopPropagation();
            event.preventDefault();
            game.canvas.tokens.objects.children.forEach(token => {
                const actor = token.document.actor;
                if(token.data.displayBars === this.settings.from){
                    token.document.update({
                        'displayBars': this.settings.to
                    });
                }
                if(actor.data.token.displayBars === this.settings.from){
                    actor.data.document.update({
                        'token.displayBars': this.settings.to
                    });
                }
            });
          });
    }
}