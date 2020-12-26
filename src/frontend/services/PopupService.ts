class PopupService implements PopupServiceInterface {

    private popups: PopupObject[] = [];
    private lastPopResolver: (popupObject: PopupObject) => void;

    push(config: PopupConfig): Promise<ButtonName> {
        return new Promise<ButtonName>((resolve, reject) => {
            let popupObject: PopupObject = {
                config: config,
                buttonClicked: resolve,
                aborted: reject
            };
            if (this.lastPopResolver !== undefined) {
                this.lastPopResolver(popupObject);
                this.lastPopResolver = undefined;
            } else {
                this.popups.push(popupObject);
            }
        });
    }

    pop(): Promise<PopupObject> {
        return new Promise<PopupObject>(resolve => {
            let config = this.popups.shift();
            if (config === undefined) {
                this.lastPopResolver = resolve;
            } else {
                resolve(config);
            }
        });
    }

    hasPopups(): boolean {
        return this.popups.length !== 0;
    }
}

export default PopupService;