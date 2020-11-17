import html from './oyl-page-frame.html';
import scss from './oyl-page-frame.scss';
import Component from '../../component';
import ControllerComponentInterface from '../../ControllerComponentInterface';
import ControllerInterface from '../../ControllerInterface';
import OylPageFrameController from './OylPageFrameController';

class AbstractOylPageFrame extends Component implements ControllerComponentInterface {

    private readonly _controller: ControllerInterface;

    get controller(): ControllerInterface {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylPageFrameController(this);
    }
}

export default AbstractOylPageFrame;