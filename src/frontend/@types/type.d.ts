declare type PageID = string;
declare interface DescriptorFuncWithFirstArg<T> extends PropertyDescriptor {
    value?: (component: T, ...args: any[]) => void
}
declare type NotifyDetails = {
    html?: HTMLElement,
    raw?: Object
};
declare type NotifySettings = {
    visible: boolean,
    autoClose: boolean,
    interval: number
}