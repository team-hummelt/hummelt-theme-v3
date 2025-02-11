import {Card, CardBody, Col, Row, Container, Button, Nav, Collapse, Form, FloatingLabel} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Templates extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            activeId: ''
        }
    }

    onSetCollapse(id) {
        if (id === this.state.activeId) {
            this.setState({
                activeId: ''
            })
        } else {
            this.setState({
                activeId: id
            })
        }
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_wp_general &&
                    <Fragment>
                        <Card className="shadow-sm my-2">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Ansicht für Beiträge, Block, Suche und Beitragslisten
                                </h6>
                                <hr/>
                                <div className="d-flex flex-wrap">
                                    {this.props.settings.theme_wp_general.template_options.map((o, i) => {
                                        return (
                                            <div key={i}>
                                                <Button
                                                    key={i}
                                                    onClick={() => this.onSetCollapse(o.id)}
                                                    active={this.state.activeId === o.id}
                                                    size="sm"
                                                    variant="outline-primary me-1">
                                                    <i className="fa fa-gear me-2"></i>
                                                    {o.label}
                                                    <i className={`bi ms-2 ${this.state.activeId === o.id ? 'bi-arrows-expand' : 'bi-arrows-collapse'}`}></i>
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <hr/>
                                {this.props.settings.theme_wp_general.template_options.map((o, i) => {
                                    return (
                                        <Collapse
                                            key={i}
                                            in={this.state.activeId === o.id}>
                                            <div id={uuidv4()}>
                                                <h6>
                                                    <i className="bi bi-arrow-right-short me-1"></i>
                                                    Einstellungen für <span
                                                    className="text-capitalize">{o.type}</span> Beitragslisten.
                                                </h6>
                                                <hr/>
                                                <Row className="g-2">
                                                    <Col xs={12}>
                                                        <Form.Check
                                                            type="switch"
                                                            className="no-blur my-1 me-4"
                                                            id={uuidv4()}
                                                            checked={o.show_sidebar || false}
                                                            onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'show_sidebar', o.id)}
                                                            label="Sidebar anzeigen"
                                                        />
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv4()}
                                                            label={`Sidebar`}
                                                        >
                                                            <Form.Select
                                                                className="no-blur mw-100"
                                                                disabled={!o.select_sidebar}
                                                                value={o.show_sidebar || false}
                                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.value, 'select_sidebar', o.id)}
                                                                aria-label={`Sidebar`}>
                                                                <option value="">auswählen</option>
                                                                {this.props.selects.sidebar.map((select, index) =>
                                                                    <option key={index}
                                                                            value={select.id}>
                                                                        {select.name}
                                                                    </option>
                                                                )}
                                                            </Form.Select>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xl={6} xs={12}></Col>
                                                    <Col xl={6} xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv4()}
                                                            label={`Custom-Header`}
                                                        >
                                                            <Form.Select
                                                                className="no-blur mw-100"
                                                                value={o.select_header || false}
                                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.value, 'select_header', o.id)}
                                                                aria-label={`Custom-Header`}>
                                                                <option value="">auswählen</option>
                                                                {this.props.selects.header.map((select, index) =>
                                                                    <option key={index}
                                                                            value={select.id}>
                                                                        {select.label}
                                                                    </option>
                                                                )}
                                                            </Form.Select>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xl={6} xs={12}>
                                                        <FloatingLabel
                                                            controlId={uuidv4()}
                                                            label={`Custom-Footer`}
                                                        >
                                                            <Form.Select
                                                                className="no-blur mw-100"
                                                                value={o.select_footer || false}
                                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.value, 'select_footer', o.id)}
                                                                aria-label={`Custom-Footer`}>
                                                                <option value="">auswählen</option>
                                                                {this.props.selects.footer.map((select, index) =>
                                                                    <option key={index}
                                                                            value={select.id}>
                                                                        {select.label}
                                                                    </option>
                                                                )}
                                                            </Form.Select>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Form.Check
                                                            type="switch"
                                                            className="no-blur my-1 me-4"
                                                            id={uuidv4()}
                                                            checked={o.show_image || false}
                                                            onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'show_image', o.id)}
                                                            label="Beitragsbild anzeigen"
                                                        />
                                                    </Col>
                                                    <Col xs={12}>
                                                        <h6>Informationen für Kategorie & Beitragslisten anzeigen</h6>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <div className="d-flex flex-wrap">
                                                            <Form.Check
                                                                type="switch"
                                                                className="no-blur my-1 me-4"
                                                                id={uuidv4()}
                                                                checked={o.show_kategorie || false}
                                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'show_kategorie', o.id)}
                                                                label="Kategorien anzeigen"
                                                            />
                                                            <Form.Check
                                                                type="switch"
                                                                className="no-blur my-1 me-4"
                                                                id={uuidv4()}
                                                                checked={o.show_post_date || false}
                                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'show_post_date', o.id)}
                                                                label="Datum anzeigen"
                                                            />
                                                            <Form.Check
                                                                type="switch"
                                                                className="no-blur my-1 me-4"
                                                                id={uuidv4()}
                                                                checked={o.show_post_author || false}
                                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'show_post_author', o.id)}
                                                                label="Author anzeigen"
                                                            />
                                                            <Form.Check
                                                                type="switch"
                                                                className="no-blur my-1 me-4"
                                                                id={uuidv4()}
                                                                checked={o.show_post_kommentar || false}
                                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'show_post_kommentar', o.id)}
                                                                label="Kommentar anzeigen"
                                                            />
                                                            <Form.Check
                                                                type="switch"
                                                                className="no-blur my-1 "
                                                                id={uuidv4()}
                                                                checked={o.show_post_tags || false}
                                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'show_post_tags', o.id)}
                                                                label="Schlagworte anzeigen"
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <hr/>
                                            </div>
                                        </Collapse>
                                    )
                                })}
                                <h6>Breadcrumb für Beiträge anzeigen</h6>
                                <Form.Check
                                    type="switch"
                                    className="no-blur my-1 "
                                    id={uuidv4()}
                                    checked={this.props.settings.theme_wp_general.post_breadcrumb || false}
                                    onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'post_breadcrumb')}
                                    label="anzeigen"
                                />
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-2">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    404 Template
                                </h6>
                                <hr/>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`404 Seite auswählen`}
                                    >
                                        <Form.Select
                                            className="no-blur mw-100"
                                            value={this.props.settings.theme_wp_general.hupa_select_404 || false}
                                            onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.value, 'hupa_select_404')}
                                            aria-label={`404 Seite auswählen`}>
                                            <option value="">auswählen</option>
                                            {this.props.selects.pages.map((select, index) =>
                                                <option key={index}
                                                        value={select.id}>
                                                    {select.title}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-2">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Sitemap Einstellungen
                                </h6>
                                <hr/>
                                <div className="d-flex flex-wrap">
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.sitemap_post || false}
                                        onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'sitemap_post')}
                                        label="Beiträge"
                                    />
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.sitemap_page || false}
                                        onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'sitemap_page')}
                                        label="Seiten"
                                    />
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.sitemap_custom_post_active || false}
                                        onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'sitemap_custom_post_active')}
                                        label="Custom Posts"
                                    />
                                </div>
                                <div className="form-text">
                                    Nach dem erstellen oder löschen von Beiträgen und Seiten, wird die Sitemap
                                    aktualisiert.
                                </div>
                                {this.props.settings.theme_wp_general.sitemap_custom_post_active ?
                                    <Col xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="Custom Posts"
                                            className="mt-3"
                                        >
                                            <Form.Control
                                                className={`no-blur`}
                                                type="text"
                                                value={this.props.settings.theme_wp_general.sitemap_custom_post || ''}
                                                onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.value, 'sitemap_custom_post')}
                                                placeholder="Custom Posts"/>
                                        </FloatingLabel>
                                        <div className="form-text">
                                            Beitrags Typen mit Komma oder Semikolon trennen.
                                        </div>
                                    </Col> : ''}
                                <Button
                                    type="button"
                                    onClick={this.props.onUpdateSitemap}
                                    size="sm"
                                    variant="outline-primary mt-3 me-1">
                                    <i className="fa fa-gear me-2"></i>
                                    Sitemap aktualisieren
                                </Button>
                            </CardBody>
                        </Card>
                        {/*}<Card className="shadow-sm my-2">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    WooCommerce
                                </h6>
                                <hr/>
                                <div className="d-flex flex-wrap">
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.woocommerce_aktiv || false}
                                        onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'woocommerce_aktiv')}
                                        label="WooCommerce aktiv"
                                    />
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_wp_general.woocommerce_sidebar || false}
                                        onChange={(e) => this.props.onUpdateTemplateOptionen(e.target.checked, 'woocommerce_sidebar')}
                                        label="WooCommerce Sidebar aktiv"
                                    />
                                </div>
                            </CardBody>
                        </Card>{*/}
                    </Fragment>}
            </Fragment>
        )
    }
}