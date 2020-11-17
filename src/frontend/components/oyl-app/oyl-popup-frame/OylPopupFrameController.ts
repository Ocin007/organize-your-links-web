import AbstractController from "../../AbstractController";
import ControllerInterface from "../../ControllerInterface";
import OylPopupFrame from "./oyl-popup-frame";

class OylPopupFrameController extends AbstractController implements ControllerInterface {

    private readonly _component: OylPopupFrame;

    constructor(component: OylPopupFrame) {
        super();
        this._component = component;
    }
}

export default OylPopupFrameController;