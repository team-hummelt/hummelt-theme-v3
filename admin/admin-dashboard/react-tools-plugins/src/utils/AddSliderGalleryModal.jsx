import {Form, Modal,FloatingLabel, Row, Col, Button} from "react-bootstrap";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class AddSliderGalleryModal extends Component {
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
            'method': 'add_slider_gallery',
            'handle': this.props.handle,
            'designation': this.props.edit.designation
        }
        this.props.sendFetchApi(formData)

    }

    render() {
        return (
            <Modal
                show={this.props.triggerSliderGalleryModal}
                onHide={() => this.props.onSetAddSliderGalleryModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header className="modal-theme-v3 text-light" style={{backgroundColor: '#3e4654'}}
                                  closeButton>
                        <Modal.Title>
                            <i className={`bi me-2 ${this.props.handle === 'slider' ? 'bi-arrow-left-right' : 'bi-images'}`}></i>
                            {this.props.handle === 'slider' ? 'Slider' : 'Galerie'}  Bezeichnung
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
                                        onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'designation')}
                                        placeholder="Bezeichnung"/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button  variant="secondary rounded" onClick={() => this.props.onSetAddSliderGalleryModal(false)}>
                            Schließen
                        </Button>
                        <Button type="submit" variant="primary rounded">
                            {this.props.handle === 'slider' ? 'Slider' : 'Galerie'} hinzufügen
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}