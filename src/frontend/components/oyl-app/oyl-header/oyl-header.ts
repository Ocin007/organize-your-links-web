import html from "./oyl-header.html";
import scss from "./oyl-header.scss";
import {ComponentReady, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";
import NotifyEvent from "../../../events/NotifyEvent";
import {Status} from "../../../@types/enums";

@OylComponent({
    html: html,
    scss: scss
})
class OylHeader extends Component {

    protected heading: HTMLHeadingElement;

    //TODO: remove this
    private statusList: Status[] = [
        Status.SUCCESS,
        Status.DEBUG,
        Status.INFO,
        Status.WARN,
        Status.ERROR
    ]

    static get tagName(): string {
        return 'oyl-header';
    }

    static get observedAttributes() {
        return ['title'];
    }

    @ComponentReady()
    connectedCallback(): void {
        //TODO: remove this
        this.addEventListener('click', () => {
            let i = Math.floor(Math.random() * 5);
            this.dispatchEvent(new NotifyEvent(this.statusList[i], 'test '+i));
        });
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        this.heading.innerText = newVal;
    }

    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }
}

export default OylHeader;