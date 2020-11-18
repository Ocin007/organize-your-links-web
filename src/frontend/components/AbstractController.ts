import ServiceProvider from "../services/ServiceProvider";
import PageProvider from "./pages/PageProvider";

class AbstractController {

    protected readonly services: ServiceProvider;
    protected readonly pages: PageProvider;

    protected constructor() {
        this.services = ServiceProvider.instance;
        this.pages = PageProvider.instance;
    }
}

export default AbstractController;