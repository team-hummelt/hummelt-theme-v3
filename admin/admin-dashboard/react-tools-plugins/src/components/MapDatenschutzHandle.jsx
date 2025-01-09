import {Card, CardBody, Form, Button, FormGroup, Col, Row, Nav, Collapse, FloatingLabel} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as mediaTools from "../utils/wpMedia.js";
import * as AppTools from "../utils/AppTools.js";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class MapDatenschutzHandle extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {

        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onGetWpMedia = this.onGetWpMedia.bind(this);
        this.getMediaAttachment = this.getMediaAttachment.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    onGetWpMedia(title, btn, type_key, url_key) {
        mediaTools.openMediaFrame(title, btn, type_key, url_key, this.getMediaAttachment)
    }

    getMediaAttachment(attachment, type_key, url_key) {
        if (attachment) {
            this.props.onSetEditValue(attachment.url, url_key)
            this.props.onSetEditValue(attachment.id, type_key)
        }
    }

    deleteImage(type, url) {
        this.props.onSetEditValue(0, type)
        this.props.onSetEditValue('', url)
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'maps_ds_handle',
            'handle': this.props.edit.id ? 'update' : 'insert',
            'data': JSON.stringify(this.props.edit)
        }
        this.props.sendFetchApi(formData)

    }

    render() {
        return (
            <Fragment>
                <Button
                    onClick={() => this.props.setCollapse('start', true)}
                    size="sm"
                    variant="outline-primary">
                    <i className="bi bi-reply-all me-2"></i>
                    zurück
                </Button>
                <hr/>
                <h6>{this.props.edit.id ? 'Einstellungen bearbeiten' : 'Datenschutz hinzufügen'}</h6>
                <hr/>
                <Form onSubmit={this.handleSubmit}>
                    <Row className="g-3">
                        <Col xl={6} xs={12}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label="Bezeichnung *"
                            >
                                <Form.Control
                                    className={`no-blur`}
                                    required={true}
                                    type="text"
                                    value={this.props.edit.ds_bezeichnung || ''}
                                     onChange={(e) => this.props.onSetEditValue(e.target.value, 'ds_bezeichnung')}
                                    placeholder="Bezeichnung *"/>
                            </FloatingLabel>
                        </Col>
                        <Col xl={6} xs={12}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label={`Datenschutz Seite *`}
                            >
                                <Form.Select
                                    className="no-blur mw-100"
                                    required={true}
                                    value={this.props.edit.map_ds_page || 0}
                                    onChange={(e) => this.props.onSetEditValue(e.target.value, 'map_ds_page')}
                                    aria-label={`Datenschutz Seite`}>
                                    <option value="">auswählen...</option>
                                    {this.props.pages.map((select, index) =>
                                        <option key={index}
                                                value={select.id}>
                                            {select.title}
                                        </option>
                                    )}
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12}>
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <div className="fw-semibold mb-3">Platzhalter Karte</div>
                                {this.props.edit.map_img_url  ?
                                    <img className="img-fluid" alt="Platzhalter Datenschutz"
                                         style={{width: '350px',height: '200px',objectFit: 'cover'}}
                                         src={this.props.edit.map_img_url}/>
                                    :
                                    <img className="img-fluid" alt="Platzhalter Datenschutz"  style={{width: '350px',height: '200px',objectFit: 'cover'}}
                                         src={`${hummeltRestObj.theme_admin_url}assets/images/blind-karte.svg`}/>
                                }
                                <div className="my-3">
                                    {this.props.edit.map_img_url ?
                                        <Button
                                            onClick={() => this.deleteImage('map_img_id', 'map_img_url')}
                                            size="sm"
                                            variant="danger">
                                            <i className="bi bi-trash me-2"></i>
                                            Bild löschen
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => this.onGetWpMedia('Platzhalter Datenschutz', 'Platzhalter auswählen', 'map_img_id', 'map_img_url')}
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
                                checked={this.props.edit.map_bg_grayscale || false}
                                onChange={(e) => this.props.onSetEditValue(e.target.checked, 'map_bg_grayscale')}
                                label="Karte grayscale"
                            />
                        </Col>
                        <Col xl={6} xs={12}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label="Button Text *"
                            >
                                <Form.Control
                                    className={`no-blur`}
                                    required={true}
                                    type="text"
                                    value={this.props.edit.map_ds_btn_text || ''}
                                    onChange={(e) => this.props.onSetEditValue(e.target.value, 'map_ds_btn_text')}
                                    placeholder="Button Text *"/>
                            </FloatingLabel>
                        </Col>
                        <Col xl={6} xs={12}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label="Button CSS"
                            >
                                <Form.Control
                                    className={`no-blur`}
                                    required={false}
                                    type="text"
                                    value={this.props.edit.button_css || ''}
                                    onChange={(e) => this.props.onSetEditValue(e.target.value, 'button_css')}
                                    placeholder="Button CSS"/>
                            </FloatingLabel>
                        </Col>
                        <Col xs={12}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label="Datenschutz akzeptieren Text *"
                            >
                                <Form.Control
                                    className={`no-blur`}
                                    required={true}
                                    as="textarea"
                                    style={{height: '100px'}}
                                    value={this.props.edit.map_ds_text || ''}
                                    onChange={(e) => this.props.onSetEditValue(e.target.value, 'map_ds_text')}
                                    placeholder="Datenschutz akzeptieren Text *"/>
                            </FloatingLabel>
                            <div className="form-text">
                                Für den Datenschutz-Link kann als Platzhalter <code> ###LINK###</code> verwendet werden. Wird kein Platzhalter eingefügt, wird der Link nach dem Text eingefügt.
                            </div>
                        </Col>
                        <hr className="mb-0"/>
                        <Col xs={12}>
                            <Button
                                type="submit"
                                variant="primary">
                                <i className="bi bi-save2 me-2"></i>
                                {this.props.edit.id ? 'Änderungen speichern' : 'Datenschutz hinzufügen'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        )
    }
}