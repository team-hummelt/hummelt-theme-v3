import {Card, CardBody, Col, Container, FloatingLabel, Form, Button} from "react-bootstrap";
import {v4 as uuidv4} from 'uuid';
import ApiErrorAlert from "../../../utils/ApiErrorAlert.jsx";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onSubmitActivate = this.onSubmitActivate.bind(this);
    }

    onSubmitActivate(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'activate_theme',
            'id': this.props.license.theme.license || ''
        }
        this.props.sendFetchApi(formData)
    }


    render() {
        return (
            <Fragment>
                <Card className="w-100 shadow-sm flex-fill" style={{background: 'none'}}>
                    <CardBody className="d-flex flex-column align-items-center justify-content-center">
                        <div className="w-100 mb-5">
                            <h5>Theme-Aktivierung</h5>
                            <small className={` ${this.props.license.theme.aktiv ? 'text-success' : 'text-danger'}`}>{this.props.license.theme.aktiv ? 'Theme ist aktiviert' : 'Theme nicht aktiv'}</small>
                            <hr/>
                            <Form onSubmit={this.onSubmitActivate}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label="Lizenz *"
                                    className="my-2"
                                >
                                    <Form.Control
                                        className="no-blur"
                                        required={true}
                                        disabled={!this.props.cron_active || this.props.local}
                                        type="text"
                                        value={this.props.license.theme.license || ''}
                                        onChange={(e) => this.props.onSetThemeLicense(e.currentTarget.value, 'license')}
                                        autoComplete="new-password"
                                        placeholder="Lizenz"/>
                                </FloatingLabel>
                                <Button
                                    type="submit"
                                    disabled={!this.props.cron_active  || this.props.local}
                                    className="mb-2" variant="primary">
                                    {this.props.license.theme.aktiv ? 'Ändern' : 'Aktivieren'}
                                </Button>
                            </Form>
                            {!this.props.cron_active &&
                                <div className="form-text text-danger">
                                    Das Theme kann bei deaktivierten Cronjob nicht aktiviert werden.
                                </div>
                            }
                            {this.props.local ?
                                <div className="form-text">
                                    Das Theme ist in der Testumgebung <b className="text-success fw-semibold">aktiv</b>.
                                </div>
                                : ''}
                            <hr/>
                            <div className="fs-5 fw-light"> Wo kann ich meinen Code finden?</div>
                            <ul className="list-unstyled  pt-3">
                                <li className="mb-1">
                                    <b className="fw-semibold me-1">1.</b> Bitte gehen Sie zu <a target="_blank"
                                    href="https://produkte.hu-ku.com/">https://produkte.hu-ku.com/lizenz</a>
                                </li>
                                <li className="mb-1">
                                    <b className="fw-semibold me-1">2.</b> Loggen Sie sich mit Ihren Zugangsdaten ein
                                </li>
                                <li className="mb-1">
                                    <b className="fw-semibold me-1">3.</b> Zertifikate auswählen
                                </li>
                                <li className="mb-1">
                                    <b className="fw-semibold me-1">4.</b> Zertifikate code kopieren
                                </li>
                            </ul>
                            <div className="fs-5 mb-2 fw-light">
                                Lizenz kaufen
                            </div>
                            <p>Wenn Sie eine weitere Lizenz für eine neue Website benötigen</p>
                            <Button disabled={true}
                                    variant="outline-secondary opacity-50" href="#">
                                Neue Lizenz erwerben
                            </Button>
                            <hr/>
                        </div>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }

}