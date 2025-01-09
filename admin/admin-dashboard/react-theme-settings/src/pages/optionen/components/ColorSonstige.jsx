import {Card, CardBody, Col, Form, Row} from "react-bootstrap";
import SimonColorPicker from "../../../utils/SimonColorPicker.jsx";
import {v4 as uuidv4} from "uuid";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;

export default class ColorSonstige extends Component {
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
                            <Row className="g-3">
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.link_color || ''}
                                            handle="link_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Link <span className="fw-light">Farbe</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.link_aktiv_color || ''}
                                            handle="link_aktiv_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Link aktiv <span className="fw-light">Farbe</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.link_hover_color || ''}
                                            handle="link_hover_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Link hover <span className="fw-light">Farbe</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card className="shadow-sm my-2">
                        <CardBody>
                            <h6>
                                <i className="bi bi-arrow-right-short me-1"></i>
                                Scroll to top Button
                            </h6>
                            <hr/>
                            <Row className="g-3">
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.scroll_btn_bg || ''}
                                            handle="scroll_btn_bg"
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
                                            color={this.props.settings.theme_design.theme_color.scroll_btn_color || ''}
                                            handle="scroll_btn_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Icon <span className="fw-light">Farbe</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <hr/>
                            <Form.Check
                                type="switch"
                                className="no-blur my-1 me-4"
                                id={uuidv4()}
                                checked={this.props.settings.theme_design.theme_color.scroll_btn_active || false}
                                onChange={(e) => this.props.onSetThemeDesignColor(e.target.checked, 'scroll_btn_active')}
                                label="Button anzeigen"
                            />
                        </CardBody>
                    </Card>
                </Fragment>}
            </Fragment>
        )
    }
}