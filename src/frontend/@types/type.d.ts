declare type PageID = string;
declare interface DescriptorFuncWithFirstArg<T> extends PropertyDescriptor {
    value?: (component: T, ...args: any[]) => void
}
declare type NotifyDetails = {
    html?: HTMLElement,
    raw?: Object
};
declare type NotifyConfig = {
    visible: boolean,
    autoClose: boolean,
    interval: number
};
declare type NotifyType = 'success' | 'debug' | 'info' | 'warn' | 'error';
declare interface ConstructorFunction<T = Object> extends Function {
    new (...args: any[]): T
}
declare interface ComponentConstructor extends ConstructorFunction<HTMLElement> {
    tagName: string;
}
declare interface ProviderInterface {
    getInstance(constructor: ConstructorFunction): Object;
}
declare type Injectable = {
    constructor: ConstructorFunction,
    instance?: Object,
    provider?: ProviderInterface
};
declare type DependencyMap = Map<string, {name: string, index: number}[]>;
declare type InjectableMap = Map<string, Injectable>;