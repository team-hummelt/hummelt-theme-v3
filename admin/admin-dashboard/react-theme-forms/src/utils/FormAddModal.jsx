import {Form, Modal,FloatingLabel, Row, Col, Button} from "react-bootstrap";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class FormAddModal extends Component {
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
            'method': 'form_handle',
            'designation': this.props.designation,
            'handle': 'designation',
            'id': this.props.id || ''
        }
        this.props.sendFetchApi(formData)

    }

    render() {
        return (
            <Modal
                show={this.props.showAddFormModal}
                onHide={() => this.props.onSetShowAddFormModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header className="modal-theme-v3 text-light" style={{backgroundColor: '#3e4654'}}
                                  closeButton>
                        <Modal.Title>
                            <i className="bi bi-envelope-plus me-2"></i>
                            Formular
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
                                        value={this.props.designation || ''}
                                        onChange={(e) => this.props.onSetDesignation(e.target.value)}
                                        placeholder="Bezeichnung"/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.onSetShowAddFormModal(false)}>
                            Abbrechen
                        </Button>
                        <Button type="submit" variant="primary">
                            {this.props.id ? 'Änderungen speichen' : 'Formular hinzufügen'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}