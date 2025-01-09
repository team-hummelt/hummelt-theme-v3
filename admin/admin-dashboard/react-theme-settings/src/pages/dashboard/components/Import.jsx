import {Card, CardBody, Row, Col, Container, FloatingLabel, Form, Button} from "react-bootstrap";
import {v4 as uuidv4} from 'uuid';
import ApiErrorAlert from "../../../utils/ApiErrorAlert.jsx";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Import extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}

    }

  render() {
        return (
            <Card className="w-100 shadow-sm flex-fill" style={{background: 'none'}}>
                <CardBody className="d-flex flex-column align-items-center justify-content-center">
                    <div className="w-100 mb-5">
                        <h5>Import</h5>
                        <hr/>
                        <div className="fs-6 fw-semibold">
                            <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                            Import nicht aktiv
                        </div>

                    </div>
                </CardBody>
            </Card>
        )
  }
}