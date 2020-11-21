import ComponentReadyEvent from "../events/ComponentReadyEvent";
import Component from "../components/component";
import {Events} from "../@types/enums";

/**
 * **Class decorator**
 * <p>Adds the HTML and SCSS to the Component.</p>
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
 * **Method decorator**
 * <p>Event {@link ComponentReadyEvent} is fired when {@link connectedCallback} is executed.</p>
 * @constructor
 */
export function ComponentReady() {
    return function (target: Object, key: "connectedCallback", descriptor: PropertyDescriptor) {
        let originalFunc = descriptor.value;

        descriptor.value = function (...args: any[]) {
            let result = originalFunc.apply(this, args);
            this.dispatchEvent(new ComponentReadyEvent());
            return result;
        };

        return descriptor;
    };
}

/**
 * **Method decorator**
 * <p>Method is always executed when {@link Component component} fires an event of type {@link Events eventType}.
 * The method will only be executed once if singleExec is true.</p>
 * @constructor
 */
export function ExecOn(eventType: Events, singleExec: boolean = false) {
    return function (target: Object, key: string | symbol, descriptor: DescriptorFuncWithFirstArg<Component>) {
        let originalFunc = descriptor.value;

        descriptor.value = function (component: Component, ...args: any[]): void {
            let listener = (ev) => {
                if (ev.composedPath()[0] === component) {
                    if (singleExec) {
                        component.removeEventListener(eventType, listener);
                    }
                    originalFunc.apply(this, [component, ...args]);
                }
            };
            component.addEventListener(eventType, listener);
        };

        return descriptor;
    };
}