import html from "./oyl-popup-frame.html";
import scss from "./oyl-popup-frame.scss";
import { ComponentConnected, ComponentDisconnected, Inject, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";
import OylOpacityLayer from "../../common/oyl-opacity-layer/oyl-opacity-layer";

@OylComponent({
    html: html,
    scss: scss
})
class OylPopupFrame extends Component {

    private static DELAY: number = 200;

    protected opacityLayer: OylOpacityLayer;
    protected container: HTMLDivElement;
    protected popupElement: HTMLDivElement;
    protected header: HTMLHeadingElement;
    protected description: HTMLDivElement;
    protected buttonContainer: HTMLDivElement;

    private onOpacityLayerClick: () => void;

    static get tagName(): string {
        return 'oyl-popup-frame';
    }

    static get observedAttributes() {
        return [];
    }

    constructor(
        @Inject('PopupServiceInterface') private popupService: PopupServiceInterface
    ) {
        super();
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.waitForNewPopup();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    private waitForNewPopup(): void {
        this.popupService.pop().then(popup => this.renderPopup(popup));
    }

    private renderPopup(popup: PopupObject) {
        this.setPopupSize(popup.config.width, popup.config.height);
        this.renderTitle(popup.config.title);
        this.renderDescription(popup.config.description);
        this.renderButtons(popup.config.buttons, popup.buttonClicked);
        this.showOpacityLayer(popup.aborted);
        this.showPopup();
    }

    private closePopup(): void {
        this.opacityLayer.removeEventListener('click', this.onOpacityLayerClick);
        this.popupElement.classList.remove('popup-fade-in');
        if (!this.popupService.hasPopups()) {
            this.opacityLayer.setAttribute('visible', 'false');
        }
        setTimeout(() => {
            this.resetPopupSize();
            this.resetTitle();
            this.resetDescription();
            this.resetButtons();
            this.container.classList.remove('popup-container-visible');
            this.waitForNewPopup();
        }, OylPopupFrame.DELAY);
    }

    private showPopup(): void {
        this.container.classList.add('popup-container-visible');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.popupElement.classList.add('popup-fade-in');
            });
        });
    }

    private renderTitle(title?: { text: string; style?: string }) {
        if (title !== undefined) {
            this.header.innerText = title.text;
            this.header.style.cssText = title.style ?? '';
        }
    }

    private resetTitle(): void {
        this.header.innerText = '';
        this.header.style.cssText = '';
    }

    private renderDescription(description?: { text: string; style?: string } | HTMLElement): void {
        if (description === undefined) {
            return;
        }
        if (description instanceof HTMLElement) {
            this.description.appendChild(description);
        } else {
            this.description.innerText = description.text;
            this.description.style.cssText = description.style ?? '';
        }
    }

    private resetDescription(): void {
        this.description.innerText = '';
        this.description.innerHTML = '';
    }

    private renderButtons(
        buttons: {text: string; id: ButtonName; type: ButtonType}[] = [],
        buttonClicked: (id: ButtonName) => void
    ): void {
        if (buttons.length === 0) {
            return;
        }
        this.buttonContainer.classList.add('has-buttons');
        buttons.forEach(button => {
            let element = OylPopupFrame.createButton(button);
            element.addEventListener('click', _ => {
                this.closePopup();
                buttonClicked(button.id);
            }, {once: true});
            this.buttonContainer.appendChild(element);
        });
    }

    private resetButtons(): void {
        this.buttonContainer.classList.remove('has-buttons');
        this.buttonContainer.innerText = '';
        this.buttonContainer.innerHTML = '';
    }

    private static createButton(button: {text: string; id: ButtonName; type: ButtonType}): HTMLElement {
        let element = document.createElement('div');
        element.classList.add(button.type);
        element.innerText = button.text;
        return element;
    }

    private setPopupSize(width: PopupSize = 'small', height: PopupSize = 'small') {
        if (width === 'big') {
            this.popupElement.classList.add('popup-max-width');
        }
        if (height === 'big') {
            this.popupElement.classList.add('popup-max-height');
        }
    }

    private resetPopupSize(): void {
        this.popupElement.classList.remove('popup-max-width');
        this.popupElement.classList.remove('popup-max-height');
    }

    private showOpacityLayer(aborted: () => void): void {
        this.opacityLayer.setAttribute('visible', 'true');
        this.onOpacityLayerClick = () => {
            this.closePopup();
            aborted();
        };
        this.opacityLayer.addEventListener('click', this.onOpacityLayerClick, {once: true});
    }
}

export default OylPopupFrame;