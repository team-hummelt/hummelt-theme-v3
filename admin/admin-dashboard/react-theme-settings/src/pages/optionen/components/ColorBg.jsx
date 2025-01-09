import {Card, CardBody, Col, Form, Row} from "react-bootstrap";
import SimonColorPicker from "../../../utils/SimonColorPicker.jsx";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class ColorBg extends Component {
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
                                Hintergrundfarbe Seite
                            </h6>
                            <hr/>
                            <Row className="g-3">
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.site_bg || ''}
                                            handle="site_bg"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                           Seiten <span className="fw-light">Hintergrundfarbe</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.nav_bg || ''}
                                            handle="nav_bg"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Navigation <span className="fw-light">Hintergrundfarbe</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <hr/>
                            <Form.Check
                                type="switch"
                                className="no-blur my-1 me-4"
                                id={uuidv4()}
                                checked={this.props.settings.theme_design.theme_color.nav_shadow_aktiv || false}
                                onChange={(e) => this.props.onSetThemeDesignColor(e.target.checked, 'nav_shadow_aktiv')}
                                label="Navigation Schatten"
                            />
                        </CardBody>
                    </Card>
                    <Card className="shadow-sm my-2">
                        <CardBody>
                            <h6>
                                <i className="bi bi-arrow-right-short me-1"></i>
                                Footer Color
                            </h6>
                            <hr/>
                            <Row className="g-3">
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.footer_bg || ''}
                                            handle="footer_bg"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Footer <span className="fw-light">Hintergrundfarbe</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.static_footer_color || ''}
                                            handle="static_footer_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Footer <span className="fw-light">Schriftfarbe</span>
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
                                Top Area
                            </h6>
                            <hr/>
                            <Row className="g-3">
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.top_area_bg_color || ''}
                                            handle="top_area_bg_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Top Area <span className="fw-light">Hintergrundfarbe</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.top_area_font_color || ''}
                                            handle="top_area_font_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Top Area <span className="fw-light">Schriftfarbe</span>
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
                                Widget Sidebar
                            </h6>
                            <hr/>
                            <Row className="g-3">
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.widget_bg || ''}
                                            handle="widget_bg"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Widget <span className="fw-light">Hintergrundfarbe</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xxl={3} xl={4} lg={6} xs={12}>
                                    <div className="d-flex align-items-center">
                                        <SimonColorPicker
                                            color={this.props.settings.theme_design.theme_color.widget_border_color || ''}
                                            handle="widget_border_color"
                                            callback={this.onPickrCallback}
                                        />
                                        <div className="fw-semibold ms-2">
                                            Widget <span className="fw-light">Border-Farbe</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <hr/>
                            <Form.Check
                                type="switch"
                                className="no-blur my-1 me-4"
                                id={uuidv4()}
                                checked={this.props.settings.theme_design.theme_color.widget_border_aktiv || false}
                                onChange={(e) => this.props.onSetThemeDesignColor(e.target.checked, 'widget_border_aktiv')}
                                label="Widget Border anzeigen"
                            />
                        </CardBody>
                    </Card>
                </Fragment>}
            </Fragment>
        )
    }
}