import ComponentConnectedEvent from "../events/ComponentConnectedEvent";
import Component from "../components/component";
import {Events} from "../@types/enums";
import DependencyInjector from "../utils/DependencyInjector";
import ComponentDisconnectedEvent from "../events/ComponentDisconnectedEvent";

/**
 * **Class decorator**
 * <p>Marks class as a module. The components in declarations will be defined as custom elements and the
 * classes in dependencies will be injected into classes decorated with {@link InjectionTarget}.</p>
 * @param options
 * @constructor
 */
export function OylModule(options: {
    declarations: ComponentConstructor[],
    dependencies: {
        injectable: ConstructorFunction,
        provider?: ConstructorFunction<ProviderInterface>,
        alias?: string
    }[]
}) {
    return function (_) {
        options.dependencies.forEach(dep => {
            DependencyInjector.addInjectable(dep.injectable.name, dep.injectable, dep.provider, dep.alias);
        });
        for (let component of options.declarations) {
            window.customElements.define(component.tagName, component);
        }
    }
}

/**
 * **Class decorator**
 * <p>Adds the HTML and SCSS to the component and injects dependencies specified via {@link Inject}.</p>
 * @param options
 * @constructor
 */
export function OylComponent(options: { html: string, scss: string }) {
    return function (constructor: ConstructorFunction) {
        constructor.prototype.html = options.html;
        constructor.prototype.scss = options.scss;

        if (DependencyInjector.hasDependencies(constructor.name)) {
            return InjectionTarget()(constructor);
        }
    }
}

/**
 * **Class decorator**
 * <p>Inject dependencies as constructor parameters which are decorated with {@link Inject}.</p>
 * @constructor
 */
export function InjectionTarget() {
    return function (constructor: ConstructorFunction) {
        let newClass: any = class extends constructor {
            constructor(...oldArgs: any[]) {
                let newArgs = DependencyInjector.injectParameters(constructor.name, oldArgs);
                super(...newArgs);
            }
        }
        Object.defineProperty(newClass, 'name', {
            value: constructor.name
        });
        return newClass;
    }
}

/**
 * **Parameter decorator**
 * <p>An instance of the class specified by dependency will be added via dependency injection.</p>
 * <p>Use this decorator only for constructor parameters. The classes where this decorator is used
 * must be decorated with {@link InjectionTarget}.</p>
 * @param dependency The name of the class (or alias) which should be injected.
 * @constructor
 */
export function Inject(dependency: string) {
    return function (target: ConstructorFunction, key: string | symbol, parameterIndex: number) {
        if (target.name === undefined) {
            throw new Error('Decorator @Inject: use decorator only for constructor parameters.');
        }
        DependencyInjector.registerDependency(target.name, dependency, parameterIndex);
    }
}

/**
 * **Method decorator**
 * <p>Event {@link ComponentConnectedEvent} is fired when method is executed.</p>
 * @constructor
 */
export function ComponentConnected() {
    return Dispatch(ComponentConnectedEvent);
}

/**
 * **Method decorator**
 * <p>Event {@link ComponentDisconnectedEvent} is fired when method is executed.</p>
 * @constructor
 */
export function ComponentDisconnected() {
    return Dispatch(ComponentDisconnectedEvent);
}

/**
 * **Method decorator**
 * <p>Event is fired when method is executed.</p>
 * @constructor
 */
export function Dispatch(event: new () => Event) {
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        let originalFunc = descriptor.value;

        descriptor.value = function (...args: any[]) {
            let result = originalFunc.apply(this, args);
            this.dispatchEvent(new event());
            return result;
        };

        return descriptor;
    };
}

/**
 * **Method decorator**
 * <p>Method is executed once when {@link Component component} fires an event of type {@link Events eventType}.
 * The method will be executed on every {@link Events eventType} if singleExec is false.</p>
 * @param eventType Events
 * @param singleExec boolean
 * @constructor
 */
export function ExecOn(eventType: Events, singleExec: boolean = true) {
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

/**
 * **Method decorator**
 * <p>Method executed on {@link ComponentConnectedEvent}.</p>
 * @see ExecOn
 * @constructor
 */
export function ExecOnReady(singleExec: boolean = true) {
    return ExecOn(Events.Connected, singleExec);
}
