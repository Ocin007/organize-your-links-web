import AbstractController from "../../AbstractController";
import OylNavBar from "./oyl-nav-bar";

class OylNavBarController extends AbstractController {

    private readonly _component: OylNavBar;

    constructor(component: OylNavBar) {
        super();
        this._component = component;
    }
}

export default OylNavBarController;