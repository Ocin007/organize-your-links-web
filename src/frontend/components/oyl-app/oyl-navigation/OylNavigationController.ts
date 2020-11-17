import AbstractController from "../../AbstractController";
import ControllerInterface from "../../ControllerInterface";
import OylNavigation from "./oyl-navigation";

class OylNavigationController extends AbstractController implements ControllerInterface {

    private readonly _component: OylNavigation;

    constructor(component: OylNavigation) {
        super();
        this._component = component;
    }
}

export default OylNavigationController;