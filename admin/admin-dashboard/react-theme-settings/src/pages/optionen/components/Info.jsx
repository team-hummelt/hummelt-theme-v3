
import {Card, CardBody, Col, Container, Nav, Collapse} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Info extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {

        }
    }

    render() {
        return (
            <Fragment>
                Info
            </Fragment>
        )
    }
}