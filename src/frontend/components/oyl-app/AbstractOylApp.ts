import html from './oyl-app.html';
import scss from './oyl-app.scss';
import Component from '../component';
import ControllerComponentInterface from "../../interfaces/ControllerComponentInterface";
import ControllerInterface from "../../interfaces/ControllerInterface";
import OylAppController from "./OylAppController";

class AbstractOylApp extends Component implements ControllerComponentInterface {

    private readonly _controller: ControllerInterface;

    get controller(): ControllerInterface {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylAppController(this);
    }
}

export default AbstractOylApp;