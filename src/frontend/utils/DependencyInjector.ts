class DependencyInjector {

    private static dependencyRegistry: DependencyMap = new Map<string, {name: string, index: number}[]>();
    private static injectables: InjectableMap = new Map<string, Injectable>();

    static addInjectable(className: string, constructor: ConstructorFunction, provider?: new () => ProviderInterface, alias?: string): void {
        if (this.injectables.has(className)) {
            throw new Error(`DependencyManager: ${className} was already added as dependency.`);
        }
        if (alias !== undefined && this.injectables.has(alias)) {
            throw new Error(`DependencyManager: alias ${alias} for ${className} was already added as dependency.`);
        }
        let injectable: Injectable = {constructor: constructor};
        if (provider !== undefined) {
            injectable.provider = new provider();
        }
        this.injectables.set(className, injectable);
        if (alias !== undefined) {
            this.injectables.set(alias, injectable);
        }
    }

    static registerDependency(className: string, dependencyName: string, argIndex: number): void {
        let dependencyList = this.dependencyRegistry.get(className);
        let dependency = {name: dependencyName, index: argIndex};
        if (dependencyList === undefined) {
            this.dependencyRegistry.set(className, [dependency]);
            return;
        }
        dependencyList.push(dependency);
        dependencyList.sort((a, b) => a.index - b.index);
    }

    static getInjectableParameters(className: string): Object[] {
        let dependencyList = this.dependencyRegistry.get(className);
        if (dependencyList === undefined) {
            return [];
        }
        let injectables: (Object|undefined)[] = [];
        for (let i = 0, d = 0; d < dependencyList.length; i++) {
            if (i === dependencyList[d].index) {
                let injectable = this.injectables.get(dependencyList[d].name);
                if (injectable === undefined) {
                    throw new Error(`DependencyManager: ${dependencyList[d].name} is not an injectable dependency.`);
                }
                this.addInstanceToInjectable(injectable);
                injectables.push(injectable.instance);
                d++;
            } else {
                injectables.push(undefined);
            }
        }
        return injectables;
    }

    private static addInstanceToInjectable(injectable: Injectable): void {
        if (injectable.instance === undefined) {
            if (injectable.provider === undefined) {
                injectable.instance = new injectable.constructor();
            } else {
                injectable.instance = injectable.provider.getInstance(injectable.constructor);
            }
        }
    }
}

export default DependencyInjector;