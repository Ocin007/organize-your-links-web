interface ServiceInterface {
    isInitialised: boolean;
    init(): Promise<boolean>;
}

export default ServiceInterface;