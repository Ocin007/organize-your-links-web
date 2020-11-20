import {Events} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class NavEvent<T = any> extends AbstractBubblingEvent<T> {

    readonly pageId: PageID;

    constructor(pageId: PageID, eventInitDict?: CustomEventInit<T>) {
        super(Events.Nav, eventInitDict);
        this.pageId = pageId;
    }
}

export default NavEvent;