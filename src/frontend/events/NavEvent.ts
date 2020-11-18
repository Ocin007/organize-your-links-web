import Event from "../@types/event";

class NavEvent<T = any> extends CustomEvent<T> {

    readonly pageId: PageID;

    constructor(pageId: PageID, eventInitDict?: CustomEventInit<T>) {
        super(Event.NavEvent, eventInitDict);
        this.pageId = pageId;
    }
}

export default NavEvent;