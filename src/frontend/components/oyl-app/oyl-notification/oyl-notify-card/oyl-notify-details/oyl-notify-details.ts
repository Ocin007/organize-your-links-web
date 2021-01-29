import html from "./oyl-notify-details.html";
import scss from "./oyl-notify-details.scss";
import {ComponentConnected, ComponentDisconnected, OylComponent} from "../../../../../decorators/decorators";
import Component from "../../../../component";
import { Status } from "../../../../../@types/enums";
import OylDate from "../../../../common/oyl-date/oyl-date";
import OylJson from "../../../../common/oyl-json/oyl-json";

@OylComponent({
    html: html,
    scss: scss
})
class OylNotifyDetails extends Component {

    protected statusElement: HTMLSpanElement;
    protected msgElement: HTMLSpanElement;
    protected timeElement1: OylDate;
    protected timeElement2: OylDate;
    protected htmlDetailsContainer: HTMLLIElement;
    protected htmlDetails: HTMLSpanElement;
    protected rawDetailsContainer: HTMLLIElement;
    protected rawDetails: HTMLSpanElement;

    static get tagName(): string {
        return 'oyl-notify-details';
    }

    static get observedAttributes() {
        return [];
    }

    constructor(
        private status: Status,
        private msg: Node | string,
        private date: Date,
        private details: NotifyDetails | null
    ) {
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
        this.statusElement.classList.add(this.status);
        this.statusElement.innerText = this.status;
        if (this.msg instanceof Node) {
            this.msgElement.appendChild(this.msg);
        } else {
            this.msgElement.innerText = this.msg;
        }
        this.timeElement1.setAttribute('timestamp', this.date.getTime().toString());
        this.timeElement2.setAttribute('timestamp', this.date.getTime().toString());
        if (this.details === null) {
            return;
        }
        if (this.details.html !== undefined) {
            this.htmlDetailsContainer.classList.remove('hide');
            this.htmlDetails.appendChild(this.details.html);
        }
        if (this.details.raw !== undefined) {
            this.rawDetailsContainer.classList.remove('hide');
            //TODO: async, mit loading spinner
            // oder (ab bestimmter größe) link, der raw im neuen tab öffnet
            //TODO: check instance of Error -> anders printen
            this.rawDetails.appendChild(new OylJson(this.details.raw));
        }
    }
}

export default OylNotifyDetails;