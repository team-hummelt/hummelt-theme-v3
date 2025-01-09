import {Card, CardBody, Form, Row, Accordion, Col, FloatingLabel, Container, Button, Nav, Collapse, CardHeader} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../../utils/AppTools.js";
import AddSliderGalleryModal from "../../utils/AddSliderGalleryModal.jsx";
import SetAjaxResponse from "../../utils/SetAjaxResponse.jsx";
import Breakpoints from "./Breakpoints.jsx";
const {Component, Fragment} = wp.element;

const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class SliderEdit extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.addBreakpoint = this.addBreakpoint.bind(this);

    }

    addBreakpoint() {
        let formData = {
            'method': 'add_breakpoint',
            'id': this.props.edit.id
        }
        this.props.sendFetchApi(formData)
    }

    render() {
        return (
            <Fragment>
                <Button onClick={() => this.props.onToggleSlider('start', true)}
                    variant="success"
                    size={'sm'}
                >
                    <i className="bi bi-reply-all me-2"></i>
                    zurück
                </Button>
                <hr/>
                <Card className="shadow-sm">
                    <CardHeader className="py-3 d-flex flex-wrap">
                        <div className="fs-5 fw-semibold">
                        {this.props.edit.designation} <span className="fw-light"> Einstellungen</span>
                        </div>
                        <div className="ms-auto">
                            <a className="text-reset" target="_blank" href="https://splidejs.com/guides/options/#options">
                                <i className="bi bi-lightbulb me-2"></i>
                                Hilfe
                            </a>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Col xs={12} className="mx-auto">
                            <div>
                                <CardBody>
                                    <div style={{minHeight: '2rem'}} className="d-flex flex-wrap">
                                            <div>Einstellungen</div>
                                        <div className="ms-auto">
                                            <div
                                                className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                            <small>
                                                <SetAjaxResponse
                                                    status={this.props.spinner.ajaxStatus}
                                                    msg={this.props.spinner.ajaxMsg}
                                                    color={true}
                                                />
                                            </small>
                                        </div>
                                    </div>

                                    <hr/>
                                    <Row className="g-2">
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="Bezeichnung"
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={true}
                                                    type="text"
                                                    value={this.props.edit.designation || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'designation')}
                                                    placeholder="Bezeichnung"/>
                                            </FloatingLabel>
                                            <hr className="mb-2"/>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.arrows || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'arrows')}
                                                id={uuidv4()}
                                                label="arrows"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.cover || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'cover')}
                                                id={uuidv4()}
                                                label="cover"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.keyboard || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'keyboard')}
                                                id={uuidv4()}
                                                label="keyboard"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.pauseOnFocus || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'pauseOnFocus')}
                                                id={uuidv4()}
                                                label="pauseOnFocus"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.drag || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'drag')}
                                                id={uuidv4()}
                                                label="drag"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.rewind || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'rewind')}
                                                id={uuidv4()}
                                                label="rewind"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.pauseOnHover || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'pauseOnHover')}
                                                id={uuidv4()}
                                                label="pauseOnHover"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.pagination || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'pagination')}
                                                id={uuidv4()}
                                                label="pagination"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.autoplay || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'autoplay')}
                                                id={uuidv4()}
                                                label="autoplay"
                                            />
                                        </Col>
                                        {/*} <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.container || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'container')}
                                                id={uuidv4()}
                                                label="container"
                                            />
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur"
                                                checked={this.props.edit.thumbnail || false}
                                                onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'thumbnail')}
                                                id={uuidv4()}
                                                label="thumbnail"
                                            />
                                        </Col>{*/}
                                    </Row>
                                    <hr/>
                                    <Row className="g-2">
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='type'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.type || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'type')}
                                                    placeholder='type'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='perPage'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.edit.perPage || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'perPage')}
                                                    placeholder='perPage'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='perMove'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.edit.perMove || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'perMove')}
                                                    placeholder='perMove'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='lazyLoad'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.lazyLoad || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'lazyLoad')}
                                                    placeholder='lazyLoad'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='gap'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.gap || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'gap')}
                                                    placeholder='gap'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='preloadPages'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.edit.preloadPages || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'preloadPages')}
                                                    placeholder='preloadPages'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='trimSpace'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.trimSpace || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'trimSpace')}
                                                    placeholder='trimSpace'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='interval'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.edit.interval || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'interval')}
                                                    placeholder='interval'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='speed'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.edit.speed || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'speed')}
                                                    placeholder='speed'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='rewindSpeed'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.edit.rewindSpeed || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'rewindSpeed')}
                                                    placeholder='rewindSpeed'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='flickPower'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={this.props.edit.flickPower || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'flickPower')}
                                                    placeholder='flickPower'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="height"
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.height || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'height')}
                                                    placeholder="height"/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="width"
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.width || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'width')}
                                                    placeholder="width"/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="fixedHeight"
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.fixedHeight || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'fixedHeight')}
                                                    placeholder="fixedHeight"/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={2} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="fixedWidth"
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.fixedWidth || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'fixedWidth')}
                                                    placeholder="fixedWidth"/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <div className="fw-semibold mb-2">Padding</div>
                                    <Row className="g-2">
                                        <Col xxl={3} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='left'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.padding ? this.props.edit.padding.left : ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'left', 'padding')}
                                                    placeholder='left'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={3} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='right'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.padding ? this.props.edit.padding.right : ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'right', 'padding')}
                                                    placeholder='right'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={3} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='top'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.padding ? this.props.edit.padding.top : ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'top', 'padding')}
                                                    placeholder='top'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xxl={3} xl={3} lg={4} md={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='bottom'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={this.props.edit.padding ? this.props.edit.padding.bottom : ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'bottom', 'padding')}
                                                    placeholder='bottom'/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <div style={{minHeight: '2rem'}} className="d-flex align-items-center flex-wrap">
                                        <div className="fw-semibold">Breakpoints</div>
                                        <div className="ms-auto">
                                            <div
                                                className={`ajax-spinner text-muted ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                            <small>
                                                <SetAjaxResponse
                                                    status={this.props.spinner.ajaxStatus}
                                                    msg={this.props.spinner.ajaxMsg}
                                                    color={true}
                                                />
                                            </small>
                                        </div>
                                    </div>
                                    <button
                                        onClick={this.addBreakpoint}
                                        type="button"
                                        className="btn btn-secondary dark mt-2 btn-sm">
                                        <i className="bi bi-node-plus me-1"></i>
                                        Breakpoint hinzufügen
                                    </button>
                                    <hr/>
                                    {this.props.edit.breakpoints && this.props.edit.breakpoints.length ?
                                        <Breakpoints
                                            id={this.props.edit.id}
                                            breakpoint={this.props.edit.breakpoints || []}
                                            onSetBreakpoint={this.props.onSetBreakpoint}
                                            sendFetchApi={this.props.sendFetchApi}
                                            onSetSliderGallery={this.props.onSetSliderGallery}
                                            onSetSortableBreakpoint={this.props.onSetSortableBreakpoint}
                                        />:
                                        <div className="text-danger">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            keine Breakpoints vorhanden
                                        </div>
                                    }
                                </CardBody>
                            </div>
                        </Col>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }

}