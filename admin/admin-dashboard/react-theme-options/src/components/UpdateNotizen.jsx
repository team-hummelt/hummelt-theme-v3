import {Card, CardBody, Form, Row, FloatingLabel, Col, Container, Nav, Collapse, Button} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class UpdateNotizen extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.update_msg &&
                    <Fragment>
                        {this.props.settings.update_msg.update_msg_disabled ?
                        <Button
                            onClick={() => this.props.onGetOpenPinModal('update_msg')}
                            size="sm"
                            variant="outline-danger my-1 me-2">
                            Config bearbeiten
                        </Button> : ''}
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6 className={this.props.settings.update_msg.update_msg_disabled ? 'opacity-50' : ''}>
                                    <i className="bi bi-wordpress text-primary me-2"></i>
                                    WordPress E-Mail Update-Benachrichtigungen
                                </h6>
                                <hr/>
                                <fieldset disabled={this.props.settings.update_msg.update_msg_disabled}>
                                    <Form.Check
                                        type="switch"
                                        className="no-blur mb-2"
                                        id={uuidv4()}
                                        checked={this.props.settings.update_msg.core_upd_msg_disabled || false}
                                        onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'core_upd_msg_disabled', 'update_msg')}
                                        label="WordPress Update-Benachrichtigung deaktivieren (E-Mail)"
                                    />
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-2"
                                        id={uuidv4()}
                                        checked={this.props.settings.update_msg.plugin_upd_msg_disabled || false}
                                        onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'plugin_upd_msg_disabled', 'update_msg')}
                                        label="Plugin Update-Benachrichtigung deaktivieren (E-Mail)"
                                    />
                                    <Form.Check
                                        type="switch"
                                        className="no-blur"
                                        id={uuidv4()}
                                        checked={this.props.settings.update_msg.theme_upd_msg_disabled || false}
                                        onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'theme_upd_msg_disabled', 'update_msg')}
                                        label="Theme Update-Benachrichtigung deaktivieren (E-Mail)"
                                    />
                                </fieldset>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6 className={this.props.settings.update_msg.update_msg_disabled ? 'opacity-50' : ''}>
                                    <i className="bi bi-wordpress text-primary me-2"></i>
                                    Update-Benachrichtigungen im Dashboard
                                </h6>
                                <hr/>
                                <fieldset disabled={this.props.settings.update_msg.update_msg_disabled}>
                                    <Form.Check
                                        type="radio"
                                        className="no-blur mb-2"
                                        id={uuidv4()}
                                        name="upd_show_db"
                                        checked={this.props.settings.update_msg.dashboard_update_anzeige === 1 || false}
                                        onChange={(e) => this.props.updateWpOptionen(1, 'dashboard_update_anzeige', 'update_msg')}
                                        label="Update-Benachrichtigungen anzeigen"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-2"
                                        id={uuidv4()}
                                        name="upd_show_db"
                                        checked={this.props.settings.update_msg.dashboard_update_anzeige === 2 || false}
                                        onChange={(e) => this.props.updateWpOptionen(2, 'dashboard_update_anzeige', 'update_msg')}
                                        label="Update-Benachrichtigungen für alle Benutze ausblenden (einschließlich Administratoren)"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-2"
                                        id={uuidv4()}
                                        name="upd_show_db"
                                        checked={this.props.settings.update_msg.dashboard_update_anzeige === 3 || false}
                                        onChange={(e) => this.props.updateWpOptionen(3, 'dashboard_update_anzeige', 'update_msg')}
                                        label="Update-Benachrichtigungen nur für Administrator anzeigen"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-2"
                                        id={uuidv4()}
                                        name="upd_show_db"
                                        checked={this.props.settings.update_msg.dashboard_update_anzeige === 4 || false}
                                        onChange={(e) => this.props.updateWpOptionen(4, 'dashboard_update_anzeige', 'update_msg')}
                                        label="Nur WordPress-Update-Benachrichtigungen ausblenden"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-2"
                                        id={uuidv4()}
                                        name="upd_show_db"
                                        checked={this.props.settings.update_msg.dashboard_update_anzeige === 5 || false}
                                        onChange={(e) => this.props.updateWpOptionen(5, 'dashboard_update_anzeige', 'update_msg')}
                                        label="Nur Plugin-Update-Benachrichtigungen ausblenden"
                                    />
                                    <Form.Check
                                        type="radio"
                                        className="no-blur my-2"
                                        id={uuidv4()}
                                        name="upd_show_db"
                                        checked={this.props.settings.update_msg.dashboard_update_anzeige === 6 || false}
                                        onChange={(e) => this.props.updateWpOptionen(6, 'dashboard_update_anzeige', 'update_msg')}
                                        label="Nur Theme-Update-Benachrichtigungen ausblenden"
                                    />
                                </fieldset>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6 className={this.props.settings.update_msg.update_msg_disabled ? 'opacity-50' : ''}>
                                    <i className="bi bi-wordpress text-primary me-2"></i>
                                    Benachrichtigungen schwerwiegender Fehler (E-Mail)
                                </h6>
                                <hr/>
                                <fieldset disabled={this.props.settings.update_msg.update_msg_disabled}>
                                    <Form.Check
                                        type="switch"
                                        className="no-blur mb-3"
                                        id={uuidv4()}
                                        checked={this.props.settings.update_msg.send_error_email_disabled || false}
                                        onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'send_error_email_disabled', 'update_msg')}
                                        label="E-Mail schwerwiegender Fehler nicht senden"
                                    />
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="Error Message E-Mail Empfänger"
                                        >
                                            <Form.Control
                                                disabled={this.props.settings.update_msg.send_error_email_disabled}
                                                className={`no-blur`}
                                                type="email"
                                                value={this.props.settings.update_msg.email_err_msg || ''}
                                                onChange={(e) => this.props.updateWpOptionen(e.target.value, 'email_err_msg', 'update_msg')}
                                                placeholder={"Error Message E-Mail Empfänger"}
                                            />
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