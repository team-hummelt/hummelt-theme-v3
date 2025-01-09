import {Form, Modal,FloatingLabel, Row, Col, Button} from "react-bootstrap";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class AddEditLeafletModal extends Component {
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
            'method': 'osm_leaflet_handle',
            'handle': this.props.edit.id ? 'update' : 'insert',
            'data': JSON.stringify(this.props.edit)
        }
        this.props.sendFetchApi(formData)

    }

    render() {
        return (
            <Modal
                show={this.props.triggerOsmLeafletModal}
                onHide={() => this.props.onSetAddEditLeafletModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header className="modal-theme-v3 text-light" style={{backgroundColor: '#3e4654'}}
                                  closeButton>
                        <Modal.Title>
                            <i className="bi bi-pin-fill me-2"></i>
                           OSM Bezeichnung
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-2">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={'colorBezeichnung'}
                                    label="Bezeichnung *"
                                >
                                    <Form.Control
                                        className={`no-blur`}
                                        required={true}
                                        type="text"
                                        value={this.props.edit.designation || ''}
                                        onChange={(e) => this.props.onSetOsmEdit(e.target.value, 'designation')}
                                        placeholder="Bezeichnung"/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.onSetAddEditLeafletModal(false)}>
                            Schließen
                        </Button>
                        <Button type="submit" variant="primary">
                            {this.props.edit.id ? 'Änderungen speichern' : 'OSM hinzufügen'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}