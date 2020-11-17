import AbstractController from "../AbstractController";
import ControllerInterface from "../ControllerInterface";
import OylApp from "./oyl-app";

class OylAppController extends AbstractController implements ControllerInterface {

    private readonly _component: OylApp;

    constructor(component: OylApp) {
        super();
        this._component = component;
    }
}

export default OylAppController;