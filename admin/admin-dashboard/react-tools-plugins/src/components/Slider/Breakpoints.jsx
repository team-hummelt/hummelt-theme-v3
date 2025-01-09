import {Card, CardBody, Form, Row, Accordion, Col, FloatingLabel, Container, Button, Nav, Collapse, CardHeader} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../../utils/AppTools.js";
import AddSliderGalleryModal from "../../utils/AddSliderGalleryModal.jsx";
import SetAjaxResponse from "../../utils/SetAjaxResponse.jsx";
import {ReactSortable} from "react-sortablejs";
const {Component, Fragment} = wp.element;

const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class Breakpoints extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            sortableOptions: {
                animation: 300,
                // handle: ".arrow-sortable",
                ghostClass: 'sortable-ghost',
                //forceFallback: true,
                scroll: true,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5
            },
        }
        this.onDeleteBreakpoint = this.onDeleteBreakpoint.bind(this);
        this.onUpdateFormGroupPosition = this.onUpdateFormGroupPosition.bind(this);


    }

    onDeleteBreakpoint(breakpoint) {
        let swal = {
            'title': `Breakpoint löschen?`,
            'msg': 'Alle Daten werden gelöscht. Das Löschen kann nicht rückgängig gemacht werden.',
            'btn': "Breakpoint löschen"
        }

        let formData = {
            'method': 'delete_breakpoint',
            'id': this.props.id,
            'breakpoint': breakpoint
        }

        AppTools.swal_delete_modal(swal).then(result => {
            if(result) {
                this.props.sendFetchApi(formData)
            }
        })
    }

    onUpdateFormGroupPosition() {
        sleep(500).then(() => {
            this.props.onSetSliderGallery(this.props.breakpoint, 'breakpoints')
        })
    }
    render() {
        return(
            <Fragment>

                    <ReactSortable
                        className="row g-2"
                        list={this.props.breakpoint}
                        handle=".bi-arrows-move"
                        setList={(newState) => this.props.onSetSortableBreakpoint(newState)}
                        {...this.state.sortableOptions}
                        onEnd={this.onUpdateFormGroupPosition}
                    >
                    {this.props.breakpoint.map((b, index) => {
                        return (
                            <Col key={index} xxl={4} xl={4} lg={4} md={6} xs={12}>
                                <div className="d-flex flex-column bg-body-tertiary h-100 p-1 border rounded">
                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="p-2 mb-1">
                                            {this.props.breakpoint.length > 1 ?
                                            <i className="bi bi-arrows-move cursor-move me-2"></i>
                                                : ''}
                                            Breakpoint {b.breakpoint} px
                                        </div>
                                        <div className="ms-auto">

                                            <i onClick={() => this.onDeleteBreakpoint(b.id)}
                                               className="cursor-pointer bi bi-trash text-danger">
                                            </i>
                                        </div>
                                    </div>
                                    <Row className="g-2">
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='Breakpoint'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    min={1}
                                                    max={2200}
                                                    value={b.breakpoint || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'breakpoint', b.id)}
                                                    placeholder='Breakpoint'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='gap'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.gap || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'gap', b.id)}
                                                    placeholder='gap'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='perPage'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={b.perPage || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'perPage', b.id)}
                                                    placeholder='perPage'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='perMove'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="number"
                                                    value={b.perMove || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'perMove', b.id)}
                                                    placeholder='perMove'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='height'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.height || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'height', b.id)}
                                                    placeholder='height'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='width'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.width || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'width', b.id)}
                                                    placeholder='width'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='fixedHeight'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.fixedHeight || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'fixedHeight', b.id)}
                                                    placeholder='fixedHeight'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='fixedWidth'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.fixedWidth || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'fixedWidth', b.id)}
                                                    placeholder='fixedWidth'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} className="px-2 fw-semibold">
                                            Padding
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='left'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.padding.left || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'left', b.id, 'padding')}
                                                    placeholder='left'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='right'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.padding.right || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'right', b.id, 'padding')}
                                                    placeholder='right'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='top'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.padding.top || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'top', b.id, 'padding')}
                                                    placeholder='top'/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={6}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label='bottom'
                                            >
                                                <Form.Control
                                                    className={`no-blur`}
                                                    required={false}
                                                    type="text"
                                                    value={b.padding.bottom || ''}
                                                    onChange={(e) => this.props.onSetBreakpoint(e.target.value, 'bottom', b.id, 'padding')}
                                                    placeholder='bottom'/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        )
                    })}
                    </ReactSortable>

            </Fragment>
        )
    }
}