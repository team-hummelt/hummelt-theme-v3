import {Card, CardBody, Form, Button, FormGroup, Col, Row, Nav, Collapse, FloatingLabel} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {ReactSortable} from "react-sortablejs";
import * as AppTools from "../utils/AppTools.js";
import * as React from "react";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class TopArea extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            sortableOptions: {
                animation: 300,
                ghostClass: 'sortable-ghost',
                forceFallback: true,
                scroll: true,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5
            },
        }
    }

    render() {
        return (
            <Fragment>
                <Card className="shadow-sm my-2">
                    <CardBody>
                        <ReactSortable
                            list={this.props.topArea}
                            className="row g-3"
                            handle=".cursor-move"
                            setList={(newState) => this.props.onSetSortableTopArea(newState)}
                            {...this.state.sortableOptions}
                            onEnd={(e) => this.props.onUpdateSortableTopArea(e)}
                        >
                            {this.props.topArea.map((t, i) => {
                                return (
                                    <Col xs={12} xxl={3} xl={4} lg={6} key={i}>
                                        <div className="h-100 bg-light shadow p-3 d-flex position-relative flex-column border rounded">
                                            <i className="bi bi-arrows-move cursor-move position-absolute top-0 start-0 m-2"></i>
                                            <div className="text-center">
                                                    <div className="fs-5 fw-semibold">
                                                        {t.label}
                                                    </div>
                                                    <small className="d-block mt-2">
                                                        {t.sublabel}
                                                    </small>
                                                <hr/>
                                            </div>
                                            <Form.Check
                                                label='anzeigen'
                                                type="switch"
                                                className="no-blur me-4"
                                                checked={this.props.settings.theme_top_area && this.props.settings.theme_top_area[t.slug].active || false}
                                                onChange={(e) => this.props.onSetTopArea(e.currentTarget.checked, 'active', t.slug)}
                                                id={uuidv4()}
                                            />
                                            <hr/>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label={`Box CSS`}
                                            >
                                                <Form.Control
                                                    required={false}
                                                    disabled={this.props.settings.theme_top_area && !this.props.settings.theme_top_area[t.slug].active}
                                                    value={this.props.settings.theme_top_area && this.props.settings.theme_top_area[t.slug].css || ''}
                                                    onChange={(e) => this.props.onSetTopArea(e.currentTarget.value, 'css', t.slug)}
                                                    className="no-blur"
                                                    type="text"
                                                    placeholder='Box CSS'/>
                                            </FloatingLabel>
                                        </div>
                                    </Col>
                                )
                            })}
                        </ReactSortable>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}