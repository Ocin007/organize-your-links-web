import html from "./oyl-header.html";
import scss from "./oyl-header.scss";
import Component from "../../component";

abstract class AbstractOylHeader extends Component {

    constructor() {
        super(html, scss);
    }
}

export default AbstractOylHeader;