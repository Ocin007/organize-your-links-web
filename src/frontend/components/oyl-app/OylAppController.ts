import AbstractController from "../AbstractController";
import OylApp from "./oyl-app";

class OylAppController extends AbstractController {

    private readonly _component: OylApp;

    constructor(component: OylApp) {
        super();
        this._component = component;
    }
}

export default OylAppController;