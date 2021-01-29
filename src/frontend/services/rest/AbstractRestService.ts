abstract class AbstractRestService implements RestServiceInterface {

    protected _isInitialised: boolean = false;

    private readonly _initSuccessful: Promise<string[]>;
    protected initResolve: (errors: string[]) => void;
    protected initReject: (error: Error) => void;

    protected constructor() {
        this._initSuccessful = new Promise<string[]>((resolve, reject) => {
            this.initResolve = resolve;
            this.initReject = reject;
        });
    }

    whenInitSuccessful(): Promise<string[]> {
        return this._initSuccessful;
    }

    get isInitialised(): boolean {
        return this._isInitialised;
    }

    abstract get successMessage(): string;

    abstract get errorMessage(): string;

    abstract async init(): Promise<string[]>;
}

export default AbstractRestService;