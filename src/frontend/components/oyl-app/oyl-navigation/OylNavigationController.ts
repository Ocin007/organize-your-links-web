import ControllerInterface from "../../../interfaces/ControllerInterface";
import OylNavigation from "./oyl-navigation";

class OylNavigationController implements ControllerInterface {

    private readonly _component: OylNavigation;

    constructor(component: OylNavigation) {
        this._component = component;
    }
}

export default OylNavigationController;