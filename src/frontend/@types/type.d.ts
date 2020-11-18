declare type PageID = string;
declare enum EventType {
    Nav = 'navEvent',
    Notify = 'notifyEvent',
    Popup = 'popupEvent'
}
declare enum Status {
    SUCCESS,
    INFO,
    WARN,
    ERROR
}