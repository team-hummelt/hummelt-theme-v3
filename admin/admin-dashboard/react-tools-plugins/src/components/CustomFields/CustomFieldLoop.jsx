import * as React from "react";
import Accordion from 'react-bootstrap/Accordion';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import {Card, CardBody, CardHeader, ButtonGroup, Col, Row, FloatingLabel, Form} from "react-bootstrap";
import {ReactSortable} from "react-sortablejs";
import SetAjaxResponse from "../../utils/SetAjaxResponse.jsx";
import AppIcons from "./AppIcons.jsx";

export default class CustomFieldLoop extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            showModalIcons: false,
            editId: '',
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

        this.onSetShowModalIcons = this.onSetShowModalIcons.bind(this);
        this.onIconCallback = this.onIconCallback.bind(this);
        this.onGetIconModal = this.onGetIconModal.bind(this);
        this.onSetActive = this.onSetActive.bind(this);


    }

    onSetShowModalIcons(state) {
        this.setState({
            showModalIcons: state
        })
    }

    onGetIconModal(id) {
        this.setState({
            editId: id,
            showModalIcons: true
        })
    }

    onSetActive(e) {
        let currentActive = e.currentTarget.classList.contains('active');
        jQuery('.header-item').removeClass('active')
        if (!currentActive) {
            e.currentTarget.classList.add('active')
        }
    }

    onIconCallback(icon) {
        this.props.onSetValue(icon, 'icon', this.state.editId)
    }

    render() {
        return (
            <React.Fragment>
                <Col style={{minHeight: '55vh'}} xxl={8} xl={10} xs={12} className="mx-auto">
                    <Card>
                        <CardHeader style={{minHeight: '3rem'}}
                                    className="text-body bg-light fs-5 align-items-center d-flex flex-wrap">
                            <div>
                                Benutzerdefinierte Felder
                            </div>
                            <div className="ms-auto d-flex align-items-center">
                                <div
                                    className={`ajax-spinner ${this.props.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                <small>
                                    <SetAjaxResponse
                                        status={this.props.spinner.ajaxStatus}
                                        msg={this.props.spinner.ajaxMsg}
                                        color={true}
                                    />
                                </small>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {this.props.customFields && this.props.customFields.length ?
                                <Accordion className="overflow-hidden">
                                    <ReactSortable
                                        list={this.props.customFields}
                                        handle=".cursor-move"
                                        setList={(newState) => this.props.onSetCustomSortable(newState)}
                                        {...this.state.sortableOptions}
                                        onEnd={(e) => this.props.onUpdateSortable(e)}
                                    >
                                        {this.props.customFields.map((c, index) => {
                                            return (
                                                <Accordion.Item key={index} eventKey={c.id}>
                                                    <div onClick={(e) => this.onSetActive(e)}
                                                         className="position-relative header-item">
                                                        <div
                                                            className="slider-edit-box d-flex align-items-center justify-content-center bg-body-tertiary h-100">
                                                            <div
                                                                className="border-end cursor-move slider-edit-icon d-flex align-items-center justify-content-center h-100"
                                                                style={{width: '2.75rem'}}>
                                                                <i className="bi bi-arrows-move"></i>
                                                            </div>
                                                            <div
                                                                onClick={() => this.props.onDeleteCustomField(c.id)}
                                                                className="h-100 cursor-pointer slider-edit-icon border-end d-flex align-items-center justify-content-center"
                                                                style={{width: '2.75rem'}}>
                                                                <i className="bi bi-trash text-danger"></i>
                                                            </div>
                                                        </div>
                                                        <Accordion.Header>
                                                            <div className="slider-edit-item">
                                                                {c.icon ?
                                                                    <i className={`${c.icon} me-2`}></i>
                                                                    : ''}
                                                                {c.designation || ''}
                                                                <small className="d-block small-lg">{c.value}</small>
                                                                <small className="d-block text-primary small-lg"><b
                                                                    className="fw-bold">shortcode:</b> <code>[cf
                                                                    field="{c.slug}"]</code></small>
                                                            </div>
                                                        </Accordion.Header>
                                                    </div>
                                                    <Accordion.Body>
                                                        <Row className="g-2">
                                                            <Col xs={12}>
                                                                <b className="fw-semibold">shortcode</b>: <code
                                                                className="fw-normal">[cf field="{c.slug}"]</code>
                                                                <hr/>
                                                            </Col>

                                                            <Col xl={6} xs={12}>
                                                                <FloatingLabel
                                                                    controlId={uuidv4()}
                                                                    label={`Bezeichnung *`}
                                                                >
                                                                    <Form.Control
                                                                        required={true}
                                                                        value={c.designation || ''}
                                                                        onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'designation', c.id)}
                                                                        className="no-blur"
                                                                        type="text"
                                                                        placeholder='Bezeichnung'/>
                                                                </FloatingLabel>
                                                            </Col>
                                                            {this.props.selectType ?
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv4()}
                                                                        label={`Feld Typ *`}>
                                                                        <Form.Select
                                                                            className="no-blur"
                                                                            required={true}
                                                                            value={c.link_type || ''}
                                                                            onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'link_type', c.id)}
                                                                            aria-label='Feld Typ'>
                                                                            {this.props.selectType.map((s, index) =>
                                                                                <option value={s.id}
                                                                                        key={index}>{s.label}</option>
                                                                            )}
                                                                        </Form.Select>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                : ''}
                                                            <Col xl={6} xs={12}>
                                                                <FloatingLabel
                                                                    controlId={uuidv4()}
                                                                    label={`Value`}
                                                                >
                                                                    <Form.Control
                                                                        required={false}
                                                                        value={c.value || ''}
                                                                        onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'value', c.id)}
                                                                        className="no-blur"
                                                                        type="text"
                                                                        placeholder='Value'/>
                                                                </FloatingLabel>
                                                            </Col>
                                                            <Col xl={6} xs={12}>
                                                                <FloatingLabel
                                                                    controlId={uuidv4()}
                                                                    label={`Extra CSS`}
                                                                >
                                                                    <Form.Control
                                                                        required={false}
                                                                        value={c.extra_css || ''}
                                                                        onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'extra_css', c.id)}
                                                                        className="no-blur"
                                                                        type="text"
                                                                        placeholder='Extra CSS'/>
                                                                </FloatingLabel>
                                                            </Col>
                                                            {c.icon ?
                                                                <Col xl={6} xs={12}>
                                                                    <FloatingLabel
                                                                        controlId={uuidv4()}
                                                                        label={`Icon CSS`}
                                                                    >
                                                                        <Form.Control
                                                                            required={false}
                                                                            value={c.icon_css || ''}
                                                                            onChange={(e) => this.props.onSetValue(e.currentTarget.value, 'icon_css', c.id)}
                                                                            className="no-blur"
                                                                            type="text"
                                                                            placeholder='Icon CSS'/>
                                                                    </FloatingLabel>
                                                                </Col>
                                                                : ''}
                                                            {c.link_type === 'url' ?
                                                                <Col xs={12}>
                                                                    <div className="d-flex flex-wrap mt-3 mb-1">

                                                                        <Form.Check
                                                                            label='URL anzeigen'
                                                                            type="radio"
                                                                            className="no-blur me-4"
                                                                            checked={c.show_url === 'url'}
                                                                            onChange={(e) => this.props.onSetValue('url', 'show_url', c.id)}
                                                                            id={uuidv4()}
                                                                        />
                                                                        <Form.Check
                                                                            label='Bezeichnung anzeigen'
                                                                            type="radio"
                                                                            className="no-blur me-4"
                                                                            checked={c.show_url === ''}
                                                                            onChange={(e) => this.props.onSetValue('', 'show_url', c.id)}
                                                                            id={uuidv4()}
                                                                        />
                                                                    </div>
                                                                    <Form.Check
                                                                        label='In neuen Tab öffnen'
                                                                        type="checkbox"
                                                                        className="no-blur"
                                                                        checked={c.new_tab || false}
                                                                        onChange={(e) => this.props.onSetValue(e.currentTarget.checked, 'new_tab', c.id)}
                                                                        id={uuidv4()}
                                                                    />
                                                                </Col> : ''}
                                                            {c.icon && c.link_type !== 'text' ?
                                                                <div>
                                                                    <hr className="mt-2"/>
                                                                    <div className="fw-semibold mb-2">Icon URL
                                                                        Einstellungen
                                                                    </div>
                                                                    <div className="d-flex flex-wrap">
                                                                        <Form.Check
                                                                            label='Nur Icon anzeigen'
                                                                            type="checkbox"
                                                                            className="no-blur me-4"
                                                                            checked={c.only_icon_display || false}
                                                                            onChange={(e) => this.props.onSetValue(e.currentTarget.checked, 'only_icon_display', c.id)}
                                                                            id={uuidv4()}
                                                                        />
                                                                        <Form.Check
                                                                            disabled={c.only_icon_display}
                                                                            label='Icon ist Teil der URL'
                                                                            type="checkbox"
                                                                            className="no-blur me-4"
                                                                            checked={c.icon_is_url || false}
                                                                            onChange={(e) => this.props.onSetValue(e.currentTarget.checked, 'icon_is_url', c.id)}
                                                                            id={uuidv4()}
                                                                        />
                                                                    </div>
                                                                    <hr className="mt-2 mb-2"/>
                                                                </div>
                                                                : ''}
                                                            <Col xs={12}>
                                                                <div className="my-3">
                                                                    {c.icon ?
                                                                        <div className="mb-3 ms-5">
                                                                            <i style={{fontSize: '40px'}}
                                                                               className={`${c.icon}`}></i>
                                                                        </div> : ''}
                                                                    <button onClick={() => this.onGetIconModal(c.id)}
                                                                            type="button"
                                                                            className="btn btn-primary btn-sm">
                                                                        {c.icon ? 'Icon ändern' : 'Icon auswählen'}
                                                                    </button>
                                                                    {c.icon ?
                                                                        <button
                                                                            onClick={() => this.props.onSetValue('', 'icon', c.id)}
                                                                            type="button"
                                                                            title='Icon löschen'
                                                                            className="btn btn-danger ms-1 dark btn-sm">
                                                                            <i className="bi bi-trash"></i>
                                                                        </button> : ''}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            )
                                        })}
                                    </ReactSortable>
                                </Accordion>
                                :
                                <div className="fs-6">
                                    <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                                    keine benutzerdefinierten Felder verfügbar
                                </div>
                            }
                        </CardBody>
                    </Card>
                </Col>
                <AppIcons
                    showModalIcons={this.state.showModalIcons}
                    onSetShowModalIcons={this.onSetShowModalIcons}
                    onIconCallback={this.onIconCallback}
                />
            </React.Fragment>
        )
    }
}