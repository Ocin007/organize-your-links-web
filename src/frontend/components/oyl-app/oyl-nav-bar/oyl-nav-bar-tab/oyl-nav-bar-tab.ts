import html from "./oyl-nav-bar-tab.html";
import scss from "./oyl-nav-bar-tab.scss";
import {ComponentReady, OylComponent} from "../../../../decorators/decorators";
import Component from "../../../component";
import NavEvent from "../../../../events/NavEvent";

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
        return ['page-id', 'active'];
    }

    @ComponentReady()
    connectedCallback(): void {
        this.onclick = () => this.dispatchEvent(new NavEvent(this.getAttribute('page-id')));
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        switch (name) {
            case 'page-id':
                this.divElement.innerText = this.pages.get(newVal).label;
                break;
            case 'active':
                this.setActive(newVal === 'true');
                break;
        }
    }

    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }

    private setActive(bool: boolean): void {
        if (bool) {
            if (!this.divElement.classList.contains('active')) {
                this.divElement.classList.add('active');
            }
        } else {
            this.divElement.classList.remove('active');
        }
    }
}

export default OylNavBarTab;