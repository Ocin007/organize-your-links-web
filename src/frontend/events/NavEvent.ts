import {EventType} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class NavEvent<T = any> extends AbstractBubblingEvent<T> {

    readonly pageId: PageID;

    constructor(pageId: PageID, eventInitDict?: CustomEventInit<T>) {
        super(EventType.Nav, eventInitDict);
        this.pageId = pageId;
    }
}

export default NavEvent;