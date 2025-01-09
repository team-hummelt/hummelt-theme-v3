import * as React from "react";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {v4 as uuidv4} from 'uuid';


const v5NameSpace = '5678803a-f63a-11ee-a11e-325096b39f47';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default class AddCustomFieldModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }

        let formData = {
            'method': 'add_custom_field',
            'designation': this.props.addCustomField.designation || '',
            'type': this.props.addCustomField.type || ''
        }
        this.props.sendFetchApi(formData)
       // this.props.sendAxiosFormdata(formData)
    }


    render() {
        return (
            <Modal
                show={this.props.addCustomFieldModal}
                onHide={() => this.props.setShowAddCustomFieldModal(false)}
                backdrop="static"
                keyboard={false}
                //size="lg"
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header
                        closeButton
                        className="modal-theme-v3 text-light" style={{backgroundColor: '#3e4654'}}
                    >
                        <Modal.Title
                            className="fw-normal"
                        >
                            Benutzerdefiniertes Feld
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`Bezeichnung *`}
                                >
                                    <Form.Control
                                        required={true}
                                        value={this.props.addCustomField.designation || ''}
                                        onChange={(e) => this.props.onSetAddCustomFieldValue(e.currentTarget.value, 'designation')}
                                        className="no-blur"
                                        type="text"
                                        placeholder='Bezeichnung'/>
                                </FloatingLabel>
                            </Col>
                            <Col xs={12}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={`Feld Typ *`}>
                                    <Form.Select
                                        className="no-blur mw-100"
                                        required={true}
                                        value={this.props.addCustomField.type || ''}
                                        onChange={(e) => this.props.onSetAddCustomFieldValue(e.currentTarget.value, 'type')}
                                        aria-label='Feld Typ'>
                                        <option value="">auswählen...</option>
                                        {this.props.selectType.map((s, index) =>
                                            <option value={s.id} key={index}>{s.label}</option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.setShowAddCustomFieldModal(false)}>
                           Abbrechen
                        </Button>
                        <Button type="submit" variant="primary">
                           Feld hinzufügen
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

