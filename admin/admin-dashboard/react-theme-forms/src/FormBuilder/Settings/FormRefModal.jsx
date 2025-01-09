const {Component} = wp.element;
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Row, Col} from 'react-bootstrap';

export default class FormRefModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = React.createRef();
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
                   show={this.props.showRefModal}
                   onHide={() => this.props.onSetReferenzModal(false)}
                   size="xl"
            >
                <Modal.Header className="modal-theme-v3 text-light fs-6"
                              style={{backgroundColor: '#3e4654'}}
                              closeButton>
                    <Modal.Title>
                        <i className="bi bi-activity me-2"></i>
                        Gespeicherte Referenzen
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{minHeight: '60vh'}}>
                        <Row className="g-2">
                            {this.props.referenzen.map((r, i) => {
                                return (
                                    <Col xs={3} key={i}>
                                        <div className="d-flex align-items-center flex-wrap">
                                            <div className="fw-semibold text-primary" style={{minWidth: '2rem'}}>
                                                {(this.props.referenzen.length - (i) )}:
                                            </div>
                                            <div className={`me-2 ${this.props.activeRef === parseInt(r.id) ? 'fw-semibold text-success' : ''}`}>
                                                <i className="bi bi-clock-history me-1 small-lg"></i>
                                                {r.created_date}
                                            </div>
                                            <button onClick={() => this.props.setFormReferenz(r.id)}
                                                title="Wiederherstellen" className={`btn btn-sm btn-outline-light me-1  ${this.props.activeRef === parseInt(r.id) ? 'opacity-25 pe-none' : ''}`}>
                                                <i className="bi text-primary bi-reply"></i>
                                            </button>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        variant="outline-secondary rounded"
                        onClick={() => this.props.onSetReferenzModal(false)}>
                        Abbrechen
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}