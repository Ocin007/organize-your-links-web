import ServiceProvider from "../services/ServiceProvider";
import PageProvider from "./pages/PageProvider";
import ControllerInterface from "./ControllerInterface";

class AbstractController implements ControllerInterface {

    protected get services(): ServiceProvider {
        return ServiceProvider.instance;
    }

    protected get pages(): PageProvider {
        return PageProvider.instance;
    }
}

export default AbstractController;