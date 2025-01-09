import {Card, CardBody, Col, Form, Row} from "react-bootstrap";
import SimonColorPicker from "../../../utils/SimonColorPicker.jsx";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class ColorMenu extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
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
                                    Menu Button
                                </h6>
                                <hr/>
                                <Row className="g-3">
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_btn_bg_color || ''}
                                                handle="menu_btn_bg_color"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Menu Button <span className="fw-light">Hintergrundfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_btn_color || ''}
                                                handle="menu_btn_color"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Menu Button <span className="fw-light">Schriftfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_design.theme_color.menu_uppercase || false}
                                    onChange={(e) => this.props.onSetThemeDesignColor(e.target.checked, 'menu_uppercase')}
                                    label="uppercase"
                                />
                                <div className="form-text">
                                    Menü Schrift in Großbuchstaben.
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-2">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Menu Button aktiv
                                </h6>
                                <hr/>
                                <Row className="g-3">
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_btn_active_bg || ''}
                                                handle="menu_btn_active_bg"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Menu Button aktiv <span className="fw-light">Hintergrundfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_btn_active_color || ''}
                                                handle="menu_btn_active_color"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Menu Button aktiv <span className="fw-light">Schriftfarbe</span>
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
                                    Menu Button hover
                                </h6>
                                <hr/>
                                <Row className="g-3">
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_btn_hover_bg || ''}
                                                handle="menu_btn_hover_bg"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Menu Button hover <span className="fw-light">Hintergrundfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_btn_hover_color || ''}
                                                handle="menu_btn_hover_color"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Menu Button hover <span className="fw-light">Schriftfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-2">
                            <CardBody className="bg-menu-dropdown">
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Hauptmenü Dropdown
                                </h6>
                                <hr/>
                                <Row className="g-3">
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.dropdown_bg || ''}
                                                handle="dropdown_bg"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Dropdown Menu <span className="fw-light">Hintergrundfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row className="g-3">
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_dropdown_bg || ''}
                                                handle="menu_dropdown_bg"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Dropdown <span className="fw-light">Hintergrundfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_dropdown_color || ''}
                                                handle="menu_dropdown_color"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Dropdown <span className="fw-light">Schriftfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-2">
                            <CardBody className="bg-menu-dropdown">
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Dropdown aktiv
                                </h6>
                                <hr/>
                                <Row className="g-3">
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_dropdown_active_bg || ''}
                                                handle="menu_dropdown_active_bg"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Dropdown Menü aktiv <span className="fw-light">Hintergrundfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_dropdown_active_color || ''}
                                                handle="menu_dropdown_active_color"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Dropdown Menü aktiv <span className="fw-light">Schriftfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-2">
                            <CardBody className="bg-menu-dropdown">
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Dropdown hover
                                </h6>
                                <hr/>
                                <Row className="g-3">
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_dropdown_hover_bg || ''}
                                                handle="menu_dropdown_hover_bg"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Dropdown Menü hover <span className="fw-light">Hintergrundfarbe</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={3} xl={4} lg={6} xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.theme_design.theme_color.menu_dropdown_hover_color || ''}
                                                handle="menu_dropdown_hover_color"
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                Dropdown Menü hover <span className="fw-light">Schriftfarbe</span>
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