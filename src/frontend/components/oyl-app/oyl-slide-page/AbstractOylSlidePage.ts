import html from "./oyl-slide-page.html";
import scss from "./oyl-slide-page.scss";
import Component from "../../component";
import ControllerComponentInterface from "../../ControllerComponentInterface";
import OylSlidePageController from "./OylSlidePageController";

abstract class AbstractOylSlidePage extends Component implements ControllerComponentInterface {

    private readonly _controller: OylSlidePageController;

    get controller(): OylSlidePageController {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylSlidePageController(this);
    }
}

export default AbstractOylSlidePage;