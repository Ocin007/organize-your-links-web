import html from "./oyl-nav-bar-tab.html";
import scss from "./oyl-nav-bar-tab.scss";
import { ComponentConnected, ComponentDisconnected, OylComponent } from "../../../../decorators/decorators";
import Component from "../../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylNavBarTab extends Component {

    protected divElement: HTMLDivElement;

    static get tagName(): string {
        return 'oyl-nav-bar-tab';
    }

    static get observedAttributes() {
        return ['label', 'active'];
    }

    @ComponentConnected()
    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        switch (name) {
            case 'label':
                this.divElement.innerText = newVal;
                break;
            case 'active':
                this.setActive(newVal === 'true');
                break;
        }
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    private setActive(bool: boolean): void {
        if (bool) {
            this.divElement.classList.add('active');
        } else {
            this.divElement.classList.remove('active');
        }
    }
}

export default OylNavBarTab;