import {Card, CardBody, Form, Button, FormGroup, Col, Row, Nav, Collapse, FloatingLabel} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import MapDatenschutzHandle from "./MapDatenschutzHandle.jsx";
import * as AppTools from "../utils/AppTools.js";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class MapDatenschutz extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            colStart: true,
            colEdit: false,
            edit: {}
        }

        this.setCollapse = this.setCollapse.bind(this);
        this.getEditDs = this.getEditDs.bind(this);
        this.onSetEditValue = this.onSetEditValue.bind(this);
        this.deleteDatenschutz = this.deleteDatenschutz.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.triggerMapDs) {
            this.setCollapse('start', true)
            this.props.onSetTriggerMapDs(false);
        }
    }

    findArrayElementById(array, id, type) {
        return array.find((element) => {
            return element[type] === id;
        })
    }

    filterArrayElementById(array, id, type) {
        return array.filter((element) => {
            return element[type] !== id;
        })
    }

    getEditDs(id) {
        const google_maps_datenschutz = [...this.props.settings.google_maps_datenschutz];
        const find = this.findArrayElementById(google_maps_datenschutz, id, 'id');
        if (find) {
            this.setState({
                edit: find
            })
            this.setCollapse('edit');
        }
    }

    setCollapse(target, reset = false) {
        let start = false;
        let edit = false;
        switch (target) {
            case 'start':
                start = true;
                break;
            case 'edit':
                edit = true;
                break;
        }

        this.setState({
            colStart: start,
            colEdit: edit
        })

        if (reset) {
            this.setState({
                edit: {}
            })
        }
    }

    onSetEditValue(e, type) {
        let edit = this.state.edit;
        edit[type] = e;
        this.setState({
            edit: edit
        })
    }

    deleteDatenschutz(id) {
        let swal = {
            'title': 'Datenschutz löschen?',
            'btn': 'Datenschutz löschen',
            'msg': 'Das Löschen kann nicht rückgängig gemacht werden!'
        }
        AppTools.swal_delete_modal(swal).then((result) => {
            if(result){
                let formData = {
                    'method': 'delete_ds',
                    'id': id
                }
                this.props.sendFetchApi(formData)
            }
        })

    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.google_maps_datenschutz &&
                    <Fragment>
                        <Card className="shadow-sm my-2">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Maps Datenschutz Einstellungen
                                </h6>
                                <hr/>
                                <Collapse
                                    in={this.state.colStart}>
                                    <div id={uuidv4()}>
                                        <Button onClick={() => this.setCollapse('edit', true)}
                                                size="sm"
                                                variant="outline-primary">
                                            <i className="bi bi-node-plus me-2"></i>
                                            Datenschutz Option hinzufügen
                                        </Button>
                                        <hr/>
                                        <Row className="g-3">
                                            {this.props.settings.google_maps_datenschutz.map((d, i) => {
                                                return (
                                                    <Col key={i} xxl={3} xl={4} lg={6} xs={12}>
                                                        <div className="h-100 bg-light border rounded shadow">
                                                            <div className="d-flex p-3 flex-column h-100">
                                                                <div className="text-primary text-truncate">
                                                                    {d.ds_bezeichnung}
                                                                </div>
                                                                <div className="mt-auto">
                                                                    <hr/>
                                                                    <Button onClick={() => this.getEditDs(d.id)}
                                                                            size="sm"
                                                                            variant="outline-primary me-2">
                                                                        Details
                                                                    </Button>
                                                                    {d.delete ?
                                                                        <Button onClick={() => this.deleteDatenschutz(d.id)}
                                                                            size="sm"
                                                                            variant="outline-danger">
                                                                            löschen
                                                                        </Button>
                                                                        : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </div>
                                </Collapse>
                                <Collapse
                                    in={this.state.colEdit}>
                                    <div id={uuidv4()}>
                                        <MapDatenschutzHandle
                                            setCollapse={this.setCollapse}
                                            onSetEditValue={this.onSetEditValue}
                                            sendFetchApi={this.props.sendFetchApi}
                                            edit={this.state.edit}
                                            pages={this.props.pages}
                                        />
                                    </div>
                                </Collapse>
                            </CardBody>
                        </Card>
                    </Fragment>}
            </Fragment>
        )
    }
}