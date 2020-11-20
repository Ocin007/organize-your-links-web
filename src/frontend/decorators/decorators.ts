import ComponentReadyEvent from "../events/ComponentReadyEvent";

/**
 * Class decorator
 * @param options
 * @constructor
 */
export function OylComponent(options: { html: string, scss: string }) {
    return function (constructor: Function) {
        constructor.prototype.html = options.html;
        constructor.prototype.scss = options.scss;
    }
}

/**
 * Method decorator
 * @constructor
 */
export function ComponentReady() {
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        let originalFunc = descriptor.value;

        descriptor.value = function (...args: any[]) {
            let result = originalFunc.apply(this, args);
            this.dispatchEvent(new ComponentReadyEvent());
            return result;
        };

        return descriptor;
    };
}