import {Form, Modal, FloatingLabel, Row, Col, Button} from "react-bootstrap";
import parse from 'html-react-parser';
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class DebugLogModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onGetDebugLog = this.onGetDebugLog.bind(this);
    }

    onGetDebugLog(handle) {
        let formData = {
            'method': 'get_debug_log',
            'handle': handle
        }
        this.props.sendFetchApi(formData)
    }
    render() {
        return (
            <Modal
                show={this.props.showLogModal}
                onHide={() => this.props.setShowLogModal(false)}
                backdrop="static"
                scrollable={true}
                keyboard={false}
                fullscreen={true}
            >
                <Modal.Header className="modal-theme-v3 text-light"
                              style={{backgroundColor: '#3e4654'}}
                              closeButton>
                    <Modal.Title>
                        Debug Log
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="debug-log">
                    {parse(this.props.debugLogFile)}
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button onClick={() => this.onGetDebugLog('add')}
                        variant="outline-primary">
                        aktualisieren
                    </Button>
                    <Button variant="outline-secondary" onClick={() => this.props.setShowLogModal(false)}>
                        Schließen
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}