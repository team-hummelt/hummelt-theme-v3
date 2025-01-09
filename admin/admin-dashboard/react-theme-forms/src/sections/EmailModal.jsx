import {Fragment} from "react";

const {Component, createRef} = wp.element;
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import parser from 'html-react-parser';

export default class EmailModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = createRef();
        this.state = {}
        this.downloadEmailAttachment = this.downloadEmailAttachment.bind(this);
    }

    downloadEmailAttachment(file, name) {
        window.open(`${hummeltRestObj.email_attachment_download}/?file=${file}&name=${name}`, '_blank');
    }

    render() {
        return (
            <>
                <Modal className="form-builder-modal forms"
                       animation={true}
                       scrollable={true}
                       show={this.props.showEmailModal}
                       onHide={() => this.props.setShowEmailModal(false)}
                       size="xl"
                >
                    <Modal.Header className="modal-theme-v3 text-light fs-6"
                                  style={{backgroundColor: '#3e4654'}}
                                  closeButton>
                        <Modal.Title>
                            <i className="bi bi-envelope me-2"></i>
                            E-Mail Empfangen
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex align-items-center flex-wrap">
                            <h5>E-Mail Gesendet: {this.props.sendEmail.created_at || ''}</h5>
                            <div className="ms-auto">
                                <small><b className="fw-semibold">IP:</b> {this.props.sendEmail.ip || ''} </small>
                            </div>
                        </div>
                        <hr/>
                        <div className="d-flex mt-2">
                            <span style={{minWidth: '6rem'}} className="fw-semibold d-inline-block text-primary">Formular:</span>
                            <span className="fw-normal d-inline-block">{this.props.sendEmail.form || ''}</span>
                        </div>
                        <div className="d-flex mt-2">
                            <span style={{minWidth: '6rem'}} className="fw-semibold d-inline-block text-primary">Betreff:</span>
                            <span className="fw-normal d-inline-block">{this.props.sendEmail.subject || ''}</span>
                        </div>
                        <div className="d-flex mt-2">
                            <span style={{minWidth: '6rem'}} className="fw-semibold d-inline-block text-primary">Empfänger:</span>
                            <span className="fw-normal d-inline-block">{this.props.sendEmail.to || ''}</span>
                        </div>
                        <div className="d-flex mt-2">
                            <span style={{minWidth: '6rem'}} className="fw-semibold d-inline-block text-primary">Cc:</span>
                            <span className="fw-normal d-inline-block">{this.props.sendEmail.cc || ''}</span>
                        </div>
                        <div className="d-flex mt-2">
                            <span style={{minWidth: '6rem'}} className="fw-semibold d-inline-block text-primary">Bcc:</span>
                            <span className="fw-normal d-inline-block">{this.props.sendEmail.bcc || ''}</span>
                        </div>
                        {this.props.sendEmail.uploads && this.props.sendEmail.uploads.length ?
                            <Fragment>
                                <hr/>
                                <h6 className="text-primary">Anhang:</h6>
                                <div className="d-flex flex-wrap">
                                    {this.props.sendEmail.uploads.map((u, i) => {
                                        return (
                                            <div onClick={() => this.downloadEmailAttachment(u.file , u.file_name)}
                                                className="px-3 py-2 border cursor-pointer rounded me-1" key={i}>
                                                {u.file_name}
                                                <i className="ni bi-download ms-2 text-primary"></i>
                                            </div>
                                        )
                                    })}
                                </div>
                                <hr/>
                            </Fragment>
                            : ''}
                        <h6 className="text-primary">Nachricht:</h6>
                        {parser(this.props.sendEmail.message || '')}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="button"
                            variant="outline-secondary rounded"
                            onClick={() => this.props.setShowEmailModal(false)}>
                            Schließen
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}