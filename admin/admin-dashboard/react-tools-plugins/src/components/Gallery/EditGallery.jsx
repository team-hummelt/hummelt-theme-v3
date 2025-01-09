import {Card, CardBody, Form, Row, Accordion, Col, Container, FloatingLabel, Button, Nav, Collapse, CardHeader} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../../utils/AppTools.js";
import AddSliderGalleryModal from "../../utils/AddSliderGalleryModal.jsx";
import SetAjaxResponse from "../../utils/SetAjaxResponse.jsx";

const {Component, Fragment} = wp.element;

const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class EditGallery extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            animation: ''
        }
        this.onSetAnimation = this.onSetAnimation.bind(this);
    }

    onSetAnimation(e, type) {
        this.setState({animation: e})
        this.props.onSetSliderGallery(e, type)
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
                    </CardHeader>
                    <CardBody>
                        <Col xxl={10} xs={12} className="mx-auto">
                            <Card>
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
                                                label='Bezeichnung'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={true}
                                                    type="text"
                                                    value={this.props.edit.designation || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'designation')}
                                                    placeholder='Bezeichnung'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='Beschreibung'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    as="textarea"
                                                    value={this.props.edit.description || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'description')}
                                                    style={{height: '100px'}}
                                                    placeholder='Beschreibung'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel controlId={uuidv4()}
                                                           label='Galerie-Typ'>
                                                <Form.Select
                                                    className="no-blur"
                                                    value={this.props.edit.galleryType || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'galleryType')}
                                                    aria-label='Galerie-Typ'>
                                                    <option value="gallery">Galerie Grid</option>
                                                    <option value="masonry">Masonry Grid</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        {this.props.mediaSizeSelects.length ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel controlId={uuidv4()}
                                                               label='Bildgröße'>
                                                    <Form.Select
                                                        className="no-blur"
                                                        value={this.props.edit.size || ''}
                                                        onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'size')}
                                                        aria-label='Bildgröße'>
                                                        {this.props.mediaSizeSelects.map((select, index) =>
                                                            <option key={index} value={select.value}>
                                                                {select.label}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col> : ''}

                                        <Col xs={12}>
                                            <div className="d-flex align-items-center flex-wrap">
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur me-4 my-2"
                                                    checked={this.props.edit.crop || false}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'crop')}
                                                    id={uuidv4()}
                                                    label='Image Crop'
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur me-4 my-2"
                                                    disabled={true}
                                                    checked={this.props.edit.lazy_load || false}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'lazy_load')}
                                                    id={uuidv4()}
                                                    label='Lazy Load'
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    className="no-blur me-4 my-2"
                                                    checked={this.props.edit.lazy_load_animation || false}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'lazy_load_animation')}
                                                    id={uuidv4()}
                                                    label='Lazy Load Animation'
                                                />
                                                {this.props.edit.lazy_load_animation ?
                                                    <Form.Check
                                                        type="switch"
                                                        className="no-blur my-2"
                                                        checked={this.props.edit.animation_repeat || false}
                                                        onChange={(e) => this.props.onSetSliderGallery(e.target.checked, 'animation_repeat')}
                                                        id={uuidv4()}
                                                        label='Repeat animation'
                                                    />: ''}
                                            </div>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`Image width px`}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    disabled={this.props.edit.galleryType === 'masonry'}
                                                    type="number"
                                                    value={this.props.edit.width || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'width')}
                                                    placeholder='Image width'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`Image height px`}
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    disabled={this.props.edit.crop || this.props.edit.galleryType === 'masonry'}
                                                    type="number"
                                                    value={this.props.edit.height || ''}
                                                    onChange={(e) => this.props.onSetSliderGallery(e.target.value, 'height')}
                                                    placeholder='Image height'/>
                                            </FloatingLabel>
                                        </Col>

                                        {this.props.animateSelects.length ?
                                            <Col xl={6} xs={12}>
                                                <FloatingLabel controlId={uuidv4()}
                                                               label='Animation'>
                                                    <Form.Select
                                                        className="no-blur"
                                                        disabled={!this.props.edit.lazy_load_animation}
                                                        value={this.props.edit.animation || ''}
                                                        onChange={(e) => this.onSetAnimation(e.target.value, 'animation')}
                                                        aria-label='Animation'>
                                                        <option value="">auswählen...</option>
                                                        {this.props.animateSelects.map((s, index) =>
                                                            <option
                                                                disabled={s.divider && s.divider === true}
                                                                key={index} value={s.animate}>{s.animate}
                                                            </option>
                                                        )}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col> : ''}

                                        <Col xl={6} xs={12}>
                                            {this.props.edit.lazy_load_animation ?
                                                <div className="d-flex align-items-center h-100 justify-content-center">
                                                    <b className={`d-block fw-semibold animate__animated animate__${this.state.animation}`}>
                                                        Animation
                                                    </b>
                                                </div> : ''}
                                        </Col>

                                        <Col xs={12}>
                                            <h6 className="lh-1 mb-1 mt-3">Breakpoints ( Responsive )</h6>
                                            <div className="form-text mb-0">
                                                Eigenschaften, die in einer bestimmten Bildschirmbreite geändert werden sollen.
                                            </div>
                                        </Col>
                                        {this.props.edit && this.props.edit.breakpoints ?
                                            <Fragment>
                                                <Col xs={12}>
                                                    <h6 className="mb-0 mt-2">Breakpoint XXL
                                                        1400px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Row column`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.xxl.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'columns', 'xxl')}
                                                            placeholder='Row column'/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Gutter`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            min={1}
                                                            max={5}
                                                            type="number"
                                                            value={this.props.edit.breakpoints.xxl.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'gutter', 'xxl')}
                                                            placeholder='Gutter'/>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12}>
                                                    <h6 className="mb-0">Breakpoint XL
                                                        1200px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Row column`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.xl.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'columns', 'xl')}
                                                            placeholder='Row column'/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Gutter`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.xl.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'gutter', 'xl')}
                                                            placeholder='Gutter'/>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12}>
                                                    <h6 className="mb-0">Breakpoint LG
                                                        992px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Row column`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.lg.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'columns', 'lg')}
                                                            placeholder='Row column'/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Gutter`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.lg.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'gutter', 'lg')}
                                                            placeholder='Gutter'/>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12}>
                                                    <h6 className="mb-0">Breakpoint MD
                                                        768px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Row column`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.md.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'columns', 'md')}
                                                            placeholder='Row column'/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Gutter`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.md.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'gutter', 'md')}
                                                            placeholder='Gutter'/>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12}>
                                                    <h6 className="mb-0">Breakpoint SM
                                                        576px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Row column`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.sm.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'columns', 'sm')}
                                                            placeholder='Row column'/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Gutter`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.sm.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'gutter', 'sm')}
                                                            placeholder='Gutter'/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12}>
                                                    <h6 className="mb-0">Breakpoint XS
                                                        450px</h6>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Row column`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={6}
                                                            value={this.props.edit.breakpoints.xs.columns || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'columns', 'xs')}
                                                            placeholder='Row column'/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} xl={6}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label={`Gutter`}
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            required={false}
                                                            type="number"
                                                            min={1}
                                                            max={5}
                                                            value={this.props.edit.breakpoints.xs.gutter || ''}
                                                            onChange={(e) => this.props.onSetBreakpoint(parseInt(e.target.value), 'gutter', 'xs')}
                                                            placeholder='Gutter'/>
                                                    </FloatingLabel>
                                                </Col>
                                            </Fragment>
                                            : ''}
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }

}