class Bootstrapper {

    private static module: any;

    static bootstrapModule<T>(module: ConstructorFunction<T>): void {
        this.module = new module();
    }
}

export default Bootstrapper;