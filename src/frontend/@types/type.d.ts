declare type PageID = string;
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
declare type Injectable = {
    constructor: ConstructorFunction,
    instance?: Object,
    provider?: ProviderInterface
};
declare type DependencyMap = Map<string, {name: string, index: number}[]>;
declare type InjectableMap = Map<string, Injectable>;



declare interface DescriptorFuncWithFirstArg<T> extends PropertyDescriptor {
    value?: (component: T, ...args: any[]) => void
}
declare interface ConstructorFunction<T = Object> extends Function {
    new (...args: any[]): T
}
declare interface ComponentConstructor extends ConstructorFunction<HTMLElement> {
    tagName: string;
}
declare interface RestServiceInterface {
    isInitialised: boolean;

    //TODO: rename to whenInitSuccessful, vielleicht besser als methode?
    ifInitSuccessful: Promise<void>;
    init(): Promise<string[]>;
    readonly successMessage: string;
    readonly errorMessage: string;
}
declare interface Observer<T extends any> {
    update(newValue: T): void;
}
declare interface Observable<T extends any[]> {
    subscribe<K>(observer: Observer<K>, watch?: T): void;
    unsubscribe<K>(observer: Observer<K>, watch?: T): void;
}
declare interface ProviderInterface {
    getInstance(constructor: ConstructorFunction): Object;
}
declare interface RestClientInterface {
    get(route: string): Promise<any>;
    put(route: string, data?: object): Promise<any>;
    post(route: string, data?: object): Promise<any>;
    delete(route: string, data?: object): Promise<any>;
}