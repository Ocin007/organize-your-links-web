import ServiceProvider from "../services/ServiceProvider";

class AbstractController {

    protected readonly services: ServiceProvider;

    protected constructor() {
        this.services = ServiceProvider.instance;
    }
}

export default AbstractController;