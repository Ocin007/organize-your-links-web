class DependencyInjector {

    private static dependencyRegistry: DependencyMap = new Map<string, string[]>();
    private static injectables: InjectableMap = new Map<string, Injectable>();

    static addInjectable(className: string, constructor: ConstructorFunction, provider?: ConstructorFunction<ProviderInterface>, alias?: string): void {
        if (this.injectables.has(className)) {
            throw new Error(`DependencyInjector: ${className} was already added as dependency.`);
        }
        if (alias !== undefined && this.injectables.has(alias)) {
            throw new Error(`DependencyInjector: alias ${alias} for ${className} was already added as dependency.`);
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
        if (dependencyList === undefined) {
            dependencyList = [];
            this.dependencyRegistry.set(className, dependencyList);
        }
        dependencyList[argIndex] = dependencyName;
    }

    static injectParameters(className: string, oldArgs: any[]): any[] {
        if (!this.hasDependencies(className)) {
            return oldArgs;
        }
        let dependencyList: string[] = this.dependencyRegistry.get(className);
        let newArgs: any[] = [];
        for (let index = 0; index < Math.max(oldArgs.length, dependencyList.length); index++) {
            if (oldArgs[index] !== undefined) {
                newArgs[index] = oldArgs[index];
            } else if (dependencyList[index] === undefined) {
                newArgs[index] = undefined;
            } else {
                let injectable = this.injectables.get(dependencyList[index]);
                if (injectable === undefined) {
                    throw new Error(`DependencyInjector: ${dependencyList[index]} is not an injectable dependency.`);
                }
                this.addInstanceToInjectable(injectable);
                newArgs[index] = injectable.instance;
            }
        }
        return newArgs;
    }

    static hasDependencies(className: string): boolean {
        return this.dependencyRegistry.get(className) !== undefined;
    }

    private static addInstanceToInjectable(injectable: Injectable): void {
        if (injectable.instance !== undefined) {
            return;
        }
        if (injectable.provider === undefined) {
            injectable.instance = new injectable.constructor();
        } else {
            injectable.instance = injectable.provider.getInstance(injectable.constructor);
        }
    }
}

export default DependencyInjector;