class NotifyEvent<T = any> extends CustomEvent<T> {

    private status: Status;
    private msg: string;

    constructor(status: Status, msg: string, eventInitDict?: CustomEventInit<T>) {
        super(EventType.Notify, eventInitDict);
        this.status = status;
        this.msg = msg;
    }

}

export default NotifyEvent;