class DependencyInjector {

    private static dependencyRegistry: DependencyMap = new Map<string, string[]>();
    private static injectables: InjectableMap = new Map<string, Injectable>();

    static addInjectable(dependency: Dependency): void {
        if (this.injectables.has(dependency.injectable.name)) {
            throw new Error(`DependencyInjector: ${dependency.injectable.name} was already added as dependency.`);
        }
        if (dependency.alias !== undefined && this.injectables.has(dependency.alias)) {
            throw new Error(`DependencyInjector: alias ${dependency.alias} for ${dependency.injectable.name} was already added as dependency.`);
        }
        let injectable: Injectable = {
            constructor: dependency.injectable,
            multi: dependency.multi === true
        };
        if (dependency.provider !== undefined) {
            injectable.provider = new dependency.provider();
        }
        this.injectables.set(dependency.injectable.name, injectable);
        if (dependency.alias !== undefined) {
            this.injectables.set(dependency.alias, injectable);
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
        if (injectable.instance !== undefined && !injectable.multi) {
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