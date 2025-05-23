import {Form, Modal,FloatingLabel, Row, Col, Button} from "react-bootstrap";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class SetConfigPinModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'edit_config',
            'pin': this.props.configPin,
            'handle': this.props.pinHandle
        }
        this.props.sendFetchApi(formData);

    }

    render() {
        return (
            <Modal
                show={this.props.showPinModal}
                onHide={() => this.props.setShowPinModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header className="modal-theme-v3 text-light" style={{backgroundColor: '#3e4654'}}
                                  closeButton>
                        <Modal.Title>
                            <i className="bi bi-incognito me-2"></i>
                            Config Pin
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>
                            Geben Sie den Pin zum Bearbeiten der Konfiguration ein
                        </h6>
                        <Row className="g-2">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={'configPin'}
                                    label="Config PIN *"
                                >
                                    <Form.Control
                                        className={`no-blur`}
                                        required={true}
                                        type="text"
                                        value={this.props.configPin || ''}
                                        onChange={(e) => this.props.onSetConfigPin(e.target.value)}
                                        placeholder="Config PIN"/>
                                </FloatingLabel>
                            </Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.setShowPinModal(false)}>
                            Schließen
                        </Button>
                        <Button type="submit" variant="primary">
                            Abschicken
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}