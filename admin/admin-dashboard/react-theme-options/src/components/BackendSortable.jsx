import {Card, CardBody, Form, Row, FloatingLabel, Col, Container, Nav, Collapse, Button} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class BackendSortable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_sort_options &&
                    <Fragment>
                        {this.props.settings.theme_sort_options.backend_sortable_disabled ?
                        <Button
                            onClick={() => this.props.onGetOpenPinModal('theme_sort_options')}
                            size="sm"
                            variant="outline-danger my-1 me-2">
                            Config bearbeiten
                        </Button> : ''}
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6 className={this.props.settings.theme_sort_options.backend_sortable_disabled ? 'opacity-50' : ''}>
                                    <i className="bi bi-wordpress text-primary me-2"></i>
                                    Sortieren für vorhandene Post Types anzeigen oder ausblenden
                                </h6>
                                <hr/>
                                <fieldset disabled={this.props.settings.theme_sort_options.backend_sortable_disabled}>
                                    <Row className="g-2">
                                        {this.props.settings.sortable_post_types.map((s, i) => {
                                            return (
                                                <Col xxl={2} xl={3} lg={4} md={6} key={i}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={s.label}
                                                    >
                                                        <Form.Select
                                                            className="no-blur mw-100"
                                                             value={s.value || ''}
                                                             onChange={(e) => this.props.onUpdateSortDupPostTypes(e.target.value, s.name, 'sortable_post_types')}
                                                            aria-label={s.label}>
                                                            <option value="show">anzeigen</option>
                                                            <option value="hide">ausblenden</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                            )
                                        })}
                                    </Row>

                                </fieldset>

                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <fieldset disabled={this.props.settings.theme_sort_options.backend_sortable_disabled}>
                                    <h6 className={this.props.settings.theme_sort_options.backend_sortable_disabled ? 'opacity-50' : ''}>
                                        <i className="bi bi-wordpress text-primary me-2"></i>
                                        Mindestvoraussetzung für die Nutzung dieser Funktion
                                    </h6>
                                    <hr/>
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={"User Role"}
                                        >
                                            <Form.Select
                                                className="no-blur mw-100"
                                                 value={this.props.settings.theme_sort_options.capability || ''}
                                                 onChange={(e) => this.props.onUpdateSortDupOptionen(e.target.value, 'capability', 'theme_sort_options')}
                                                aria-label={"User Role"}>
                                                {this.props.roles.map((select, index) =>
                                                    <option key={index}
                                                            value={select.value}>
                                                        {select.name}
                                                    </option>
                                                )}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </fieldset>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <fieldset disabled={this.props.settings.theme_sort_options.backend_sortable_disabled}>
                                    <h6 className={this.props.settings.theme_sort_options.backend_sortable_disabled ? 'opacity-50' : ''}>
                                        <i className="bi bi-wordpress text-primary me-2"></i>
                                        Optionen
                                    </h6>
                                    <hr/>
                                    <Form.Check
                                        type="switch"
                                        className="no-blur"
                                        id={uuidv4()}
                                        checked={this.props.settings.theme_sort_options.autosort || false}
                                        onChange={(e) => this.props.onUpdateSortDupOptionen(e.target.checked, 'autosort', 'theme_sort_options')}
                                        label="Automatic sorting"
                                    />
                                    <div
                                        className={this.props.settings.theme_sort_options.backend_sortable_disabled ? 'opacity-50' : ''}>
                                        <div className="form-text">
                                            Wenn diese Option ausgewählt ist, ändert das Plugin automatisch die
                                            WordPress-Abfragen, um die neue Reihenfolge zu verwenden (es ist kein
                                            Code-Update
                                            erforderlich). Wenn nur bestimmte Abfragen die benutzerdefinierte Sortierung
                                            verwenden sollen, wählen Sie dies nicht aus und fügen Sie "orderby" =>
                                            'menu_order'
                                            als Parameter zu den Abfragen hinzu.
                                        </div>
                                        <hr/>
                                        <Form.Check
                                            type="switch"
                                            className="no-blur"
                                            id={uuidv4()}
                                            checked={this.props.settings.theme_sort_options.adminsort || false}
                                            onChange={(e) => this.props.onUpdateSortDupOptionen(e.target.checked, 'adminsort', 'theme_sort_options')}
                                            label="Admin sorting"
                                        />
                                        <div className="form-text">
                                            Dieses Häkchen muss gesetzt werden, damit die Einträge in der
                                            Standard-Listenansicht entsprechend der eingestellten Reihenfolge angezeigt
                                            werden.
                                        </div>
                                        <hr/>
                                        <Form.Check
                                            type="switch"
                                            className="no-blur"
                                            id={uuidv4()}
                                            checked={this.props.settings.theme_sort_options.use_query_ASC_DESC || false}
                                            onChange={(e) => this.props.onUpdateSortDupOptionen(e.target.checked, 'use_query_ASC_DESC', 'theme_sort_options')}
                                            label="ASC/DESC-Parameter in Abfrage verwenden"
                                        />
                                        <div className="form-text">
                                            Wenn die Abfrage einen Ordnungsparameter enthält, verwenden Sie diesen. Wenn
                                            die Abfrage-Reihenfolge auf DESC eingestellt ist, wird die Reihenfolge
                                            umgekehrt.
                                        </div>
                                        <hr/>
                                        <Form.Check
                                            type="switch"
                                            className="no-blur"
                                            id={uuidv4()}
                                            checked={this.props.settings.theme_sort_options.archive_drag_drop || false}
                                            onChange={(e) => this.props.onUpdateSortDupOptionen(e.target.checked, 'archive_drag_drop', 'theme_sort_options')}
                                            label="Archive Drag & Drop"
                                        />
                                        <div className="form-text">
                                            Ermöglicht sortierbare Drag & Drop-Funktionalität innerhalb der
                                            Standard-WordPress-Post-Type-Archive. Die Admin-Sortierung muss dafür aktiv
                                            sein.
                                        </div>
                                        <hr/>
                                        <Form.Check
                                            type="switch"
                                            className="no-blur"
                                            id={uuidv4()}
                                            checked={this.props.settings.theme_sort_options.navigation_sort_apply || false}
                                            onChange={(e) => this.props.onUpdateSortDupOptionen(e.target.checked, 'navigation_sort_apply', 'theme_sort_options')}
                                            label="Next / Apply Previous Next / Previous Apply"
                                        />
                                        <div className="form-text">
                                            Wenden Sie die Sortierung auf die gesamte Vorwärts-/Vorwärtsnavigation an.
                                        </div>
                                    </div>
                                </fieldset>
                            </CardBody>
                        </Card>
                    </Fragment>}
            </Fragment>
        )
    }
}