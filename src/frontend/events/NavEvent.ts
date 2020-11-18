class NavEvent<T = any> extends CustomEvent<T> {

    readonly pageId: PageID;

    constructor(pageId: PageID, eventInitDict?: CustomEventInit<T>) {
        super(EventType.Nav, eventInitDict);
        this.pageId = pageId;
    }
}

export default NavEvent;