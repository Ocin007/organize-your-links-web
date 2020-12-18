interface ServiceInterface {
    isInitialised: boolean;
    ifInitSuccessful: Promise<void>;
    init(): Promise<string[]>;
}

export default ServiceInterface;