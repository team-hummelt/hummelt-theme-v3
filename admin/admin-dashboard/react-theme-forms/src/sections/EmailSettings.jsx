const {Component, createRef} = wp.element;
import {v4 as uuidv4} from "uuid";
import SetAjaxResponse from "../utils/SetAjaxResponse.jsx";
import {Button, Col, Row, Card, Form, FloatingLabel, CardHeader, CardBody, Collapse} from "react-bootstrap";

export default class EmailSettings extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsForm = createRef();
        this.state = {}

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSendTestMail = this.onSendTestMail.bind(this);
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }

        let formData = {
            'method': 'email_smtp_test',
        }
        this.props.sendFetchApi(formData)

    }

    onSendTestMail() {
        let formData = {
            'method': 'send_test_email',
            'email': this.props.editEmailSettings.test_msg
        }
        this.props.sendFetchApi(formData)
    }

    render() {
        return (
            <>
                <div style={{minHeight: '53vh'}}
                     className="bg-custom-gray position-relative border rounded mt-1 mb-3 p-3">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">
                            <i className="text-blue bi bi-gear me-2"></i>
                            E-Mail Einstellungen
                        </h5>

                    </div>
                    <hr/>
                    <Col xxl={9} xl={10} xs={12} className="mx-auto">
                        <Card className="shadow-sm">
                            <CardHeader style={{minHeight: '3.5rem'}} className="d-flex flex-wrap align-items-center">
                                <div className="fs-6 fw-semibold">SMTP und E-Mail Einstellungen</div>
                                <div className="ms-auto">
                                    <div
                                        className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                    <small>
                                        <SetAjaxResponse
                                            status={this.props.spinner.ajaxStatus}
                                            msg={this.props.spinner.ajaxMsg}
                                        />
                                    </small>
                                </div>

                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={this.handleSubmit}>
                                    <Row className="g-2">
                                        <Col xs={12}>
                                            <div className="d-flex  flex-wrap">
                                            <Form.Check
                                                className="no-blur mt-1"
                                                type="switch"
                                                id={uuidv4()}
                                                checked={this.props.editEmailSettings.active || false}
                                                onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.checked, 'active')}
                                                label='SMTP aktiv'
                                            />
                                            <div className="ms-auto">
                                                <small className={`${this.props.editEmailSettings.status ? 'text-success' : 'text-danger'}`}>
                                                    SMTP status
                                                 <i className={`bi ms-2 ${this.props.editEmailSettings.status ? 'bi-check2-circle' : 'bi-x-circle'}`}></i>
                                                </small>
                                            </div>
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='Name oder Firma des Absenders'
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="text"
                                                    data-1p-ignore={true}
                                                    autoComplete="new-password"
                                                    value={this.props.editEmailSettings.abs_name || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'abs_name')}
                                                    placeholder='Name oder Firma des Absenders'/>
                                            </FloatingLabel>
                                            <div className="form-text">
                                                Wenn der Eintrag leer bleibt, wird der Seitentitel verwendet.
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='Reply-To'
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="email"
                                                    data-1p-ignore={true}
                                                    autoComplete="new-password"
                                                    value={this.props.editEmailSettings.reply_to || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'reply_to')}
                                                    placeholder='Reply-To'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={'Absender E-Mail *'}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    disabled={!this.props.editEmailSettings.active}
                                                    type="email"
                                                    data-1p-ignore={true}
                                                    autoComplete="new-password"
                                                    value={this.props.editEmailSettings.abs_email || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'abs_email')}
                                                    required={true}
                                                    placeholder='Absender E-Mail'/>
                                            </FloatingLabel>
                                            <div className="form-text">
                                                In den meisten Fällen muss hier die E-Mail des Anbieters eingegeben
                                                werden.
                                            </div>
                                        </Col>

                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='SMTP Host *'
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="text"
                                                    data-1p-ignore={true}
                                                    autoComplete="new-password"
                                                    disabled={!this.props.editEmailSettings.active}
                                                    value={this.props.editEmailSettings.smtp_host || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'smtp_host')}
                                                    required={true}
                                                    placeholder='SMTP Host'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={'SMTP Port *'}
                                            >
                                                <Form.Control
                                                    className="no-blur"
                                                    type="number"
                                                    data-1p-ignore={true}
                                                    autoComplete="new-password"
                                                    disabled={!this.props.editEmailSettings.active}
                                                    value={this.props.editEmailSettings.smtp_port || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'smtp_port')}
                                                    required={true}
                                                    placeholder='SMTP Port'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='SMTP Secure *'
                                            >
                                                <Form.Control
                                                    type="text"
                                                    className="no-blur"
                                                    data-1p-ignore={true}
                                                    autoComplete="new-password"
                                                    disabled={!this.props.editEmailSettings.active}
                                                    value={this.props.editEmailSettings.smtp_secure || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'smtp_secure')}
                                                    required={true}
                                                    placeholder='SMTP Secure'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='Benutzername *'
                                            >
                                                <Form.Control
                                                    type="text"
                                                    className="no-blur"
                                                    data-1p-ignore={true}
                                                    autoComplete="new-password"
                                                    disabled={!this.props.editEmailSettings.active}
                                                    value={this.props.editEmailSettings.email_username || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'email_username')}
                                                    required={true}
                                                    placeholder='Benutzername'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12} className="position-relative">
                                            <div style={{right: '-.5rem', top: '1.35rem'}}
                                                 className="position-absolute z-1  ">
                                                <i onClick={() => this.props.onToggleEmailPw(!this.props.showEmailPw)}
                                                   className={`bi  cursor-pointer ${this.props.showEmailPw ? 'bi-eye text-primary' : 'bi-eye-slash'}`}></i>
                                            </div>

                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='Passwort'
                                            >
                                                <Form.Control
                                                    type={`${this.props.showEmailPw ? 'text' : 'password'}`}
                                                    className="no-blur"
                                                    data-1p-ignore={true}
                                                    autoComplete="new-password"
                                                    disabled={!this.props.editEmailSettings.active}
                                                    value={this.props.editEmailSettings.email_password || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'email_password')}
                                                    required={true}
                                                    placeholder='Passwort'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Check
                                                className="no-blur mt-1"
                                                type="switch"
                                                id={uuidv4()}
                                                disabled={!this.props.editEmailSettings.active}
                                                checked={this.props.editEmailSettings.smtp_auth_active || false}
                                                onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.checked, 'smtp_auth_active')}
                                                label='SMTP Authentication'
                                            />
                                        </Col>
                                        <Col xs={12}>
                                            <hr/>
                                            <div className="d-flex flex-wrap">
                                                <Form.Check
                                                    className="no-blur me-4"
                                                    type="switch"
                                                    id={uuidv4()}
                                                    checked={this.props.editEmailSettings.email_save_active || ''}
                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.checked, 'email_save_active')}
                                                    label='E-Mail speichern aktiv'
                                                />
                                                <div className="ms-auto"></div>
                                                <Button
                                                    type="submit"
                                                    disabled={!this.props.editEmailSettings.active}
                                                    size="sm"
                                                    variant={`outline-secondary me-1`}>
                                                    SMTP Test
                                                </Button>
                                                <Button
                                                    onClick={() => this.props.onToggleSendTestMail(!this.props.showSendTestMail)}
                                                    type="button"
                                                    //disabled={!this.props.editEmailSettings.status || !this.props.editEmailSettings.active}
                                                    size="sm"
                                                    variant={`outline-secondary`}>
                                                    Test E-Mail
                                                </Button>
                                            </div>
                                            <Col xs={12}>
                                                <Collapse in={this.props.showSendTestMail}>
                                                    <div id={uuidv4()}>
                                                        <hr/>
                                                        <Col xl={6} xs={12}>
                                                            <FloatingLabel
                                                                controlId={uuidv4()}
                                                                label='Empfänger'
                                                            >
                                                                <Form.Control
                                                                    className="no-blur"
                                                                    type="email"
                                                                    data-1p-ignore={true}
                                                                    autoComplete="new-password"
                                                                    value={this.props.editEmailSettings.test_msg || ''}
                                                                    onChange={(e) => this.props.onSetEmailSettings(e.currentTarget.value, 'test_msg')}
                                                                    placeholder='Empfänger'/>
                                                            </FloatingLabel>
                                                        </Col>
                                                        <Col xs={12}>
                                                            <Button
                                                                onClick={this.onSendTestMail}
                                                                type="button"
                                                                size="sm"
                                                                variant={`primary mt-3`}>
                                                                Test E-Mail senden
                                                            </Button>
                                                        </Col>
                                                        <hr/>
                                                    </div>
                                                </Collapse>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </div>
            </>
        )
    }
}