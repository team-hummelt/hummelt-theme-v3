import {Button, Card, CardBody, Col, Collapse, FloatingLabel, Form, Row} from "react-bootstrap";
import MediaUpload from "../../../utils/MediaUpload.jsx";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import FontSettingsModal from "../../../utils/FontSettingsModal.jsx";
import FontInfoModal from "../../../utils/FontInfoModal.jsx";
import * as AppTools from "../../../utils/AppTools";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '5e6198c0-b1ad-11ef-a458-325096b39f47';
export default class ThemeFonts extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.uploadRefForm = React.createRef();
        this.state = {
            showUpload: false,
            showAdobeCol: false,
            adobeFontUrl: '',
            showInfoFontModal: false,
            showFontSettingsModal: false,
            fontInfo: [],
            fontData: [],
            fontEdit: {},
            editId: '',
            designation: '',
        }
        //Modal
        this.onSetInfoFontModal = this.onSetInfoFontModal.bind(this);
        this.onSetSettingsFontModal = this.onSetSettingsFontModal.bind(this);

        this.onGetFontInfo = this.onGetFontInfo.bind(this);
        this.onGetFontEdit = this.onGetFontEdit.bind(this);
        this.onSetFontEdit = this.onSetFontEdit.bind(this);
        this.onSendFontEdit = this.onSendFontEdit.bind(this);
        this.onDeleteFont = this.onDeleteFont.bind(this);
        this.onMediathekCallback = this.onMediathekCallback.bind(this);
        this.onSubmitAddAdobe = this.onSubmitAddAdobe.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.triggerFonts) {
            this.setState({
                showUpload: false,
                showAdobeCol: false,
                showInfoFontModal: false,
                showFontSettingsModal: false,
                fontInfo: [],
                fontData: [],
                fontEdit: {},
                editId: '',
                designation: '',
                adobeFontUrl: ''
            })
            this.props.onSetTriggerFonts(false)
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

    onSetInfoFontModal(state) {
        this.setState({
            showInfoFontModal: state
        })
    }

    onSetSettingsFontModal(state) {
        this.setState({
            showFontSettingsModal: state
        })
    }

    onGetFontInfo(id, infoId) {
        const font = [...this.props.fonts]
        const find = this.findArrayElementById(font, id, 'id');
        const fontInfo = [...find.fontInfo];
        const findInfo = this.findArrayElementById(fontInfo, infoId, 'id')

        if (findInfo) {
            this.setState({
                fontInfo: findInfo.info,
                fontData: find.fontData,
                showInfoFontModal: true,
                designation: find.designation
            })
        }
    }

    onGetFontEdit(id, infoId) {
        const font = [...this.props.fonts]
        const find = this.findArrayElementById(font, id, 'id');
        const fontData = [...find.fontData];
        const findData = this.findArrayElementById(fontData, infoId, 'id')
        findData.fontType = find.fontType
        findData.fontInfo = find.fontInfo
        this.setState({
            fontEdit: findData,
            showFontSettingsModal: true,
            editId: id
        })
    }

    onSetFontEdit(e, type) {
        let fontEdit = this.state.fontEdit;

        fontEdit[type] = e;
        this.setState({
            fontEdit: fontEdit
        })
    }

    onSendFontEdit() {
        let formData = {
            'method': 'font_edit',
            'data': JSON.stringify(this.state.fontEdit),
            'id': this.state.editId
        }
        this.props.sendFetchApi(formData)
    }

    onDeleteFont(id) {
        let swal = {
            'title': 'Schrift löschen?',
            'btn': 'Schrift löschen',
            'msg': 'Die Aktion kann nicht rückgängig gemacht werden.'
        }
        AppTools.swal_delete_modal(swal).then((result) => {
            if (result) {
                let formData = {
                    'method': 'delete_font',
                    'id': id,
                }
                this.props.sendFetchApi(formData)
            }
        })
    }

    onMediathekCallback(data, method) {
        switch (method) {
            case 'upload':
                if (data.status) {
                    this.props.onAddUploadFont(data.font)
                }
                break;
            case 'delete':

                break;
            case 'start_complete':
                if (data.complete) {
                    this.setState({
                        showUpload: false
                    })
                }
                break;
        }
    }

    onSubmitAddAdobe(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            return false;
        }
        let formData = {
            'method': 'import_adobe_font',
            'font_url': this.state.adobeFontUrl
        }
        this.props.sendFetchApi(formData)
    }



    render() {
        return (
            <Fragment>
                <Card className="shadow-sm my-3">
                    <CardBody>
                        <div className="d-flex flex-wrap">
                            <Button
                                onClick={() => this.setState({showUpload: !this.state.showUpload, showAdobeCol: false})}
                                active={this.state.showUpload}
                                variant="outline-primary">
                                <b className="fw-semibold">Font</b> Upload
                                <i className={`bi ms-2 ${this.state.showUpload ? 'bi-arrows-expand' : 'bi-arrows-collapse'}`}></i>
                            </Button>
                            <div className="ms-auto">
                                <Button
                                    onClick={() => this.setState({
                                        showAdobeCol: !this.state.showAdobeCol,
                                        showUpload: false
                                    })}
                                    active={this.state.showAdobeCol}
                                    variant="outline-primary">
                                    <b className="fw-semibold">Adobe</b> Fonts
                                    <i className={`bi ms-2 ${this.state.showAdobeCol ? 'bi-arrows-expand' : 'bi-arrows-collapse'}`}></i>
                                </Button>
                            </div>
                        </div>
                        <hr/>
                        <Collapse
                            in={this.state.showAdobeCol}>
                            <div id={uuidv4()}>
                                <h6 className="text-start my-3">
                                    <i className="bi bi-node-plus me-2"></i>
                                    Adobe Font <span className="fw-light"> hinzufügen</span>
                                </h6>
                                <Form onSubmit={this.onSubmitAddAdobe}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Adobe Font CSS URL *"
                                        className="my-2"
                                    >
                                        <Form.Control
                                            className="no-blur"
                                            required={true}
                                            type="url"
                                            value={this.state.adobeFontUrl || ''}
                                            onChange={(e) => this.setState({adobeFontUrl: e.currentTarget.value})}
                                            placeholder="Adobe Font Css URL"/>
                                    </FloatingLabel>
                                    <Button
                                        type="submit"
                                        disabled={!this.state.adobeFontUrl}
                                        className="mt-2" variant="primary">
                                        Schrift <span className="fw-semibold">Importieren</span>
                                    </Button>
                                </Form>
                                <hr/>
                            </div>
                        </Collapse>
                        <Collapse
                            in={this.state.showUpload}>
                            <div id={uuidv4()}>

                                <h6 className="text-center my-3">
                                    <i className="bi bi-node-plus me-2"></i>
                                    Schrift <span className="fw-light"> hinzufügen</span>
                                </h6>
                                <Form ref={this.uploadRefForm}
                                      id={uuidv5('uploadForm', v5NameSpace)}>
                                    <input type="hidden" name="method" value="font_upload"/>
                                    <div className="d-flex justify-content-center upload-full">
                                        <MediaUpload
                                            onMediathekCallback={this.onMediathekCallback}
                                            form_id={uuidv5('uploadForm', v5NameSpace)}
                                            showUpload={true}
                                            uploadType="fonts"
                                            assets='.ttf'
                                            maxFiles={50}
                                            chunking={true}
                                            delete_after={true}
                                        />
                                    </div>
                                </Form>

                                <hr/>
                            </div>
                        </Collapse>
                        {this.props.fonts && this.props.fonts.length ?
                            <Row className="g-3 align-items-stretch ">
                                {this.props.fonts.map((f, i) => {
                                    return (
                                        <Col xxl={4} xl={6} lg={6} xs={12} key={i}>
                                            <div
                                                className="d-flex overflow-hidden position-relative border h-100 w-100 shadow-sm">
                                                <div className="p-3 d-flex flex-column w-100 h-100">
                                                    <div className="header-font">
                                                        <h5 className="fw-semibold">
                                                            <i className="text-orange bi bi-arrow-right-circle-fill me-2"></i>
                                                            {f.designation}
                                                        </h5>
                                                    </div>
                                                    <hr/>
                                                    {f.fontType === 'intern' ?
                                                        <small
                                                            className="fw-semibold d-flex justify-content-center flex-wrap">
                                                       <span className="me-2">TTF:
                                                        <i className={`bi ms-2 ${f.isTtf ? 'bi-check2-circle text-success' : 'bi-bi-x-lg text-danger'}`}></i>
                                                       </span>
                                                            <span className="me-2">WOFF:
                                                        <i className={`bi ms-2 ${f.isWoff ? 'bi-check2-circle text-success' : 'bi-bi-x-lg text-danger'}`}></i>
                                                       </span>
                                                            <span className="me-2">WOFF2:
                                                        <i className={`bi ms-2 ${f.isWoff2 ? 'bi-check2-circle text-success' : 'bi-x-circle text-danger'}`}></i>
                                                       </span>
                                                        </small> :
                                                        <div>
                                                            <small className="fw-semibold d-block text-center">
                                                                Adobe <span className="fw-normal">Font</span>
                                                            </small>
                                                            <hr/>
                                                            <Form.Check
                                                                type="switch"
                                                                className="no-blur"
                                                                id={uuidv4()}
                                                                checked={f.fontInfo.register_font || false}
                                                                onChange={(e) => this.props.onSetAdobeFontEdit(e.target.checked, 'register_font', f.id)}
                                                                label="Font Registrieren"
                                                            />
                                                        </div>
                                                    }
                                                    <hr/>
                                                    <h6>Schriftstile:</h6>
                                                    <ul className="li-font-list list-unstyled mb-2">
                                                        {f.fontData.map((d, di) => {
                                                            return (
                                                                <li key={di}>
                                                                    <span
                                                                        className="d-flex align-items-center flex-wrap">
                                                                        <span className="d-block text-truncate">
                                                                            {d.full_name}
                                                                        </span>
                                                                        <span className="ms-auto d-block">
                                                                            {f.fontType === 'intern' ?
                                                                                <i onClick={() => this.onGetFontInfo(f.id, d.id)}
                                                                                   title="Font Info"
                                                                                   className="text-primary cursor-pointer me-2 bi bi-info-circle"></i> : ''}
                                                                            <i onClick={() => this.onGetFontEdit(f.id, d.id)}
                                                                               title="Schrift-Einstellungen"
                                                                               className="text-orange cursor-pointer bi bi-gear"></i>
                                                                        </span>
                                                                    </span>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                    <div className="mt-auto">
                                                        <hr className="mt-1"/>
                                                        <div className="d-flex align-items-center">
                                                            <div onClick={() => this.onDeleteFont(f.id)}
                                                                 className="small fw-semibold cursor-pointer d-inline-block text-danger">
                                                                löschen
                                                            </div>
                                                            <div className="ms-auto">
                                                                {f.fontType === 'intern' ?
                                                                    <div
                                                                        className="d-inline-block ">
                                                                        <a className="text-primary no-blur small fw-semibold text-decoration-none"
                                                                           href={`${hummeltRestObj.site_url}/hummelt-theme-v3/font-demo/?font=${f.designation}`}
                                                                           target="_blank">Demo</a>
                                                                    </div> : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })}
                            </Row>
                            :
                            <div>
                                <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                                keine Schriftarten verfügbar
                            </div>
                        }
                        <hr/>
                        {this.props.adobe_fonts && this.props.fonts.adobe_fonts ?
                            <Row className="g-3 align-items-stretch">
                                <Col xs={12}>
                                    <div className="fw-semibold mb-3">Adobe Fonts</div>
                                </Col>
                                {this.props.adobe_fonts.map((f, i) => {
                                    return (
                                        <Col xl={4} lg={6} xs={12} key={i}>

                                        </Col>
                                    )
                                })}
                            </Row>
                            : ''}
                    </CardBody>
                </Card>
                <FontSettingsModal
                    showFontSettingsModal={this.state.showFontSettingsModal}
                    fontEdit={this.state.fontEdit}
                    onSetSettingsFontModal={this.onSetSettingsFontModal}
                    onSetFontEdit={this.onSetFontEdit}
                    onSendFontEdit={this.onSendFontEdit}
                />
                <FontInfoModal
                    showInfoFontModal={this.state.showInfoFontModal}
                    designation={this.state.designation}
                    fontData={this.state.fontData}
                    fontInfo={this.state.fontInfo}
                    onSetInfoFontModal={this.onSetInfoFontModal}
                />
            </Fragment>
        )
    }
}