import {Card, CardBody, Form, Row, FloatingLabel, Col, Container, Nav, Collapse, Button} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class BackendDuplicate extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_duplicate_options &&
                    <Fragment>
                        {this.props.settings.theme_duplicate_options.backend_duplicate_disabled ?
                        <Button
                            onClick={() => this.props.onGetOpenPinModal('theme_duplicate_options')}
                            size="sm"
                            variant="outline-danger my-1 me-2">
                            Config bearbeiten
                        </Button>: ''}
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6 className={this.props.settings.theme_duplicate_options.backend_duplicate_disabled ? 'opacity-50' : ''}>
                                    <i className="bi bi-wordpress text-primary me-2"></i>
                                    Duplikat für vorhandene Beitragstypen anzeigen oder ausblenden
                                </h6>
                                <hr/>
                                <fieldset disabled={this.props.settings.theme_duplicate_options.backend_duplicate_disabled}>
                                    <Row className="g-2">
                                        {this.props.settings.duplicate_post_types.map((s, i) => {
                                            return (
                                                <Col xxl={2} xl={3} lg={4} md={6} key={i}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={s.label}
                                                    >
                                                        <Form.Select
                                                            className="no-blur mw-100"
                                                            value={s.value || ''}
                                                            onChange={(e) => this.props.onUpdateSortDupPostTypes(e.target.value, s.name, 'duplicate_post_types')}
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
                                <fieldset disabled={this.props.settings.theme_duplicate_options.backend_duplicate_disabled}>
                                    <h6 className={this.props.settings.theme_duplicate_options.backend_duplicate_disabled ? 'opacity-50' : ''}>
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
                                                value={this.props.settings.theme_duplicate_options.capability || ''}
                                                onChange={(e) => this.props.onUpdateSortDupOptionen(e.target.value, 'capability', 'theme_duplicate_options')}
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
                    </Fragment>}
            </Fragment>
        )
    }
}