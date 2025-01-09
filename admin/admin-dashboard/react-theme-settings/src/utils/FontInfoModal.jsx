import {Form, Modal, Button, Row, Col} from "react-bootstrap";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class FontInfoModal extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {

        }
    }

    render() {
        return (
            <Modal
                show={this.props.showInfoFontModal}
                onHide={() => this.props.onSetInfoFontModal(false)}
                size="xl"
                scrollable={true}
            >
                <Modal.Header className="modal-theme-v3 text-light" style={{backgroundColor: '#3e4654'}} closeButton>
                    <Modal.Title className="fs-5">
                        <i className="bi bi-fonts me-2"></i>
                        {this.props.designation}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Schriftstile</h5>
                    {this.props.fontData && this.props.fontData.length &&
                    <ul style={{listStyle: 'inside', paddingLeft: '1rem'}}>
                        {this.props.fontData.map((fd, fi) => {
                            return (
                                <li key={fi}>
                                    {fd.local_name}
                                </li>
                            )
                        })}
                    </ul>}
                    <hr/>
                    {this.props.fontInfo && this.props.fontInfo.length &&
                    <Row className="g-3">
                        {this.props.fontInfo.map((ff, fi) => {
                            return (
                                <Col key={fi} xl={ff.full ? 12 : 6} xs={12}>
                                    <div className="border rounded px-3 py-2 h-100">
                                       <h5 className="lh-1 fw-semibold text-body">
                                           {ff.label}
                                       </h5>
                                        <span>{ff.value}</span>
                                    </div>
                                </Col>
                            )
                        })}


                    </Row>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={() => this.props.onSetInfoFontModal(false)}>
                        Schließen
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}