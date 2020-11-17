import html from "./oyl-slide-page.html";
import scss from "./oyl-slide-page.scss";
import Component from "../../component";
import ControllerComponentInterface from "../../ControllerComponentInterface";
import ControllerInterface from "../../ControllerInterface";
import OylSlidePageController from "./OylSlidePageController";

abstract class AbstractOylSlidePage extends Component implements ControllerComponentInterface {

    private readonly _controller: ControllerInterface;

    get controller(): ControllerInterface {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylSlidePageController(this);
    }
}

export default AbstractOylSlidePage;