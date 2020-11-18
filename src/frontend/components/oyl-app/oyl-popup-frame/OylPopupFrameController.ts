import AbstractController from "../../AbstractController";
import OylPopupFrame from "./oyl-popup-frame";

class OylPopupFrameController extends AbstractController {

    private readonly _component: OylPopupFrame;

    constructor(component: OylPopupFrame) {
        super();
        this._component = component;
    }
}

export default OylPopupFrameController;