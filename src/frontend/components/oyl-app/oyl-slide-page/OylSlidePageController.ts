import AbstractController from "../../AbstractController";
import OylSlidePage from "./oyl-slide-page";

class OylSlidePageController extends AbstractController {

    private readonly _component: OylSlidePage;

    constructor(component: OylSlidePage) {
        super();
        this._component = component;
    }
}

export default OylSlidePageController;