import ServiceProvider from "../services/ServiceProvider";
import PageProvider from "./pages/PageProvider";

class AbstractController {

    protected get services(): ServiceProvider {
        return ServiceProvider.instance;
    }

    protected get pages(): PageProvider {
        return PageProvider.instance;
    }
}

export default AbstractController;