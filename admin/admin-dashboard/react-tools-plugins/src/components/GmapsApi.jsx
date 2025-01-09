import {
    Card,
    CardBody,
    ButtonGroup,
    Form,
    Button,
    FormGroup,
    Col,
    Row,
    Nav,
    Collapse,
    FloatingLabel
} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../utils/AppTools.js";
import * as mediaTools from "../utils/wpMedia.js";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class GmapsApi extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            colStart: true,
            colPins: false,
        }

        this.setCollapse = this.setCollapse.bind(this);
        this.onGetWpMedia = this.onGetWpMedia.bind(this);
        this.getMediaAttachment = this.getMediaAttachment.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.onGetWpBdMedia = this.onGetWpBdMedia.bind(this);
        this.getMediaBdAttachment = this.getMediaBdAttachment.bind(this);
        this.deleteBdImage = this.deleteBdImage.bind(this);
        this.addMapPin = this.addMapPin.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
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

    onGetWpBdMedia(title, btn, id, url) {
        mediaTools.openMediaFrame(title, btn, id, url, this.getMediaBdAttachment)
    }

    getMediaBdAttachment(attachment, id, url) {
        this.props.onSetGmapsPins(attachment.url, 'custom_pin_url', id)
        this.props.onSetGmapsPins(attachment.id, 'custom_pin_img', id)
    }

    deleteBdImage(id) {
        this.props.onSetGmapsPins(0, 'custom_pin_img', id)
        this.props.onSetGmapsPins('', 'custom_pin_url', id)
    }

    onGetWpMedia(title, btn, type_key, url_key) {
        mediaTools.openMediaFrame(title, btn, type_key, url_key, this.getMediaAttachment)
    }

    getMediaAttachment(attachment, type_key, url_key) {
        if (attachment) {
            this.props.onSetGMapsApi(attachment.url, url_key)
            this.props.onSetGMapsApi(attachment.id, type_key)
        }
    }

    deleteImage(type, url) {
        this.props.onSetGMapsApi(0, type)
        this.props.onSetGMapsApi('', url)
    }

    setCollapse(target, reset = false) {
        let start = false;
        let pins = false;
        switch (target) {
            case 'start':
                start = true;
                break;
            case 'pins':
                pins = true;
                break;
        }

        this.setState({
            colStart: start,
            colPins: pins
        })
    }

    addMapPin() {
        let formData = {
            'method': 'gmaps_add_api_pin'
        }
        this.props.sendFetchApi(formData)

    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'gmaps_api_handle',
            'data': JSON.stringify(this.props.settings.google_maps_api)
        }
        this.props.sendFetchApi(formData)

    }

    render() {
        return (
            <Fragment>
                {this.props.settings.google_maps_api &&
                    <Fragment>
                        <Form onSubmit={this.handleSubmit}>
                            <Card className="shadow-sm my-2">
                                <CardBody>
                                    <h6>
                                        <i className="bi bi-arrow-right-short me-1"></i>
                                        Google Maps API
                                    </h6>
                                    <hr/>
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="API Key *"
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={true}
                                                    type="text"
                                                    value={this.props.settings.google_maps_api.map_apikey || ''}
                                                    onChange={(e) => this.props.onSetGMapsApi(e.target.value, 'map_apikey')}
                                                    placeholder="API Key *"/>
                                            </FloatingLabel>
                                        </Col>
                                        {/*}<Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`Datenschutz`}
                                            >
                                                <Form.Select
                                                    className="no-blur mw-100"
                                                    required={false}
                                                    value={this.props.settings.google_maps_api.map_datenschutz || ''}
                                                    onChange={(e) => this.props.onSetGMapsApi(e.target.value, 'map_datenschutz')}
                                                    aria-label={`Datenschutz`}>
                                                    <option value="">auswählen...</option>
                                                    {this.props.settings.google_maps_datenschutz.map((select, index) =>
                                                        <option key={index}
                                                                value={select.id}>
                                                            {select.ds_bezeichnung}
                                                        </option>
                                                    )}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>{*/}
                                        <Col xs={12}>
                                            <div
                                                className="d-flex flex-column align-items-center justify-content-center">
                                                <div className="fw-semibold mb-3">Standard Pin</div>
                                                {this.props.settings.google_maps_api.map_standard_url ?
                                                    <img className="img-fluid" alt="Platzhalter Pin"
                                                         style={{
                                                             width: '25px',
                                                             height: '35px',
                                                             objectFit: 'contain'
                                                         }}
                                                         src={this.props.settings.google_maps_api.map_standard_url}/>
                                                    :
                                                    <img className="img-fluid" alt="Standard Pin"
                                                         style={{
                                                             width: '25px',
                                                             height: '35px',
                                                             objectFit: 'contain'
                                                         }}
                                                         src={`${hummeltRestObj.theme_admin_url}assets/images/map-pin.png`}/>
                                                }
                                                <div className="my-3">
                                                    {this.props.settings.google_maps_api.map_standard_url ?
                                                        <Button
                                                            type="button"
                                                            onClick={() => this.deleteImage('map_standard_pin', 'map_standard_url')}
                                                            size="sm"
                                                            variant="danger">
                                                            <i className="bi bi-trash me-2"></i>
                                                            Pin löschen
                                                        </Button>
                                                        :
                                                        <Button
                                                            type="button"
                                                            onClick={() => this.onGetWpMedia('Map Pin', 'Pin auswählen', 'map_standard_pin', 'map_standard_url')}
                                                            size="sm"
                                                            variant="outline-secondary">
                                                            <i className="bi bi-card-image me-2"></i>
                                                            zur Bildauswahl hier klicken
                                                        </Button>
                                                    }
                                                </div>
                                            </div>
                                            <hr className="mb-1"/>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur my-1 me-4"
                                                id={uuidv4()}
                                                checked={this.props.settings.google_maps_api.map_color_schema_check || false}
                                                onChange={(e) => this.props.onSetGMapsApi(e.target.checked, 'map_color_schema_check')}
                                                label="benutzerdefiniertes Farbschema"
                                            />
                                        </Col>
                                        <Col xs={12}>
                                            <Collapse
                                                in={this.props.settings.google_maps_api.map_color_schema_check || false}>
                                                <div id={uuidv4()}>
                                                    <h6>Map Farbschema</h6>
                                                    <div className="form-floating">
                                                        <p className="small">JavaScript Style Array</p>
                                                        <textarea
                                                            className="form-control"
                                                            aria-label="map-color"
                                                            id={uuidv4()}
                                                            value={this.props.settings.google_maps_api.map_color_schema || ''}
                                                            onChange={(e) => this.props.onSetGMapsApi(e.target.value, 'map_color_schema')}
                                                            style={{
                                                                height: '400px',
                                                                fontFamily: 'monospace',
                                                                fontSize: '14px',
                                                                whiteSpace: 'pre'
                                                            }}>
                                                            </textarea>
                                                    </div>
                                                </div>
                                            </Collapse>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className="shadow-sm my-2">
                                <CardBody>
                                    <h6>
                                        <i className="bi bi-arrow-right-short me-1"></i>
                                        Google Maps Pins
                                    </h6>
                                    <hr/>
                                    {this.props.settings.google_maps_api && this.props.settings.google_maps_api.map_pins &&
                                        <Fragment>
                                            {this.props.settings.google_maps_api.map_pins.map((p, i) => {
                                                return (
                                                    <Card key={i} className="mb-3">
                                                        <CardBody>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="fs-5 mb-3">
                                                                    <i className="bi bi-geo-alt me-2"></i>
                                                                    Pin: {i + 1}
                                                                </div>
                                                                <div className="ms-auto ">
                                                                    {p.delete ?
                                                                        <Button
                                                                            type="button"
                                                                            onClick={() => this.props.onDeleteGmapsPin(p.id)}
                                                                            size="sm"
                                                                            variant="link text-danger text-decoration-none">
                                                                            <i className="bi bi-trash"></i>
                                                                        </Button>
                                                                        : ''}
                                                                </div>
                                                            </div>
                                                            <Row className="g-3">
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv4()}
                                                                        label="Koordinaten *"
                                                                    >
                                                                        <Form.Control
                                                                            className={`no-blur`}
                                                                            required={true}
                                                                            type="text"
                                                                            value={p.coords || ''}
                                                                            onChange={(e) => this.props.onSetGmapsPins(e.target.value, 'coords', p.id)}
                                                                            placeholder="Koordinaten *"/>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv4()}
                                                                        label="Infotext"
                                                                    >
                                                                        <Form.Control
                                                                            className={`no-blur`}
                                                                            required={false}
                                                                            type="text"
                                                                            value={p.info_text || ''}
                                                                            onChange={(e) => this.props.onSetGmapsPins(e.target.value, 'info_text', p.id)}
                                                                            placeholder="Infotext"/>
                                                                    </FloatingLabel>
                                                                    <div className="form-text">
                                                                        Dieser Text erscheint beim klick auf den
                                                                        Pin
                                                                    </div>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        className="no-blur my-1 me-4"
                                                                        id={uuidv4()}
                                                                        checked={p.custom_pin_check || false}
                                                                        onChange={(e) => this.props.onSetGmapsPins(e.target.checked, 'custom_pin_check', p.id)}
                                                                        label="Custom Pin"
                                                                    />
                                                                </Col>
                                                                <Collapse
                                                                    in={p.custom_pin_check || false}>
                                                                    <div id={uuidv4()}>
                                                                        <Col xs={12}>
                                                                            <div
                                                                                className="d-flex flex-column align-items-center justify-content-center">
                                                                                <div
                                                                                    className="fw-semibold mb-3">Benutzerdefinierter
                                                                                    Pin
                                                                                </div>
                                                                                {p.custom_pin_url ?
                                                                                    <img className="img-fluid"
                                                                                         alt="Benutzerdefinierter Pin"
                                                                                         style={{
                                                                                             width: '25px',
                                                                                             height: '35px',
                                                                                             objectFit: 'contain'
                                                                                         }}
                                                                                         src={p.custom_pin_url}/>
                                                                                    :
                                                                                    <img className="img-fluid"
                                                                                         alt="Benutzerdefinierter Pin"
                                                                                         style={{
                                                                                             width: '25px',
                                                                                             height: '35px',
                                                                                             objectFit: 'contain'
                                                                                         }}
                                                                                         src={`${hummeltRestObj.theme_admin_url}assets/images/map-pin.png`}/>
                                                                                }
                                                                                <div className="my-3">
                                                                                    {p.custom_pin_url ?
                                                                                        <Button
                                                                                            type="button"
                                                                                            onClick={() => this.deleteBdImage(p.id)}
                                                                                            size="sm"
                                                                                            variant="danger">
                                                                                            <i className="bi bi-trash me-2"></i>
                                                                                            Pin löschen
                                                                                        </Button>
                                                                                        :
                                                                                        <Button
                                                                                            type="button"
                                                                                            onClick={() => this.onGetWpBdMedia('Map Pin', 'Pin auswählen', p.id, 'custom_pin_url')}
                                                                                            size="sm"
                                                                                            variant="outline-secondary">
                                                                                            <i className="bi bi-card-image me-2"></i>
                                                                                            zur Bildauswahl hier
                                                                                            klicken
                                                                                        </Button>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <hr className="mb-1"/>
                                                                        </Col>
                                                                    </div>
                                                                </Collapse>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                )
                                            })}
                                            <Button
                                                type="button"
                                                onClick={this.addMapPin}
                                                size="sm"
                                                variant="outline-secondary">
                                                <i className="bi bi-node-plus me-2"></i>
                                                Pin hinzufügen
                                            </Button>
                                        </Fragment>}
                                </CardBody>
                            </Card>
                            <hr/>
                            <Button
                                type="submit"
                                variant="primary">
                                Speichern
                            </Button>
                        </Form>
                    </Fragment>
                }
            </Fragment>
        )
    }
}