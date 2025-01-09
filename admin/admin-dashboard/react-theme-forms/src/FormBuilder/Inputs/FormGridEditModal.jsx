import {v4 as uuidv4} from "uuid";

const {Component} = wp.element;
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Row, Col} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export default class FormGridEditModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
        this.onSetRef = this.onSetRef.bind(this);

    }

    onSetRef(id) {

    }

    render() {
        return (
            <Modal className="form-builder-modal forms"
                   animation={true}
                   scrollable={true}
                   show={this.props.showGridModal}
                   onHide={() => this.props.onSetGridModal(false)}
                   //size="xl"
            >
                <Modal.Header className="modal-theme-v3 text-light fs-6"
                              style={{backgroundColor: '#3e4654'}}
                              closeButton>
                    <Modal.Title>
                        <i className="bi bi-filetype-css me-2"></i>
                        Grid CSS
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel
                        controlId={uuidv4()}
                        label="Grid extra CSS"
                    >
                        <Form.Control
                            className="no-blur"
                            value={this.props.editGrid.css || ''}
                            onChange={(e) => this.props.onSetGridExtra(e.currentTarget.value, 'css', this.props.editGrid.id, this.props.editGrid.builder_id)}
                            type="text"
                            />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        variant="outline-secondary rounded"
                        onClick={() => this.props.onSetGridModal(false)}>
                        Schließen
                    </Button>

                </Modal.Footer>
            </Modal>
        );
    }
}