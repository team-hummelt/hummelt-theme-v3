import {Card, CardBody, Row, Col, Container, Nav, Collapse, Button, Form, FloatingLabel} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../../../utils/AppTools";
const {Component, Fragment} = wp.element;
import SimonColorPicker from "../../../utils/SimonColorPicker.jsx";
import AddColorModal from "../../../utils/AddColorModal.jsx";

const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Gutenberg extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            handle: '',
            bezeichnung: '',
            slug: '',
            color: ''
        }
        this.onPickrCallback = this.onPickrCallback.bind(this);
        this.onColorHandle = this.onColorHandle.bind(this);
        this.onSendColorHandle = this.onSendColorHandle.bind(this);
        this.onSetColorHandle = this.onSetColorHandle.bind(this);
        this.onResetGutenbergSettings = this.onResetGutenbergSettings.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
    }

    findArrayElementById(array, id, type) {
        return array.find((element) => {
            return element[type] === id;
        })
    }

    onPickrCallback(color, handle) {
        this.props.onUpdateEditorColor(color, handle)
    }

    onColorHandle(handle, bezeichnung = '', slug = '', color = '') {
        this.setState({
            handle: handle,
            bezeichnung: bezeichnung,
            slug: slug,
            color: color
        })
        this.props.onSetShowModal(true);
    }

    onSetColorHandle(e) {
        this.setState({
            bezeichnung: e
        })
    }

    onSendColorHandle() {
        let formData = {
            'method': 'gutenberg_color_handle',
            'handle': this.state.handle,
            'slug': this.state.slug,
            'bezeichnung': this.state.bezeichnung,
            'color': this.state.color
        }
        this.props.sendFetchApi(formData)
    }

    onResetGutenbergSettings() {
        let swal = {
            'title': 'Einstellungen zurücksetzen?',
            'btn': 'Einstellungen zurücksetzen',
            'msg': 'Alle gespeicherten Einstellungen werden zurückgesetzt!'
        };
        AppTools.swal_delete_modal(swal).then((result) => {
            if(result) {
                let formData = {
                    'method': 'reset_gutenberg_settings'
                }
                this.props.sendFetchApi(formData)
            }
        })
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_wp_optionen && this.props.settings.theme_wp_optionen.gutenberg_active ?
                    <Fragment>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <div className="d-flex flex-wrap">
                                    <h6>
                                        <i className="bi bi-arrow-right-short mx-1"></i>
                                        Gutenberg Editor Layout
                                    </h6>
                                </div>
                                <hr/>
                                <Row className="g-2">
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="content Size"
                                        >
                                            <Form.Control
                                                className={`no-blur`}
                                                type="text"
                                                value={this.props.editor.layout.contentSize || ''}
                                                onChange={(e) => this.props.onUpdateEditorLayout(e.target.value, 'contentSize')}
                                                placeholder="content Size"/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xl={6} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="wide Size"
                                        >
                                            <Form.Control
                                                className={`no-blur`}
                                                type="text"
                                                value={this.props.editor.layout.wideSize || ''}
                                                onChange={(e) => this.props.onUpdateEditorLayout(e.target.value, 'wideSize')}
                                                placeholder="wide Size"/>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short mx-1"></i>
                                    Theme Farben
                                </h6>
                                <hr/>
                                <Button
                                    onClick={() => this.onColorHandle('insert')}
                                    size="sm"
                                    variant="outline-primary">
                                    <i className="bi bi-node-plus me-2"></i>
                                    Farbe hinzufügen
                                </Button>
                                <hr/>
                                {this.props.editor ?
                                    <Row className="g-3">
                                        {this.props.editor.palette.map((f, i) => {
                                            return (
                                                <Col xxl={3} xl={4} lg={5} md={6} xs={12} key={i}>
                                                    <div className="h-100 p-3 border rounded">
                                                        <div className="d-flex align-items-center">
                                                            <SimonColorPicker
                                                                color={f.color}
                                                                handle={f.slug}
                                                                callback={this.onPickrCallback}
                                                            />
                                                            <div className="fw-semibold ms-2">
                                                                Farbe <span className="fw-light">{f.name}</span>
                                                            </div>
                                                        </div>
                                                        <hr className="mt-3 mb-2"/>
                                                        <small className="d-block"><b>Slug: </b>{f.slug}</small>
                                                        <hr className="mt-2"/>
                                                        <div className="d-flex flex-wrap">
                                                            <small
                                                                onClick={() => this.onColorHandle('update', f.name, f.slug, f.color)}
                                                                className="text-primary cursor-pointer">
                                                                bearbeiten
                                                            </small>
                                                            <div className="ms-auto">
                                                                <small
                                                                    onClick={() => this.props.onDeleteEditorColor(f.slug)}
                                                                    className="text-danger  cursor-pointer">
                                                                    löschen
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                    :
                                    <div className="fw-semibold">
                                        keine Farben vorhanden
                                    </div>
                                }
                            </CardBody>
                        </Card>
                        <Button
                            onClick={this.onResetGutenbergSettings}
                            size="sm"
                            variant="outline-primary">
                           alle Einstellungen zurücksetzen
                        </Button>
                    </Fragment>
                    :
                    <div className="fs-5 text-danger mt-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Gutenberg-Editor ist deaktiviert!
                    </div>
                }
                <AddColorModal
                    showColorModal={this.props.showColorModal}
                    onSetShowModal={this.props.onSetShowModal}
                    onSetColorHandle={this.onSetColorHandle}
                    onSendColorHandle={this.onSendColorHandle}
                    handle={this.state.handle}
                    bezeichnung={this.state.bezeichnung}
                    slug={this.state.slug}
                />
            </Fragment>
        )
    }
}