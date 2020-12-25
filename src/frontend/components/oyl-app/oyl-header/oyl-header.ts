import html from "./oyl-header.html";
import scss from "./oyl-header.scss";
import { ComponentConnected, ComponentDisconnected, Inject, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";
import { NotificationServiceInterface } from "../../../@types/types";

@OylComponent({
    html: html,
    scss: scss
})
class OylHeader extends Component {

    protected heading: HTMLHeadingElement;

    //TODO: remove this
    private readonly statusList: ((...args: any[]) => any)[];
    constructor(
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface
    ) {
        super();
        this.statusList = [
            (msg: string) => this.notifier.success(msg),
            (msg: string) => this.notifier.debug(msg),
            (msg: string) => this.notifier.info(msg),
            (msg: string) => this.notifier.warn(msg),
            (msg: string) => this.notifier.error(msg),
        ];
    }

    static get tagName(): string {
        return 'oyl-header';
    }

    static get observedAttributes() {
        return ['title'];
    }

    @ComponentConnected()
    connectedCallback(): void {
        //TODO: remove this
        this.addEventListener('click', () => {
            let i = Math.floor(Math.random() * 5);
            this.statusList[i](`test ${i}`);
        });
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        this.heading.innerText = newVal;
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }
}

export default OylHeader;