import html from "./oyl-json.html";
import scss from "./oyl-json.scss";
import {ComponentConnected, ComponentDisconnected, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylJson extends Component {

    protected container: HTMLElement;

    static get tagName(): string {
        return 'oyl-json';
    }

    static get observedAttributes() {
        return [];
    }

    constructor(private object: Object) {
        super();
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    private render() {
        let json = JSON.stringify(this.object, null, 4);
        json += '\n';

        json = this.renderStringValues(json);
        json = this.renderKeys(json);

        json = this.renderOpeningBracket(json, '[', 'yellow');
        json = this.renderOpeningBracket(json, '{', 'white');

        json = this.renderValue(json, '\\]', 'yellow');
        json = this.renderValue(json, '\\}', 'white');
        json = this.renderValue(json, '(true|false)', 'orange');
        json = this.renderValue(json, '[0-9.]+', 'blue');

        this.container.innerHTML = json;
    }

    private renderStringValues(json: string): string {
        let strValues = json.match(/"(([^"]|\\")*)"[,\n]/g);
        if (strValues === null) {
            return json;
        }
        strValues.forEach(match => {
            let value = match.substr(0, match.length - 1);
            if (match.endsWith(',')) {
                json = json.replace(match, `<span class="green">${value}</span><span class="orange">,</span>`);
            } else {
                json = json.replace(match, `<span class="green">${value}</span>\n`);
            }
        });
        return json;
    }

    private renderOpeningBracket(json: string, bracket: string, cssClass: string): string {
        return json.replace(new RegExp('(\\'+bracket+')|(?:<span class="green">(.)*<\\/span>)|(?:<span class="purple">(.)*<\\/span><span class="orange">:<\\/span>)', 'g'), substring => {
            if (substring.startsWith('<span class="green">') || substring.startsWith('<span class="purple">')) {
                return substring;
            }
            return `<span class="${cssClass}">${bracket}</span>`;
        });
    }

    private renderKeys(json: string): string {
        let keys = json.match(/"(([^"]|\\")*)[^\\]":/g);
        if (keys === null) {
            return json;
        }
        keys.forEach(match => {
            let key = match.substr(0, match.length - 1);
            json = json.replace(match, `<span class="purple">${key}</span><span class="orange">:</span>`);
        });
        return json;
    }

    private renderValue(json: string, pattern: string, cssClass: string): string {
        return json.replace(new RegExp('('+pattern+'[,\\n])|(?:<span class="green">(.)*<\\/span>)|(?:<span class="purple">(.)*<\\/span><span class="orange">:<\\/span>)', 'g'), substring => {
            if (substring.startsWith('<span class="green">') || substring.startsWith('<span class="purple">')) {
                return substring;
            }
            let value = substring.substr(0, substring.length - 1);
            if (substring.endsWith(',')) {
                return `<span class="${cssClass}">${value}</span><span class="orange">,</span>`;
            }
            return `<span class="${cssClass}">${value}</span>\n`;
        });
    }
}

export default OylJson;