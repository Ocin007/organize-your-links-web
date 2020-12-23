class DependencyInjector {

    private static dependencyRegistry: DependencyMap = new Map<string, {name: string, paramIndex: number}[]>();
    private static injectables: InjectableMap = new Map<string, Injectable>();

    static addInjectable(className: string, constructor: ConstructorFunction, provider?: ConstructorFunction<ProviderInterface>, alias?: string): void {
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
        let dependency = {name: dependencyName, paramIndex: argIndex};
        if (dependencyList === undefined) {
            this.dependencyRegistry.set(className, [dependency]);
            return;
        }
        dependencyList.push(dependency);
        dependencyList.sort((a, b) => a.paramIndex - b.paramIndex);
    }

    static injectParameters(className: string, oldArgs: any[]): any[] {
        let dependencyList = this.dependencyRegistry.get(className);
        if (dependencyList === undefined) {
            return oldArgs;
        }
        let newArgs: any[] = [];
        for (let paramIndex = 0, d = 0; d < dependencyList.length; paramIndex++) {
            if (paramIndex === dependencyList[d].paramIndex) {
                let injectable = this.injectables.get(dependencyList[d].name);
                if (injectable === undefined) {
                    throw new Error(`DependencyInjector: ${dependencyList[d].name} is not an injectable dependency.`);
                }
                this.addInstanceToInjectable(injectable);
                newArgs.push(injectable.instance);
                d++;
            } else {
                newArgs.push(oldArgs[paramIndex]);
            }
        }
        for (let i = 0; i < oldArgs.length; i++) {
            if (oldArgs[i] !== undefined) {
                newArgs[i] = oldArgs[i];
            }
        }
        return newArgs;
    }

    static hasDependencies(className: string): boolean {
        return this.dependencyRegistry.get(className) !== undefined;
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