interface ServiceInterface {
    isInitialised: boolean;
    ifInitSuccessful: Promise<void>;
    init(): Promise<boolean>;
}

export default ServiceInterface;