import {Form, Modal,FloatingLabel, Row, Col, Button} from "react-bootstrap";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class FontSettingsModal extends Component {
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
       this.props.onSendFontEdit();

    }

    render() {
        return (
            <Modal
                show={this.props.showFontSettingsModal}
                onHide={() => this.props.onSetSettingsFontModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header className="modal-theme-v3 text-light" style={{backgroundColor: '#3e4654'}}
                                  closeButton>
                        <Modal.Title>
                            <i className="bi bi-fonts me-2"></i>
                            {this.props.fontEdit.family}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>
                            {this.props.fontEdit.full_name}
                        </h6>
                        <Row className="g-2">
                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={'fontStyle'}
                                    label="Font-Style *"
                                >
                                    <Form.Control
                                        className={`no-blur`}
                                        required={true}
                                        disabled={this.props.fontEdit.fontType !== 'intern'}
                                        type="text"
                                        value={this.props.fontEdit.font_style || ''}
                                        onChange={(e) => this.props.onSetFontEdit(e.target.value, 'font_style')}
                                        placeholder="Font-Style"/>
                                </FloatingLabel>

                            </Col>
                            <Col xl={6} xs={12}>
                                <FloatingLabel
                                    controlId={'fontWeight'}
                                    label="Font-Weight *"
                                >
                                    <Form.Control
                                        className={`no-blur`}
                                        required={true}
                                        disabled={this.props.fontEdit.fontType !== 'intern'}
                                        type="text"
                                        value={this.props.fontEdit.font_weight || ''}
                                        onChange={(e) => this.props.onSetFontEdit(e.target.value, 'font_weight')}
                                        placeholder="Font-Weight"/>
                                </FloatingLabel>

                            </Col>
                            {this.props.fontEdit.fontType !== 'intern' ?
                                <Col className="mt-3" xs={12}>
                                    <small className="fw-semibold">Adobe <span className="fw-normal">Font</span> </small>
                                </Col>
                                : ''}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.onSetSettingsFontModal(false)}>
                            Schließen
                        </Button>
                        {this.props.fontEdit.fontType === 'intern' ?
                        <Button type="submit" variant="primary">
                            Speichern
                        </Button>: ''}
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}