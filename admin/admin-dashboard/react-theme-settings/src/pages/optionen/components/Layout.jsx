import {Card, CardBody, Form, FormGroup, Col, Row, Nav, Collapse, FloatingLabel} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_wp_general &&
                    <Fragment>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Layout Settings
                                </h6>
                                <div className="d-flex my-3 flex-wrap">
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.fix_header || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'fix_header')}
                                        label="Fixed Header"
                                    />

                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.scroll_top || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'scroll_top')}
                                        label="Scroll To Top Button anzeigen"
                                    />
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.edit_link || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'edit_link')}
                                        label="Bearbeiten Link anzeigen"
                                    />
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Top Area
                                </h6>
                                <div className="d-flex my-3 flex-wrap">
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.top_menu_aktiv || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'top_menu_aktiv')}
                                        label="Top Area anzeigen"
                                    />

                                </div>
                                <h6>Top Area Container</h6>
                                <fieldset disabled={!this.props.settings.theme_wp_general.top_menu_aktiv}>
                                    <div className="d-flex my-3 flex-wrap">
                                        <Form.Check
                                            type="radio"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            name="top-area-container"
                                            checked={this.props.settings.theme_wp_general.top_area_container === 'container' || false}
                                            onChange={(e) => this.props.onSetThemeGeneral('container', 'top_area_container')}
                                            label="container"
                                        />
                                        <Form.Check
                                            type="radio"
                                            className="no-blur my-1 me-4"
                                            name="top-area-container"
                                            id={uuidv4()}
                                            checked={this.props.settings.theme_wp_general.top_area_container === 'container-fluid' || false}
                                            onChange={(e) => this.props.onSetThemeGeneral('container-fluid', 'top_area_container')}
                                            label="container-fluid"
                                        />
                                    </div>
                                </fieldset>
                            </CardBody>
                        </Card>

                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Menu horizontal
                                </h6>
                                <div className="d-flex my-3 flex-wrap">
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        name="hauptmenu"
                                        checked={parseInt(this.props.settings.theme_wp_general.menu) === 1}
                                        onChange={(e) => this.props.onSetThemeGeneral(1, 'menu')}
                                        label="Menü Center"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="hauptmenu"
                                        id={uuidv4()}
                                        checked={parseInt(this.props.settings.theme_wp_general.menu) === 2}
                                        onChange={(e) => this.props.onSetThemeGeneral(2, 'menu')}
                                        label="Menü links"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="hauptmenu"
                                        id={uuidv4()}
                                        checked={parseInt(this.props.settings.theme_wp_general.menu) === 3}
                                        onChange={(e) => this.props.onSetThemeGeneral(3, 'menu')}
                                        label="Menü rechts"
                                    />
                                    {/*}  <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="hauptmenu"
                                        id={uuidv4()}
                                        checked={parseInt(this.props.settings.theme_wp_general.menu) === 4}
                                        onChange={(e) => this.props.onSetThemeGeneral(4, 'menu')}
                                        label="Logo mitte"
                                    />{*/}
                                </div>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Menu vertikal
                                </h6>
                                <div className="d-flex my-3 flex-wrap">
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        name="menu-vertical"
                                        checked={this.props.settings.theme_wp_general.menu_vertical === 'start'}
                                        onChange={(e) => this.props.onSetThemeGeneral('start', 'menu_vertical')}
                                        label="oben"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-vertical"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.menu_vertical === 'center'}
                                        onChange={(e) => this.props.onSetThemeGeneral('center', 'menu_vertical')}
                                        label="mitte"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-vertical"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.menu_vertical === 'end'}
                                        onChange={(e) => this.props.onSetThemeGeneral('end', 'menu_vertical')}
                                        label="unten"
                                    />
                                </div>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Menü Container
                                </h6>
                                <div className="d-flex my-3 flex-wrap">
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        name="menu-container"
                                        checked={this.props.settings.theme_wp_general.menu_container === 'container' || false}
                                        onChange={(e) => this.props.onSetThemeGeneral('container', 'menu_container')}
                                        label="container"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-container"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.menu_container === 'container-fluid' || false}
                                        onChange={(e) => this.props.onSetThemeGeneral('container-fluid', 'menu_container')}
                                        label="container-fluid"
                                    />
                                </div>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`Menü Breakpoint`}
                                    >
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.settings.theme_wp_general.menu_breakpoint || ''}
                                            onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'menu_breakpoint')}
                                            aria-label={`Menü Breakpoint`}>
                                            {this.props.selects.breakpoints.map((select, index) =>
                                                <option key={index}
                                                        value={select.value}>
                                                    {select.label}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Main Container
                                </h6>
                                <div className="d-flex my-3 flex-wrap">
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        name="main-container"
                                        checked={this.props.settings.theme_wp_general.main_container === 'container' || false}
                                        onChange={(e) => this.props.onSetThemeGeneral('container', 'main_container')}
                                        label="container"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="main-container"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.main_container === 'container-fluid' || false}
                                        onChange={(e) => this.props.onSetThemeGeneral('container-fluid', 'main_container')}
                                        label="container-fluid"
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Widget Footer
                                </h6>
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-3 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.widget_footer_active || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'widget_footer_active')}
                                        label="Widget Footer aktiv"
                                    />
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Widget Footer Container
                                </h6>
                                <div className="d-flex my-3 flex-wrap">
                                    <Form.Check
                                        disabled={!this.props.settings.theme_wp_general.widget_footer_active}
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        name="widget-footer-container"
                                        checked={this.props.settings.theme_wp_general.widget_footer_container === 'container' || false}
                                        onChange={(e) => this.props.onSetThemeGeneral('container', 'widget_footer_container')}
                                        label="container"
                                    />
                                    <Form.Check
                                        disabled={!this.props.settings.theme_wp_general.widget_footer_active}
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="widget-footer-container"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.widget_footer_container === 'container-fluid' || false}
                                        onChange={(e) => this.props.onSetThemeGeneral('container-fluid', 'widget_footer_container')}
                                        label="container-fluid"
                                    />
                                </div>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`Widget Breakpoint`}
                                    >
                                        <Form.Select
                                            disabled={!this.props.settings.theme_wp_general.widget_footer_active}
                                            className="no-blur"
                                            value={this.props.settings.theme_wp_general.widget_footer_breakpoint || ''}
                                            onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'widget_footer_breakpoint')}
                                            aria-label={`Widget Breakpoint`}>
                                            {this.props.selects.breakpoints.map((select, index) =>
                                                <option key={index}
                                                        value={select.value}>
                                                    {select.label}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </CardBody>
                        </Card>


                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Info Footer
                                </h6>
                                <div className="d-flex flex-wrap my-3">
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.info_footer_active || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'info_footer_active')}
                                        label="Info Footer aktiv"
                                    />
                                    <Form.Check
                                        disabled={!this.props.settings.theme_wp_general.info_footer_active}
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.fix_footer || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'fix_footer')}
                                        label="Fixed Info Footer"
                                    />
                                </div>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Info Footer Container
                                </h6>
                                <div className="d-flex my-3 flex-wrap">
                                    <Form.Check
                                        disabled={!this.props.settings.theme_wp_general.info_footer_active}
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        name="info-footer-container"
                                        checked={this.props.settings.theme_wp_general.info_footer_container === 'container' || false}
                                        onChange={(e) => this.props.onSetThemeGeneral('container', 'info_footer_container')}
                                        label="container"
                                    />
                                    <Form.Check
                                        disabled={!this.props.settings.theme_wp_general.info_footer_active}
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="info-footer-container"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.info_footer_container === 'container-fluid' || false}
                                        onChange={(e) => this.props.onSetThemeGeneral('container-fluid', 'info_footer_container')}
                                        label="container-fluid"
                                    />
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Fullwidth Page Paddings
                                </h6>
                                <small>Die Einstellungen sind für die CSS
                                    Klasse <code>.container-fullwidth</code></small>
                                <div className="my-3 pt-2">
                                    <Row className="g-3 mb-3">
                                        <Col xl={3} lg={6} xs={12}>
                                            <FormGroup controlId={uuidv4()}>
                                                <Form.Label className="fw-semibold">
                                                    {`Padding Top ${this.props.settings.theme_wp_general.fw_top} (Px)`}
                                                </Form.Label>
                                                <Form.Range
                                                    min={0}
                                                    max={200}
                                                    step={1}
                                                    value={this.props.settings.theme_wp_general.fw_top}
                                                    onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'fw_top')}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col xl={3} lg={6} xs={12}>
                                            <FormGroup controlId={uuidv4()}>
                                                <Form.Label className="fw-semibold">
                                                    {`Padding Bottom ${this.props.settings.theme_wp_general.fw_bottom} (Px)`}
                                                </Form.Label>
                                                <Form.Range
                                                    min={0}
                                                    max={200}
                                                    step={1}
                                                    value={this.props.settings.theme_wp_general.fw_bottom}
                                                    onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'fw_bottom')}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row className="g-3">
                                        <Col xl={3} lg={6} xs={12}>
                                            <FormGroup controlId={uuidv4()}>
                                                <Form.Label className="fw-semibold">
                                                    {`Padding Left ${this.props.settings.theme_wp_general.fw_left} (Px)`}
                                                </Form.Label>
                                                <Form.Range
                                                    min={0}
                                                    max={200}
                                                    step={1}
                                                    value={this.props.settings.theme_wp_general.fw_left}
                                                    onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'fw_left')}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col xl={3} lg={6} xs={12}>
                                            <FormGroup controlId={uuidv4()}>
                                                <Form.Label className="fw-semibold">
                                                    {`Padding Right ${this.props.settings.theme_wp_general.fw_right} (Px)`}
                                                </Form.Label>
                                                <Form.Range
                                                    min={0}
                                                    max={200}
                                                    step={1}
                                                    value={this.props.settings.theme_wp_general.fw_right}
                                                    onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'fw_right')}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </Fragment>}
            </Fragment>
        )
    }
}