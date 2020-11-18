class PopupEvent<T = any> extends CustomEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(EventType.Popup, eventInitDict);
    }

}

export default PopupEvent;