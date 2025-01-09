import {Card, CardBody, ButtonGroup, Button, Col, Container, Nav, Collapse, Form, FloatingLabel} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class WpOptionen extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            capabilitiesType: '',
            capabilitiesLabel: '',
            capabilitiesValue: '',
            colCapabilities: ''
        }
        this.onGetCapabilities = this.onGetCapabilities.bind(this);
        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }

    findArrayElementById(array, id, type) {
        return array.find((element) => {
            return element[type] === id;
        })
    }

    filterArrayElementById(array, id, type) {
        return array.filter((element) => {
            return element[type] !== id;
        })
    }

    onGetCapabilities(type, label) {
        let colCapabilities = this.state.colCapabilities;
        if (type !== '' && type === colCapabilities) {
            this.setState({
                capabilitiesType: '',
                capabilitiesLabel: '',
                capabilitiesValue: '',
                colCapabilities: ''
            })
        } else {
            this.setState({
                capabilitiesType: type,
                capabilitiesLabel: label,
                capabilitiesValue: this.props.settings.theme_capabilities[type],
                colCapabilities: type
            })
        }
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_wp_optionen &&
                    <Fragment>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h5>
                                    <i className="bi bi-wordpress text-primary mx-2"></i>
                                    WordPress Einstellungen
                                </h5>
                                <hr/>
                                <h6>
                                    Mindestanforderung für die Nutzung der einzelnen Abschnitte
                                </h6>
                                <hr/>

                                {this.props.capabilities && this.props.capabilities.length &&
                                    <ButtonGroup className="flex-wrap" aria-label="Mindestanforderung">
                                        {this.props.capabilities.map((c, i) => {
                                            return (
                                                <Button
                                                    onClick={() => this.onGetCapabilities(c.type, c.label)}
                                                    key={i}
                                                    active={this.state.capabilitiesType === c.type}
                                                    className="text-capitalize mb-1 rounded-0"
                                                    size="sm"
                                                    variant="outline-primary">{c.label}</Button>
                                            )
                                        })}
                                    </ButtonGroup>
                                }
                                <Collapse
                                    in={this.state.capabilitiesType !== '' && this.state.colCapabilities === this.state.capabilitiesType}>
                                    <div className="mt-3" id={uuidv4()}>
                                        <Col xxl={4} xl={6} lg={8} xs={12}>
                                            {this.props.selectUserRole && this.props.selectUserRole.length &&
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`${this.state.capabilitiesLabel} User-Role`}
                                                >
                                                    <Form.Select
                                                        className="no-blur"
                                                        value={this.props.settings.theme_capabilities[this.state.capabilitiesType] || ''}
                                                        onChange={(e) => this.props.onSetWpOptionen(e.target.value, this.state.capabilitiesType, 'theme_capabilities')}
                                                        aria-label={`${this.state.capabilitiesLabel} User-Role`}>
                                                        {this.props.selectUserRole.map((select, index) =>
                                                            <option key={index}
                                                                    value={select.value}>
                                                                {select.name}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>}
                                        </Col>
                                    </div>
                                </Collapse>
                                <hr className="mt-3"/>
                                <div className="d-flex flex-wrap">
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_optionen.fa_icons_active || false}
                                        onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'fa_icons_active', 'theme_wp_optionen')}
                                        label="Font Awesome aktiv"
                                    />
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_optionen.material_icons_active || false}
                                        onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'material_icons_active', 'theme_wp_optionen')}
                                        label="Material-Design aktiv"
                                    />
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_optionen.bootscore_fontawesome || false}
                                        onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'bootscore_fontawesome', 'theme_wp_optionen')}
                                        label="Bootscore Font Awesome aktiv"
                                    />
                                </div>
                                <div className="form-text">
                                    Icon Fonts aktivieren oder deaktivieren.
                                    {this.props.settings.theme_wp_optionen.bootscore_fontawesome && this.props.settings.theme_wp_optionen.fa_icons_active ?
                                        <span className="d-block text-danger mt-3">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            Wenn sowohl Font Awesome als auch das Font Awesome-Feature von Bootscore aktiviert sind, können <b>Konflikte</b> auftreten.
                                        </span>
                                        : ''}
                                </div>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_optionen.disabled_wp_layout || false}
                                    onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'disabled_wp_layout', 'theme_wp_optionen')}
                                    label="Disable WordPress layout"
                                />
                                <div className="form-text">
                                    Ist diese Option aktiv, werden <b className="fw-bolder"> alle WordPress Container
                                    und Klassen</b> nicht mehr ausgegeben bzw. überschrieben.
                                </div>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_optionen.svg_upload || false}
                                    onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'svg_upload', 'theme_wp_optionen')}
                                    label="SVG-Upload aktiv"
                                />
                                <div className="form-text">
                                    Ist diese Option aktiviert, können <b className="fw-bolder">SVG-Grafiken</b> mit dem
                                    WordPress-Medienmanager hochgeladen werden.
                                </div>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_optionen.disabled_comments || false}
                                    onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'disabled_comments', 'theme_wp_optionen')}
                                    label="Kommentare deaktivieren"
                                />
                                <div className="form-text">
                                    Ist diese Option aktiv, wird die <b className="fw-bolder"> Kommentar Funktion</b> deaktiviert.
                                </div>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_optionen.disabled_comments_admin_bar || false}
                                    onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'disabled_comments_admin_bar', 'theme_wp_optionen')}
                                    label="Admin-Bar Kommentare ausblenden"
                                />
                                <div className="form-text">
                                    Wenn diese Option aktiviert ist, wird die Kommentarfunktion in der <b className='fw-bolder'>Admin-Bar</b> nicht mehr angezeigt.
                                </div>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_optionen.disabled_comments_admin_menu || false}
                                    onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'disabled_comments_admin_menu', 'theme_wp_optionen')}
                                    label="Admin-Menu Kommentare ausblenden"
                                />
                                <div className="form-text">
                                    Wenn diese Option aktiviert ist, wird die Kommentarfunktion im <b className='fw-bolder'>Admin-Menü</b> nicht mehr angezeigt.
                                </div>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_optionen.gutenberg_active || false}
                                    onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'gutenberg_active', 'theme_wp_optionen')}
                                    label="Gutenberg Editor aktiv"
                                />
                                <div className="form-text">
                                    Sie haben die Möglichkeit, den <b className="fw-bolder">Gutenberg-Editor</b> zu <b
                                    className="fw-bolder">deaktivieren</b>. Mit dieser Option aktivieren oder
                                    deaktivieren Sie den Editor für <b className="fw-bolder">Seiten und Beiträge</b>.
                                </div>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_optionen.gutenberg_widget_active || false}
                                    onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'gutenberg_widget_active', 'theme_wp_optionen')}
                                    label="Gutenberg Widget Editor aktiv"
                                />
                                <div className="form-text">
                                    Aktivieren oder deaktivieren Sie den Gutenberg <b className="fw-bolder">Widget
                                    Editor</b>.
                                </div>
                                <hr/>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_optionen.pdf_custom_dir_active || false}
                                    onChange={(e) => this.props.onSetWpOptionen(e.target.checked, 'pdf_custom_dir_active', 'theme_wp_optionen')}
                                    label="PDF Custom Upload DIR"
                                />
                                <div className="form-text">
                                    Ist diese Option aktiviert, werden PDF-Dateien in den Ordner <code>uploads/hummelt-theme-v3-pdf</code> gespeichert.
                                </div>
                            </CardBody>
                        </Card>
                    </Fragment>}
            </Fragment>
        )
    }
}