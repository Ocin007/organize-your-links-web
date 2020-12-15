import ApiClient from "../utils/ApiClient";
import Notifier from "../utils/Notifier";

abstract class AbstractService {

    //TODO: fällt vlt. bei dependency injection system raus
    protected notifier: Notifier;

    protected constructor() {
        this.notifier = new Notifier();
    }

    protected get api(): ApiClient {
        return ApiClient.instance;
    }
}

export default AbstractService;