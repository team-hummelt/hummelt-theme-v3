import {
    Card,
    CardBody,
    Button,
    Row,
    Col,
    FloatingLabel,
    Container,
    Nav,
    Collapse,
    FormGroup,
    Form
} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
import * as mediaTools from "../../../utils/wpMedia.js";

const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class LogoFavicon extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onGetWpMedia = this.onGetWpMedia.bind(this);
        this.getMediaAttachment = this.getMediaAttachment.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

    }

    onGetWpMedia(title, btn, type_key, url_key) {
        mediaTools.openMediaFrame(title, btn, type_key, url_key, this.getMediaAttachment)
    }

    getMediaAttachment(attachment, type_key, url_key) {
        if (attachment) {
            this.props.onSetThemeGeneral(attachment.url, url_key)
            this.props.onSetThemeGeneral(attachment.id, type_key)
        }
    }

    deleteImage(type, url) {
        this.props.onSetThemeGeneral(0, type)
        this.props.onSetThemeGeneral('', url)
    }

    render() {

        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_wp_general &&
                    <Fragment>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h5>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Logo-Upload und Einstellungen
                                </h5>
                                <hr/>
                                <h6>
                                    <i className="bi bi-card-image text-primary me-2"></i>
                                    Bilderupload
                                </h6>
                                <hr/>
                                <b className="fw-semibold">Logo für Header</b>
                                <hr/>
                                <div className="d-flex flex-wrap">
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-option-header"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.logo_menu_option === 1 || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(1, 'logo_menu_option')}
                                        label="Logo anzeigen"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-option-header"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.logo_menu_option === 2 || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(2, 'logo_menu_option')}
                                        label="Seiten-Titel anzeigen"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-option-header"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.logo_menu_option === 3 || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(3, 'logo_menu_option')}
                                        label="Individuellen Text anzeigen"
                                    />
                                </div>

                                <Collapse
                                    in={this.props.settings.theme_wp_general.logo_menu_option === 3}>
                                    <div id={uuidv4()}>
                                        <hr/>
                                        <Col xxl={4} xl={6} lg={8} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="Individueller Text"
                                            >
                                                <Form.Control
                                                    className={`no-blur mb-3`}
                                                    type="text"
                                                    value={this.props.settings.theme_wp_general.logo_menu_text || ''}
                                                    onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'logo_menu_text')}
                                                    placeholder="Individueller Text"/>
                                            </FloatingLabel>
                                        </Col>
                                        <hr/>
                                    </div>
                                </Collapse>
                                <Collapse
                                    in={this.props.settings.theme_wp_general.logo_menu_option === 1}>
                                    <div id={uuidv4()}>
                                        <hr/>
                                        <div className="d-flex flex-column">
                                            {this.props.settings.theme_wp_general.logo_image_url !== '' ?
                                                <img className="img-fluid" alt="Login Logo"
                                                     width={this.props.settings.theme_wp_general.logo_size}
                                                     src={this.props.settings.theme_wp_general.logo_image_url}/>
                                                :
                                                <img className="img-fluid" alt="Login Logo" width={200}
                                                     src={`${hummeltRestObj.theme_admin_url}assets/images/logo_hupa.svg`}/>
                                            }
                                            <div className="my-4">
                                                {this.props.settings.theme_wp_general.logo_image_url ?
                                                    <Button
                                                        onClick={() => this.deleteImage('logo_image', 'logo_image_url')}
                                                        size="sm"
                                                        variant="danger">
                                                        <i className="bi bi-trash me-2"></i>
                                                        Bild löschen
                                                    </Button>
                                                    :
                                                    <Button
                                                        onClick={() => this.onGetWpMedia('Logo für Header', 'Logo auswählen', 'logo_image', 'logo_image_url')}
                                                        size="sm"
                                                        variant="outline-secondary">
                                                        <i className="bi bi-card-image me-2"></i>
                                                        zur Bildauswahl hier klicken
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                                {this.props.settings.theme_wp_general.handy_menu_option === 1 && this.props.settings.theme_wp_general.logo_menu_option === 2 ?
                                    <hr/>
                                    : ''
                                }
                                <fieldset>
                                    <Row className="g-3 mb-3">
                                        {this.props.settings.theme_wp_general.logo_menu_option === 1 ?
                                            <Fragment>
                                                <Col xl={3} lg={4} md={6} xs={12}>
                                                    <FormGroup controlId={uuidv4()}>
                                                        <Form.Label
                                                            className={`${!this.props.settings.theme_wp_general.logo_image && 'opacity-50'}`}>
                                                            Bildgröße <b
                                                            className="fw-semibold">Header</b> {`${this.props.settings.theme_wp_general.logo_size} (Px)`}
                                                        </Form.Label>
                                                        <Form.Range
                                                            disabled={!this.props.settings.theme_wp_general.logo_image}
                                                            min={50}
                                                            max={500}
                                                            step={5}
                                                            value={this.props.settings.theme_wp_general.logo_size}
                                                            onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'logo_size')}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col xl={3} lg={4} md={6} xs={12}>
                                                    <FormGroup controlId={uuidv4()}>
                                                        <Form.Label
                                                            className={`${!this.props.settings.theme_wp_general.logo_image && 'opacity-50'}`}>
                                                            Bildgröße <b
                                                            className="fw-semibold">Scroll</b> {`${this.props.settings.theme_wp_general.logo_size_scroll} (Px)`}
                                                        </Form.Label>
                                                        <Form.Range
                                                            disabled={!this.props.settings.theme_wp_general.logo_image}
                                                            min={50}
                                                            max={500}
                                                            step={5}
                                                            value={this.props.settings.theme_wp_general.logo_size_scroll}
                                                            onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'logo_size_scroll')}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col xl={3} lg={4} md={6} xs={12}>
                                                    <FormGroup controlId={uuidv4()}>
                                                        <Form.Label
                                                            className={`${!this.props.settings.theme_wp_general.logo_image && 'opacity-50'}`}>
                                                            Bildgröße <b
                                                            className="fw-semibold">Mobil</b> {`${this.props.settings.theme_wp_general.logo_size_mobil} (Px)`}
                                                        </Form.Label>
                                                        <Form.Range
                                                            disabled={!this.props.settings.theme_wp_general.logo_image}
                                                            min={50}
                                                            max={500}
                                                            step={5}
                                                            value={this.props.settings.theme_wp_general.logo_size_mobil}
                                                            onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'logo_size_mobil')}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                            </Fragment>
                                            : ''}
                                        {this.props.settings.theme_wp_general.handy_menu_option === 1 ?
                                            <Col xl={3} lg={4} md={6} xs={12}>
                                                <FormGroup controlId={uuidv4()}>
                                                    <Form.Label>
                                                        Mobil <b
                                                        className="fw-semibold"> Menü</b> {`${this.props.settings.theme_wp_general.logo_size_mobil_menu} (Px)`}
                                                    </Form.Label>
                                                    <Form.Range
                                                        min={50}
                                                        max={500}
                                                        step={5}
                                                        value={this.props.settings.theme_wp_general.logo_size_mobil_menu}
                                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'logo_size_mobil_menu')}
                                                    />
                                                </FormGroup>
                                            </Col> : ''}
                                        {this.props.settings.theme_wp_general.logo_menu_option === 1 ?
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`Bildgröße Breakpoint`}
                                            >
                                                <Form.Select
                                                    disabled={!this.props.settings.theme_wp_general.logo_image}
                                                    className="no-blur"
                                                    value={this.props.settings.theme_wp_general.logo_breakpoint || ''}
                                                    onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'logo_breakpoint')}
                                                    aria-label={`Bildgröße Breakpoint`}>
                                                    {this.props.selects.breakpoints.map((select, index) =>
                                                        <option key={index}
                                                                value={select.width}>
                                                            {select.label}
                                                        </option>
                                                    )}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>: ''}
                                    </Row>
                                </fieldset>
                                <hr/>
                                <b className="fw-semibold">Logo für Handy-Menü</b>
                                <hr/>
                                <div className="d-flex flex-wrap">
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-option"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.handy_menu_option === 1 || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(1, 'handy_menu_option')}
                                        label="Logo anzeigen"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-option"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.handy_menu_option === 2 || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(2, 'handy_menu_option')}
                                        label="Seiten-Titel anzeigen"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-1 me-4"
                                        name="menu-option"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.handy_menu_option === 3 || false}
                                        onChange={(e) => this.props.onSetThemeGeneral(3, 'handy_menu_option')}
                                        label="Individuellen Text anzeigen"
                                    />
                                </div>
                                <Collapse
                                    in={this.props.settings.theme_wp_general.handy_menu_option === 3}>
                                    <div id={uuidv4()}>
                                        <hr/>
                                        <Col xxl={4} xl={6} lg={8} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="Individueller Text"
                                            >
                                                <Form.Control
                                                    className={`no-blur mb-3`}
                                                    type="text"
                                                    value={this.props.settings.theme_wp_general.handy_menu_text || ''}
                                                    onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'handy_menu_text')}
                                                    placeholder="Individueller Text"/>
                                            </FloatingLabel>
                                        </Col>
                                    </div>
                                </Collapse>
                                <Collapse
                                    in={this.props.settings.theme_wp_general.handy_menu_option === 1}>
                                    <div id={uuidv4()}>
                                        <hr/>
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.theme_wp_general.handy_menu_image_active  }
                                            onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'handy_menu_image_active')}
                                            label="Header-Logo verwenden"
                                        />
                                    </div>
                                </Collapse>
                                <Collapse
                                    in={!this.props.settings.theme_wp_general.handy_menu_image_active}>
                                    <div id={uuidv4()}>
                                        <hr/>
                                        <div className="d-flex flex-column">
                                            {this.props.settings.theme_wp_general.handy_menu_image_url !== '' ?
                                                <img className="img-fluid" alt="Login Logo"
                                                     width={this.props.settings.theme_wp_general.logo_size_mobil_menu}
                                                     src={this.props.settings.theme_wp_general.handy_menu_image_url}/>
                                                :
                                                <img className="img-fluid" alt="Handy-Menü Logo"
                                                     width={this.props.settings.theme_wp_general.logo_size_mobil_menu}
                                                     src={`${hummeltRestObj.theme_admin_url}assets/images/logo_hupa.svg`}/>
                                            }
                                            <div className="my-4">
                                                {this.props.settings.theme_wp_general.handy_menu_image_url ?
                                                    <Button
                                                        onClick={() => this.deleteImage('handy_menu_image_id', 'handy_menu_image_url')}
                                                        size="sm"
                                                        variant="danger">
                                                        <i className="bi bi-trash me-2"></i>
                                                        Bild löschen
                                                    </Button>
                                                    :
                                                    <Button
                                                        onClick={() => this.onGetWpMedia('Logo für Handy-Menü', 'Logo auswählen', 'handy_menu_image_id', 'handy_menu_image_url')}
                                                        size="sm"
                                                        variant="outline-secondary">
                                                        <i className="bi bi-card-image me-2"></i>
                                                        zur Bildauswahl hier klicken
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                                <hr/>
                                <b className="fw-semibold">Logo für Login</b>
                                <hr/>
                                <Col xxl={4} xl={6} lg={8} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="URL für Login Logo"
                                    >
                                        <Form.Control
                                            className={`no-blur mb-3`}
                                            type="url"
                                            value={this.props.settings.theme_wp_general.login_logo_url || ''}
                                            onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'login_logo_url')}
                                            placeholder="URL für Login Logo"/>
                                    </FloatingLabel>
                                </Col>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 me-4"
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_general.login_img_aktiv || false}
                                    onChange={(e) => this.props.onSetThemeGeneral(e.target.checked, 'login_img_aktiv')}
                                    label="Header-Logo verwenden"
                                />
                                <Collapse
                                    in={!this.props.settings.theme_wp_general.login_img_aktiv}>
                                    <div id={uuidv4()}>
                                        <hr/>
                                        <div className="d-flex flex-column">

                                            {this.props.settings.theme_wp_general.login_image_url !== '' ?
                                                <img className="img-fluid" alt="Login Logo"
                                                     width={this.props.settings.theme_wp_general.login_img_width}
                                                     src={this.props.settings.theme_wp_general.login_image_url}/>
                                                :
                                                <img className="img-fluid" alt="Login Logo" width={200}
                                                     src={`${hummeltRestObj.theme_admin_url}assets/images/logo_hupa.svg`}/>
                                            }
                                            <div className="my-4">
                                                {this.props.settings.theme_wp_general.login_image_url ?
                                                    <Button
                                                        onClick={() => this.deleteImage('login_image', 'login_image_url')}
                                                        size="sm"
                                                        variant="danger">
                                                        <i className="bi bi-trash me-2"></i>
                                                        Bild löschen
                                                    </Button>
                                                    :
                                                    <Button
                                                        onClick={() => this.onGetWpMedia('Logo für login', 'Logo auswählen', 'login_image', 'login_image_url')}
                                                        size="sm"
                                                        variant="outline-secondary">
                                                        <i className="bi bi-card-image me-2"></i>
                                                        zur Bildauswahl hier klicken
                                                    </Button>
                                                }
                                            </div>

                                        </div>

                                        <Row className="g-3">
                                            <Col xl={3} lg={4} md={6} xs={12}>
                                                <FormGroup controlId={uuidv4()}>
                                                    <Form.Label>
                                                        Login Image <b
                                                        className="fw-semibold">Breite</b> {`${this.props.settings.theme_wp_general.login_img_width} (Px)`}
                                                    </Form.Label>
                                                    <Form.Range
                                                        min={50}
                                                        max={500}
                                                        step={1}
                                                        value={this.props.settings.theme_wp_general.login_img_width}
                                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'login_img_width')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col xl={3} lg={4} md={6} xs={12}>
                                                <FormGroup controlId={uuidv4()}>
                                                    <Form.Label>
                                                        Login Image <b
                                                        className="fw-semibold">Höhe</b> {`${this.props.settings.theme_wp_general.login_img_height} (Px)`}
                                                    </Form.Label>
                                                    <Form.Range
                                                        min={50}
                                                        max={500}
                                                        step={1}
                                                        value={this.props.settings.theme_wp_general.login_img_height}
                                                        onChange={(e) => this.props.onSetThemeGeneral(e.target.value, 'login_img_height')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <hr/>
                                    </div>
                                </Collapse>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h5>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Favicon
                                </h5>
                                <div className="form-text">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Wenn ein Favicon über den Customizer erstellt wurde, wird das Customizer-Favicon
                                    angezeigt.
                                </div>
                                <hr/>
                                <div className="d-flex flex-column">
                                    {this.props.settings.theme_wp_general.favicon_image_url !== '' ?
                                        <img style={{objectFit: 'cover'}} className="img-fluid p-1 border rounded"
                                             alt="Favicon"
                                             width={100} height={100}
                                             src={this.props.settings.theme_wp_general.favicon_image_url}/>
                                        :
                                        <img style={{objectFit: 'cover'}}
                                             className="img-fluid opacity-50 p-1 border rounded" alt="Favicon"
                                             width={100} height={100}
                                             src={`${hummeltRestObj.theme_admin_url}assets/images/favicon/favicon.png`}/>
                                    }
                                </div>
                                <div className="my-4">
                                    {this.props.settings.theme_wp_general.favicon_image_url ?
                                        <Button
                                            onClick={() => this.deleteImage('favicon_id', 'favicon_image_url')}
                                            size="sm"
                                            variant="danger">
                                            <i className="bi bi-trash me-2"></i>
                                            Bild löschen
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => this.onGetWpMedia('Favicon', 'Favicon auswählen', 'favicon_id', 'favicon_image_url')}
                                            size="sm"
                                            variant="outline-secondary">
                                            <i className="bi bi-card-image me-2"></i>
                                            zur Bildauswahl hier klicken
                                        </Button>
                                    }
                                </div>
                                {!this.props.settings.theme_wp_general.favicon_image_url &&
                                    <div className="form-text">
                                        kein Favicon vorhanden
                                    </div>
                                }
                                <hr/>
                            </CardBody>
                        </Card>
                    </Fragment>}
            </Fragment>
        )
    }
}