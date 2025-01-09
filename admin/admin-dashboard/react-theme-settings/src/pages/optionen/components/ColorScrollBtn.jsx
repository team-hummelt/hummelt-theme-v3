import {Card, CardBody, Col, Form, Row} from "react-bootstrap";
import SimonColorPicker from "../../../utils/SimonColorPicker.jsx";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class ColorScrollBtn extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {

        }
        this.onPickrCallback = this.onPickrCallback.bind(this);
    }
    onPickrCallback(color, handle) {
        this.props.onSetThemeDesignColor(color, handle)
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_design &&
                <Fragment>
                    <Card className="shadow-sm my-2">
                        <CardBody>
                            <h6>
                                <i className="bi bi-arrow-right-short me-1"></i>
                                Link Farben
                            </h6>
                            <hr/>

                        </CardBody>
                    </Card>
                </Fragment>}
            </Fragment>
        )
    }
}