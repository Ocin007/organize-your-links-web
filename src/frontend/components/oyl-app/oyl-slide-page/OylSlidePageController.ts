import AbstractController from "../../AbstractController";
import ControllerInterface from "../../ControllerInterface";
import OylSlidePage from "./oyl-slide-page";

class OylSlidePageController extends AbstractController implements ControllerInterface {

    private readonly _component: OylSlidePage;

    constructor(component: OylSlidePage) {
        super();
        this._component = component;
    }
}

export default OylSlidePageController;