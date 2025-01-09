import {
    Card,
    CardBody,
    Accordion,
    Row,
    Col,
    Container,
    Nav,
    Collapse,
    Button,
    FloatingLabel,
    FormGroup,
    Form
} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../utils/AppTools.js";
import SimonColorPicker from "../utils/SimonColorPicker.jsx";
import Gallery from "../utils/Gallery.jsx";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class LeafletPins extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            showColSearch: false,
            showTilesLayer: false,
            lightboxOpen: false,
            lightboxIndex: 0,
            search: {
                zip: '',
                city: '',
                street: '',
                hnr: ''
            }
        }
        this.onSetSearchAdresse = this.onSetSearchAdresse.bind(this);
        this.onSetSearchCollapse = this.onSetSearchCollapse.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onPickrCallback = this.onPickrCallback.bind(this);
        this.onCallbackLightBox = this.onCallbackLightBox.bind(this);

        this.sendFetchApi = this.sendFetchApi.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.triggerLeafletPins) {
            this.setState({
                showColSearch: false,
                showTilesLayer: false,
                search: {
                    zip: '',
                    city: '',
                    street: '',
                    hnr: ''
                }
            })
            this.props.onSetTriggerLeafletPins(false);
        }
    }

    onPickrCallback(color, handle, id) {
        this.props.onSetPinEdit(color, handle, id, this.props.edit.id)
    }

    onSetSearchAdresse(e, type) {
        let search = this.state.search;
        search[type] = e;
        this.setState({
            search: search
        })
    }

    onSetSearchCollapse() {
        let status = !this.state.showColSearch;
        if (!status) {
            this.setState({
                search: {
                    zip: '',
                    city: '',
                    street: '',
                    hnr: ''
                }
            })
        }
        this.setState({
            showColSearch: status
        })
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'osm_search_json',
            'id': this.props.edit.id,
            'data': JSON.stringify(this.state.search)
        }
        this.sendFetchApi(formData)

    }

    onCallbackLightBox(value) {
        this.props.onSetLeafletHandle(value, 'tile_layer', this.props.edit.id)
        this.props.edit.tile_layer = value;
    }


    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'osm_search_json':
                    if (data.status) {
                        this.props.onAddLeafletPin(data.record, data.id)
                        this.setState({
                            showColSearch: false,
                            search: {
                                zip: '',
                                city: '',
                                street: '',
                                hnr: ''
                            }
                        })
                        AppTools.success_message(data.msg)
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
            }
        }).catch(
            (error) => {
                if (error.code === 'rest_permission_error' || error.code === 'rest_failed') {
                    this.setState({
                        showApiError: true,
                        apiErrorMsg: error.message
                    })
                    console.log(error.message);
                }
            }
        );
    }

    render() {
        return (
            <Fragment>
                <div className="d-flex flex-wrap">
                    <Button
                        onClick={() => this.props.onSetCollapse('start', true)}
                        type="button"
                        size="sm"
                        variant="outline-primary">
                        <i className="bi bi-reply-all me-2"></i>
                        zurück
                    </Button>
                    <div className="ms-auto">
                        <Button
                            onClick={() => this.setState({showTilesLayer: !this.state.showTilesLayer})}
                            type="button"
                            size="sm"
                            variant={`outline-primary ${this.state.showTilesLayer && 'active'}`}>
                            Tiles Layer
                        </Button>
                    </div>
                </div>
                <hr/>
                <Collapse
                    in={this.state.showTilesLayer}>
                    <div id={uuidv4()}>
                        <Gallery
                            images={this.props.osm_tile_layers}
                            activeId={this.props.edit.tile_layer}
                            callback={this.onCallbackLightBox}
                        />
                        <hr/>
                    </div>
                </Collapse>

                <div className="fs-5 pb-2 mb-2"><i className="bi bi-pin me-2"></i>Karten Pins</div>

                {this.props.edit.pins && this.props.edit.pins.length ?
                    <Accordion>
                        {this.props.edit.pins.map((p, i) => {
                            return (
                                <Accordion.Item key={i} eventKey={p.id}>
                                    <Accordion.Header className="position-relative mb-0">
                                        <div className="d-flex align-items-center text-truncate">
                                            <div className="text-truncate ps-1 me-2">
                                                {p.geo_json.display_name || ''}
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Row className="g-2">
                                            <Col xs={12}>
                                                <FloatingLabel
                                                    controlId={uuidv4()}
                                                    label={`Pin Textbox`}
                                                >
                                                    <Form.Control
                                                        required={false}
                                                        value={p.textbox || ''}
                                                        onChange={(e) => this.props.onSetPinEdit(e.target.value, 'textbox', p.id, this.props.edit.id)}
                                                        className="no-blur"
                                                        as="textarea"
                                                        style={{height: '100px'}}
                                                        placeholder="Pin Textbox"/>
                                                </FloatingLabel>
                                                <div className="form-text">
                                                    HTML kann verwendet werden
                                                </div>
                                            </Col>

                                            <Col xs={12}>
                                                <div className="d-flex flex-wrap">
                                                    <Form.Check
                                                        type="switch"
                                                        className="no-blur my-1 me-4"
                                                        id={uuidv4()}
                                                        checked={p.active || false}
                                                        onChange={(e) => this.props.onSetPinEdit(e.target.checked, 'active', p.id, this.props.edit.id)}
                                                        label="aktiv"
                                                    />
                                                    <Form.Check
                                                        type="switch"
                                                        className="no-blur my-1 me-4"
                                                        id={uuidv4()}
                                                        checked={p.show_pin || false}
                                                        onChange={(e) => this.props.onSetPinEdit(e.target.checked, 'show_pin', p.id, this.props.edit.id)}
                                                        label="Pin anzeigen"
                                                    />
                                                    <Form.Check
                                                        type="switch"
                                                        className="no-blur my-1 me-4"
                                                        id={uuidv4()}
                                                        checked={p.polygone_show || false}
                                                        onChange={(e) => this.props.onSetPinEdit(e.target.checked, 'polygone_show', p.id, this.props.edit.id)}
                                                        label="Benutzerdefiniertes Polygon"
                                                    />
                                                </div>

                                                <Collapse
                                                    in={p.polygone_show}>
                                                    <div id={uuidv4()}>
                                                        <hr/>
                                                        <Row className="g-3">
                                                            <Col xs={12}>
                                                                <div className="d-flex flex-wrap">
                                                                    <div className="d-flex align-items-center me-4">
                                                                        <SimonColorPicker
                                                                            color={p.polygone_fill || ''}
                                                                            handle={'polygone_fill'}
                                                                            id={p.id}
                                                                            callback={this.onPickrCallback}
                                                                        />
                                                                        <div className="fw-semibold ms-2">
                                                                            Füllfarbe
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex align-items-center me-4">
                                                                        <SimonColorPicker
                                                                            color={p.polygone_border || ''}
                                                                            handle={'polygone_border'}
                                                                            id={p.id}
                                                                            callback={this.onPickrCallback}
                                                                        />
                                                                        <div className="fw-semibold ms-2">
                                                                            Rahmenfarbe
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} xs={12}>
                                                                <FormGroup className="mt-3" controlId={uuidv4()}>
                                                                    <Form.Label>
                                                                        <b className="fw-semibold">
                                                                            Polygon Border
                                                                            Breite</b> {`${p.polygone_border_width} (Px)`}
                                                                    </Form.Label>
                                                                    <Form.Range
                                                                        min={0.1}
                                                                        max={5}
                                                                        step={0.1}
                                                                        value={p.polygone_border_width}
                                                                        onChange={(e) => this.props.onSetPinEdit(e.target.value, 'polygone_border_width', p.id, this.props.edit.id)}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Collapse>
                                            </Col>
                                            <Col xs={12}>
                                                <hr/>
                                                <div className="d-flex flex-wrap">
                                                    <div className="d-flex align-items-center">
                                                        <SimonColorPicker
                                                            color={p.marker_color || ''}
                                                            handle={'marker_color'}
                                                            id={p.id}
                                                            callback={this.onPickrCallback}
                                                        />
                                                        <div className="fw-semibold ms-2">
                                                            Pin Farbe
                                                        </div>
                                                    </div>
                                                    <div className="ms-auto">
                                                        <Button
                                                            onClick={() => this.props.onDeleteLeafletPin(p.id, this.props.edit.id)}
                                                            type="button"
                                                            size="sm"
                                                            variant="danger">
                                                            <i className="bi bi-trash me-2"></i>
                                                            Pin löschen
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        })}

                    </Accordion>
                    :
                    <div className="text-danger mt-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        keine Standorte vorhanden
                    </div>
                }
                <hr/>
                <Button
                    onClick={this.onSetSearchCollapse}
                    type="button"
                    size="sm"
                    variant="success">
                    <i className="bi bi-node-plus me-2"></i>
                    Adresse hinzufügen
                </Button>

                <Collapse
                    in={this.state.showColSearch}>
                    <div id={uuidv4()}>
                        <Form onSubmit={this.handleSubmit}>
                            <Row className="g-2 mt-3">
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Postleitzahl"
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            required={false}
                                            type="text"
                                            autoComplete="new-password"
                                            data-1p-ignore
                                            value={this.state.search.zip || ''}
                                            onChange={(e) => this.onSetSearchAdresse(e.target.value, 'zip')}
                                            placeholder="Postleitzahl"/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Ort *"
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            required={true}
                                            type="text"
                                            autoComplete="new-password"
                                            data-1p-ignore
                                            value={this.state.search.city || ''}
                                            onChange={(e) => this.onSetSearchAdresse(e.target.value, 'city')}
                                            placeholder="Ort"/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Strasse"
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            required={false}
                                            type="text"
                                            autoComplete="new-password"
                                            data-1p-ignore
                                            value={this.state.search.street || ''}
                                            onChange={(e) => this.onSetSearchAdresse(e.target.value, 'street')}
                                            placeholder="Strasse"/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Hausnummer"
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            required={false}
                                            type="text"
                                            autoComplete="new-password"
                                            data-1p-ignore
                                            value={this.state.search.hnr || ''}
                                            onChange={(e) => this.onSetSearchAdresse(e.target.value, 'hnr')}
                                            placeholder="Hausnummer"/>
                                    </FloatingLabel>
                                </Col>

                                <Col xs={12}>
                                    <Button
                                        type="submit"
                                        variant="primary mt-2">
                                        <i className="bi bi-pin-map  me-2"></i>
                                        Adresse suchen
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Collapse>

            </Fragment>
        )
    }
}