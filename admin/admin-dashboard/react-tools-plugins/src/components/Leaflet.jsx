import {Card, CardBody, Form, Row, Accordion, Col, Container, Button, Nav, Collapse} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../utils/AppTools.js";

const {Component, Fragment} = wp.element;
import AddEditLeafletModal from "../utils/AddEditLeafletModal.jsx";
import LeafletPins from "./LeafletPins.jsx";
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Leaflet extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            colStart: true,
            colEdit: false,
            triggerLeafletPins: false,
            edit: {},
        }
        this.onAddOsmLeaflet = this.onAddOsmLeaflet.bind(this);
        this.onSetOsmEdit = this.onSetOsmEdit.bind(this);
        this.onGetOsmEdit = this.onGetOsmEdit.bind(this);
        this.onDeleteLeaflet = this.onDeleteLeaflet.bind(this);
        this.onSetCollapse = this.onSetCollapse.bind(this);
        this.onSetTriggerLeafletPins = this.onSetTriggerLeafletPins.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.triggerLeafletEdit) {
            this.onSetCollapse('start', true)
            this.props.omSetTriggerLeafletEdit(false);
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

    onSetTriggerLeafletPins(state) {
        this.setState({
            triggerLeafletPins: state
        })
    }

    onAddOsmLeaflet() {
        this.setState({
            edit: {}
        })
        this.props.onSetAddEditLeafletModal(true);
    }

    onSetOsmEdit(e, type) {
        let edit = this.state.edit;
        edit[type] = e;
        this.setState({
            edit: edit
        })
    }

    onGetOsmEdit(id, handle) {
        const leaflet = [...this.props.settings.leaflet];
        const find = this.findArrayElementById(leaflet, id, 'id');
        if (find) {
            this.setState({
                edit: find
            })
            if (handle === 'modal') {
                this.props.onSetAddEditLeafletModal(true);
            }
            if(handle === 'pins') {
                this.onSetCollapse('edit');
            }
        }
    }

    onDeleteLeaflet(id) {
        let swal = {
            'title': 'OSM Karte löschen?',
            'btn': 'Karte löschen',
            'msg': 'Das Löschen kann nicht rückgängig gemacht werden.'
        }
        AppTools.swal_delete_modal(swal).then((result) => {
            if (result) {
                let formData = {
                    'method': 'delete_osm_leaflet',
                    'id': id
                }
                this.props.sendFetchApi(formData)
            }
        })
    }

    onSetCollapse(target, reset = false) {
        let start = false;
        let edit = false;
        switch (target) {
            case 'start':
                start = true;
                this.setState({
                    triggerLeafletPins: true
                })
                break;
            case 'edit':
                edit = true;
                break;
        }
        this.setState({
            colStart: start,
            colEdit: edit,
        })
        if (reset) {
            this.setState({
                edit: {}
            })
        }
    }

    render() {
        return (
            <Fragment>
                <Card className="shadow-sm my-2">
                    <CardBody>
                        <h6>
                            <i className="bi bi-arrow-right-short me-1"></i>
                            OpenStreetMap Leaflet
                        </h6>
                        <hr/>
                        <Collapse
                            in={this.state.colStart}>
                            <div id={uuidv4()}>
                                <Button
                                    onClick={this.onAddOsmLeaflet}
                                    type="button"
                                    size="sm"
                                    variant="outline-primary">
                                    <i className="bi bi-node-plus me-2"></i>
                                    OpenStreetMap Leaflet hinzufügen
                                </Button>
                                <hr/>
                                {this.props.settings.leaflet ?
                                    <Row className="g-3">
                                        {this.props.settings.leaflet.map((l, i) => {
                                            return (
                                                <Col key={i} xxl={3} xl={4} lg={6} xs={12}>
                                                    <div className="h-100 bg-light border rounded shadow">
                                                        <div className="d-flex p-3 flex-column h-100">
                                                            <div className="text-primary text-truncate">
                                                                {l.designation} <sup>
                                                                <i onClick={() => this.onGetOsmEdit(l.id, 'modal')}
                                                                   className="cursor-pointer bi bi-pencil-square"></i>
                                                            </sup>
                                                            </div>
                                                            <div className="mt-auto">
                                                                <hr/>
                                                                <Button onClick={() => this.onGetOsmEdit(l.id, 'pins')}
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline-primary me-2">
                                                                    Details
                                                                </Button>
                                                                <Button onClick={() => this.onDeleteLeaflet(l.id)}
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="outline-danger me-2">
                                                                    löschen
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                    : ''}
                            </div>
                        </Collapse>
                        <Collapse
                            in={this.state.colEdit}>
                            <div id={uuidv4()}>
                                <LeafletPins
                                    onSetCollapse={this.onSetCollapse}
                                    onSetTriggerLeafletPins={this.onSetTriggerLeafletPins}
                                    edit={this.state.edit}
                                    triggerLeafletPins={this.state.triggerLeafletPins}
                                    onAddLeafletPin={this.props.onAddLeafletPin}
                                    onSetPinEdit={this.props.onSetPinEdit}
                                    onDeleteLeafletPin={this.props.onDeleteLeafletPin}
                                    osm_tile_layers={this.props.osm_tile_layers}
                                    onSetLeafletHandle={this.props.onSetLeafletHandle}
                                />
                            </div>
                        </Collapse>
                    </CardBody>
                </Card>
                <AddEditLeafletModal
                    triggerOsmLeafletModal={this.props.triggerOsmLeafletModal}
                    onSetAddEditLeafletModal={this.props.onSetAddEditLeafletModal}
                    onSetOsmEdit={this.onSetOsmEdit}
                    edit={this.state.edit}
                    sendFetchApi={this.props.sendFetchApi}
                />
            </Fragment>
        )
    }
}