import AbstractController from "../../AbstractController";
import ControllerInterface from "../../ControllerInterface";
import OylNavBar from "./oyl-nav-bar";

class OylNavBarController extends AbstractController implements ControllerInterface {

    private readonly _component: OylNavBar;

    constructor(component: OylNavBar) {
        super();
        this._component = component;
    }
}

export default OylNavBarController;