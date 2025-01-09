import {Card, CardBody, Row, Col, Container, FloatingLabel, Form, Button} from "react-bootstrap";
import {v4 as uuidv4} from 'uuid';
import ApiErrorAlert from "../../../utils/ApiErrorAlert.jsx";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Plugins extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onClickActivate = this.onClickActivate.bind(this);
    }

    onClickActivate(slug, license) {

        let formData = {
            'method': 'activate_plugin',
            'slug': slug,
            'id': license

        }
        this.props.sendFetchApi(formData)
    }

    render() {
        return (
            <Fragment>
                <Card className="w-100 shadow-sm flex-fill" style={{background: 'none'}}>
                    <CardBody className="d-flex flex-column align-items-center justify-content-center">
                        <div className="w-100 mb-5">
                            <h5>Theme-Plugins</h5>
                            <hr/>
                            {!this.props.cron_active &&
                                <div className="form-text text-danger">
                                    Das Theme kann bei deaktivierten Cronjob nicht aktiviert werden.
                                </div>
                            }
                            {this.props.local ?
                                <div className="form-text">
                                    Plugins sind in der Testumgebung <b
                                    className="text-success fw-semibold">aktiv</b> und benötigen keine Lizenz.
                                </div>
                                : ''}

                            {this.props.license && this.props.license.plugins.length ?
                                <Row className="g-3 my-3">
                                    {this.props.license.plugins.map((p, i) => {
                                        return (
                                            <Col xxl={4} xl={4} lg={6} xs={12} key={i}>
                                                <div className="h-100 shadow border rounded p-3 d-flex flex-column">
                                                    <div className="fw-semibold text-truncate">
                                                         <span className={p.aktiv ? 'text-success' : 'text-danger'}> {p.bezeichnung}</span>
                                                    </div>
                                                    <small className="d-block text-truncate mb-3">
                                                        {p.beschreibung}
                                                    </small>
                                                    <hr className="mt-auto"/>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label="Lizenz"
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            disabled={!this.props.cron_active || this.props.local}
                                                            type="text"
                                                            value={p.license || ''}
                                                            onChange={(e) => this.props.onSetPluginLicense(e.currentTarget.value, 'license', p.slug)}
                                                            autoComplete="new-password"
                                                            placeholder="Lizenz"/>
                                                    </FloatingLabel>
                                                    <hr/>
                                                    <div>
                                                        <Button
                                                            type="button"
                                                            onClick={() => this.onClickActivate(p.slug, p.license)}
                                                            size={"sm"}
                                                            disabled={!this.props.cron_active || this.props.local}
                                                            className="mb-2" variant="primary">
                                                            {p.aktiv ? 'Ändern' : 'Aktivieren'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })}

                                </Row>
                                :
                                <div className="fs-6 my-3">
                                    <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                                    keine Plugins vorhanden...
                                </div>
                            }


                        </div>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}