interface ServiceInterface {
    isInitialised: boolean;
    init(): Promise<void>;
}

export default ServiceInterface;