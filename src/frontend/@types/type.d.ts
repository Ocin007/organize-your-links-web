declare type PageID = string;
declare interface DescriptorFuncWithFirstArg<T> extends PropertyDescriptor {
    value?: (component: T, ...args: any[]) => void
}