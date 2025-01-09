import {Card, CardBody, Col, Row} from "react-bootstrap";
import SimonColorPicker from "../../../utils/SimonColorPicker.jsx";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class ColorLoginPage extends Component {
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
                    <Card className="shadow-sm my-3">
                        <CardBody>
                            <h5>
                                <i className="bi bi-wordpress text-primary mx-2"></i>
                                WordPress Login Seite
                            </h5>
                            <hr/>
                            <h6>
                                <i className="bi bi-arrow-right-short me-1"></i>
                                 Login-Form
                            </h6>
                            <hr/>

                            <Row className="g-3">
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.login_site_bg || ''}
                                            handle="login_site_bg"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Hintergrundfarbe
                                        </div>
                                    </div>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.login_site_color || ''}
                                            handle="login_site_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Schriftfarbe
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <hr/>
                            <h6>
                                <i className="bi bi-arrow-right-short me-1"></i>
                                Button Login-Form
                            </h6>
                            <hr/>
                            <Row className="g-3">
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.login_site_btn_bg || ''}
                                            handle="login_site_btn_bg"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                          Button <span className="fw-light">Hintergrundfarbe</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.login_site_btn_color || ''}
                                            handle="login_site_btn_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                           Button <span className="fw-light">Schriftfarbe</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Fragment>}
            </Fragment>
        )
    }
}