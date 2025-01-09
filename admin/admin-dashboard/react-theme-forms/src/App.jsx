import {Card, CardBody, Container, Nav, Collapse, Button, FloatingLabel, Form, CardHeader, Col} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import FormAddModal from "./utils/FormAddModal.jsx";
import ApiErrorAlert from "./utils/ApiErrorAlert.jsx";
import FormsTable from "./sections/FormsTable.jsx";
import AppForms from "./FormBuilder/AppForms.jsx";
import DropzoneUpload from "./utils/DropzoneUpload.jsx";
import EmailSettings from "./sections/EmailSettings.jsx";
import EmailTable from "./sections/EmailTable.jsx";
import EmailModal from "./sections/EmailModal.jsx";
import * as AppTools from "./utils/AppTools";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import SetAjaxData from "./utils/SetAjaxData.jsx";

const reactSwal = withReactContent(Swal);

const {Component, Fragment} = wp.element;
export default class App extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            showApiError: false,
            showEmailPw: false,
            showSendTestMail: false,
            showEmailModal: false,
            apiErrorMsg: '',
            colHome: true,
            colPosts: false,
            colSettings: false,
            colLicense: false,
            colUpload: false,
            containerFluid: false,
            selectedNav: 'home',
            showAddFormModal: false,
            designation: '',
            drawTable: false,
            drawEmailTable: false,
            colStart: true,
            colBuilder: false,
            getBuilder: false,
            triggerDesignation: false,
            getId: '',
            editBuilder: {},
            builderId: '',
            editEmailSettings: {},
            exampleSelects: [],
            colExample: false,
            exampleId: '',
            sendEmail: {
                uploads: [],
                cc: '',
                bcc: '',
                message: ''
            },
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },

        }

        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onSetShowAddFormModal = this.onSetShowAddFormModal.bind(this);
        this.onSetApiError = this.onSetApiError.bind(this);
        this.onSetDesignation = this.onSetDesignation.bind(this);
        this.sendFetchApi = this.sendFetchApi.bind(this);
        this.setDrawTable = this.setDrawTable.bind(this);
        this.onToggleStartBuilder = this.onToggleStartBuilder.bind(this);
        this.onSetGetBuilderForm = this.onSetGetBuilderForm.bind(this);
        this.onGetBuilder = this.onGetBuilder.bind(this);

        this.onSetEditBuilder = this.onSetEditBuilder.bind(this);
        this.onUpdateBuilder = this.onUpdateBuilder.bind(this);
        this.onUpdateDesignation = this.onUpdateDesignation.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.sendFetchAjax = this.sendFetchAjax.bind(this);
        this.onSetEmailSettings = this.onSetEmailSettings.bind(this);
        this.onGetEmailSettings = this.onGetEmailSettings.bind(this);
        this.sendFormFormData = this.sendFormFormData.bind(this);
        this.onToggleEmailPw = this.onToggleEmailPw.bind(this);
        this.onToggleSendTestMail = this.onToggleSendTestMail.bind(this);
        this.onSetExampleSelects = this.onSetExampleSelects.bind(this);
        this.loadFormExample = this.loadFormExample.bind(this);
        this.setDrawEmailTable = this.setDrawEmailTable.bind(this);
        this.setShowEmailModal = this.setShowEmailModal.bind(this);

    }

    setShowEmailModal(state) {
        this.setState({
            showEmailModal: state
        })
    }
    setDrawEmailTable(state) {
        this.setState({
            drawEmailTable: state
        })
    }

    onSetEditBuilder(e, type) {
        let upd = this.state.editBuilder;
        upd[type] = e;
        this.setState({
            editBuilder: upd
        })
    }

    onUpdateBuilder(e, type, id) {
        console.log(e, type, id)
        let upd = this.state.editBuilder;
        upd.id = id;
        upd[type] = e;
        this.setState({
            editBuilder: upd,
            showAddFormModal: true
        })

    }

    onUpdateDesignation(e) {
        this.setState({
            designation: e,
            showAddFormModal: true
        })
    }

    onSetShowAddFormModal(state) {
        this.setState({
            showAddFormModal: state
        })
    }

    onSetGetBuilderForm(state) {
        this.setState({
            getBuilder: state,
            triggerDesignation: state
        })
    }

    setDrawTable(state) {
        this.setState({
            drawTable: state
        })
    }

    onGetBuilder(id) {
        this.setState({
            getId: id,
            getBuilder: true
        })
        this.onToggleStartBuilder('builder')
    }

    onToggleCollapse(target) {
        let home = false;
        let posteingang = false;
        let settings = false;
        let license = false;
        switch (target) {
            case 'home':
                home = true;
                break;
            case 'posteingang':
                posteingang = true;
                this.onToggleStartBuilder('start', true)
                break;
            case 'settings':
                //settings = true;
                this.onToggleStartBuilder('start', true)
                this.onGetEmailSettings();
                return false;
            case 'settings-toggle':
                settings = true;
                target = 'settings'
                break;
            case 'license':
                license = true;
                this.onToggleStartBuilder('start', true)
                break
        }

        this.setState({
            colHome: home,
            colPosts: posteingang,
            colSettings: settings,
            colLicense: license,
            colUpload: false,
            selectedNav: target,
            getId: ''
        })
    }

    onToggleStartBuilder(target, reset = false) {
        let start = false;
        let builder = false;
        switch (target) {
            case 'start':
                start = true;
                break;
            case 'builder':
                builder = true;
                break;
        }

        this.setState({
            colStart: start,
            colBuilder: builder,

        })
    }

    onSetApiError(state, reset = false) {
        let msg = '';
        reset ? msg = '' : msg = this.state.apiErrorMsg;
        this.setState({
            showApiError: state,
            msg: msg
        })
        if (reset) {
            this.setState({
                getId: ''
            })
        }
    }

    onSetDesignation(e) {
        this.setState({
            designation: e
        })
    }

    onDeleteSwalHandle(formData, swal) {
        reactSwal.fire({
            title: swal.title,
            reverseButtons: true,
            html: `<span class="swal-delete-body">${swal.msg}</span>`,
            confirmButtonText: swal.btn,
            cancelButtonText: 'Abbrechen',
            customClass: {
                popup: 'swal-delete-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.sendFetchApi(formData)
            }
        });
    }

    onGetEmailSettings() {
        let formData = {
            'method': 'get_email_settings'
        }

        this.sendFetchApi(formData)
    }

    onSetEmailSettings(e, type) {
        let editEmailSettings = this.state.editEmailSettings;
        editEmailSettings[type] = e;
        this.setState({
            editEmailSettings: editEmailSettings,
            spinner: {
                showAjaxWait: true
            }
        })

        this.sendFormFormData(editEmailSettings, 'set_email_settings')
    }

    onToggleEmailPw(state) {
        this.setState({
            showEmailPw: state
        })
    }

    onToggleSendTestMail(state) {
        this.setState({
            showSendTestMail: state
        })
    }

    loadFormExample() {
        if(!this.state.exampleId) {
            return false;
        }
        let formData = {
            'method': 'load_form_example',
            'id': this.state.exampleId
        }
        this.sendFetchApi(formData);

    }

    sendFormFormData(settings, method) {
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': method,
                'data': JSON.stringify(settings)
            }
            _this.sendFetchApi(formData)
        }, 1000);
    }

    onSetExampleSelects(examples) {
        this.setState({
            exampleSelects: examples
        })
    }

    sendFetchAjax(formData, url = hummeltRestObj.ajax_url) {
        wp.apiFetch({
            url: url,
            method: 'POST',
            body: SetAjaxData(formData),
        }).then(data => {
            switch (data.type) {
                case 'import_page_builder':
                    if (data.status) {
                        AppTools.swalAlertMsg(data)
                        this.setState({
                            colUpload: false,
                            drawTable: true,
                        })
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

    sendFetchApi(formData, path = hummeltRestObj.form_builder_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'form_handle':
                    if (data.status) {
                        if (data.handle === 'designation') {
                            this.setState({
                                showAddFormModal: false,
                                designation: data.designation,
                                triggerDesignation: true,
                                drawTable: true,
                                getId: ''

                            })
                        } else {
                            this.setState({
                                showAddFormModal: false,
                                getId: '',
                                designation: ''
                            })
                            AppTools.success_message(data.msg)
                        }

                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'duplicate_forms':
                    if (data.status) {
                        this.setState({
                            drawTable: true,
                            getId: ''
                        })
                        AppTools.success_message(data.msg)
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_form_builder':
                    AppTools.swalAlertMsg(data);
                    if (data.status) {
                        this.setState({
                            drawTable: true,
                            getId: ''
                        })
                    }
                    break;
                case 'get_email_settings':
                    this.setState({
                        showEmailPw: false,
                        editEmailSettings: data.email_settings
                    })
                    this.onToggleCollapse('settings-toggle')
                    break;
                case 'set_email_settings':
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
                    break;

                case 'send_test_email':
                    let editEmailSettings = this.state.editEmailSettings;
                    editEmailSettings.test_msg = '';
                    this.setState({
                        editEmailSettings: editEmailSettings,
                        showSendTestMail: false
                    })
                    if (data.status) {
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'email_smtp_test':
                    let emailSettings = this.state.editEmailSettings;
                    emailSettings.status = data.status;
                    this.setState({
                        editEmailSettings: emailSettings
                    })
                    if (data.status) {
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'load_form_example':
                     if(data.status) {
                         AppTools.swalAlertMsg(data)
                         this.setState({
                             drawTable: true,
                             colExample: false,
                             exampleId: '',
                         })
                     } else {
                         AppTools.warning_message(data.msg)
                     }
                    break;
                case 'get_form_email':
                     if(data.status){
                        this.setState({
                            sendEmail: data.record,
                            showEmailModal: true
                        })
                     } else {
                         AppTools.warning_message(data.msg)
                     }
                    break;
                case 'delete_form_email':
                    if(data.status){
                        this.setState({
                            drawEmailTable: true
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
            <Container className="toggle-container-animate" fluid={this.state.containerFluid}>
                <ApiErrorAlert
                    showApiError={this.state.showApiError}
                    apiErrorMsg={this.state.apiErrorMsg}
                    onSetApiError={this.onSetApiError}
                />
                <Card style={{background: 'none'}} className="shadow card-dashboard position-relative my-4">
                    <div onClick={() => this.setState({containerFluid: !this.state.containerFluid})}
                         className={`toggle-container d-md-flex d-none  ${this.state.containerFluid ? 'open' : 'closed'}`}>
                    </div>
                    <CardBody className="position-relative">
                        <div className="mb-4">
                            <a title="hummelt und partner" className="w-100" target="_blank"
                               href="https://www.hummelt-werbeagentur.de/">
                                <img style={{maxWidth: '200px'}} className="img-fluid" alt="hummelt und partner"
                                     src={`${hummeltRestObj.theme_admin_url}assets/images/logo_hupa.svg`}/>
                            </a>
                        </div>
                        <hr/>
                        <div className="d-flex flex-wrap">
                            <Button
                                onClick={() => this.setState({showAddFormModal: true, getId: '', designation: ''})}
                                size="sm"
                                variant="success">
                                <i className="bi bi-node-plus me-2"></i>
                                Formular erstellen
                            </Button>
                            <div className="ms-auto">
                                <Button onClick={() => this.setState({colExample: !this.state.colExample})}
                                        size="sm"
                                        variant={`outline-secondary me-2 ${this.state.colExample && 'active'}`}>
                                    <i className="bi bi-grid me-2"></i>
                                    Beispiele
                                    <i className={`bi  ms-2 ${this.state.colExample ? 'bi-arrows-expand' : 'bi-arrows-collapse'}`}></i>
                                </Button>
                                <Button onClick={() => this.setState({colUpload: !this.state.colUpload})}
                                        size="sm"
                                        variant={`outline-primary ${this.state.colUpload && 'active'}`}>
                                    <i className="bi bi-upload me-2"></i>
                                    Layout Importieren
                                    <i className={`bi  ms-2 ${this.state.colUpload ? 'bi-arrows-expand' : 'bi-arrows-collapse'}`}></i>
                                </Button>
                            </div>
                        </div>
                        <Collapse in={this.state.colExample}>
                            <div id={uuidv4()}>
                                <CardBody className="border rounded my-3 bg-body-tertiary">
                                    <hr/>
                                    <h5>Formular Vorlagen</h5>
                                    <Col xxl={4} xl={6} lg={10} xs={12}>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={"Examples"}
                                        >
                                            <Form.Select
                                                className="no-blur mw-100"
                                                value={this.state.exampleId || ''}
                                                onChange={(e) => this.setState({exampleId: e.target.value})}
                                                aria-label={"Examples"}>
                                                {this.state.exampleSelects.map((select, index) =>
                                                    <option key={index}
                                                            value={select.id}>
                                                        {select.label}
                                                    </option>
                                                )}
                                            </Form.Select>
                                        </FloatingLabel>
                                        <button onClick={this.loadFormExample}
                                            className={`btn mt-2 btn-sm  ${this.state.exampleId ? 'btn-primary' : 'btn-outline-secondary opacity-50'}`}
                                            disabled={!this.state.exampleId}
                                        >
                                            Beispiel laden
                                        </button>
                                    </Col>
                                    <hr/>
                                </CardBody>
                            </div>
                        </Collapse>
                        <Collapse in={this.state.colUpload}>
                            <div id={uuidv4()}>
                                <CardBody className="border rounded my-3 bg-body-tertiary">
                                    <hr/>
                                    <h5>Upload</h5>
                                    <DropzoneUpload
                                        sendFetchAjax={this.sendFetchAjax}
                                    />
                                    <hr/>
                                </CardBody>
                            </div>
                        </Collapse>
                        <hr/>
                        <Nav
                            onSelect={(selectedKey) => this.onToggleCollapse(selectedKey)}
                            variant="tabs"
                            activeKey={this.state.selectedNav}>
                            <Nav.Item>
                                <Nav.Link eventKey="home">Formulare</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="posteingang">Posteingang</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="settings">E-Mail Einstellungen</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="ms-md-auto">
                                <Nav.Link eventKey="license">Lizenz</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <div className="py-3 body-dashboard">
                            <Card style={{background: 'none'}} className="w-100 shadow-sm flex-fill">
                                <CardBody className="d-flex flex-column rounded bg-light">
                                    <Collapse in={this.state.colHome}>
                                        <div id={uuidv4()}>

                                            <div className="body-dashboard">
                                                <Collapse in={this.state.colStart}>
                                                    <div id={uuidv4()}>
                                                        <FormsTable
                                                            drawTable={this.state.drawTable}
                                                            setDrawTable={this.setDrawTable}
                                                            onGetBuilder={this.onGetBuilder}
                                                            sendFetchApi={this.sendFetchApi}
                                                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                                                            onSetExampleSelects={this.onSetExampleSelects}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse in={this.state.colBuilder}>
                                                    <div id={uuidv4()}>
                                                        <AppForms
                                                            getBuilder={this.state.getBuilder}
                                                            id={this.state.getId}
                                                            triggerDesignation={this.state.triggerDesignation}
                                                            designation={this.state.designation}
                                                            onSetGetBuilderForm={this.onSetGetBuilderForm}
                                                            onToggleStartBuilder={this.onToggleStartBuilder}
                                                            onUpdateBuilder={this.onUpdateBuilder}
                                                            onUpdateDesignation={this.onUpdateDesignation}
                                                        />
                                                    </div>
                                                </Collapse>

                                            </div>
                                        </div>
                                    </Collapse>
                                    <Collapse in={this.state.colPosts}>
                                        <div id={uuidv4()}>
                                            <div className="body-dashboard">
                                                <EmailTable
                                                    drawEmailTable={this.state.drawEmailTable}
                                                    setDrawEmailTable={this.setDrawEmailTable}
                                                    onDeleteSwalHandle={this.onDeleteSwalHandle}
                                                    sendFetchApi={this.sendFetchApi}
                                                />
                                            </div>
                                        </div>
                                    </Collapse>
                                    <Collapse in={this.state.colSettings}>
                                        <div id={uuidv4()}>
                                            <div className="body-dashboard">
                                                <EmailSettings
                                                    editEmailSettings={this.state.editEmailSettings}
                                                    spinner={this.state.spinner}
                                                    showEmailPw={this.state.showEmailPw}
                                                    showSendTestMail={this.state.showSendTestMail}
                                                    onToggleSendTestMail={this.onToggleSendTestMail}
                                                    onSetEmailSettings={this.onSetEmailSettings}
                                                    onToggleEmailPw={this.onToggleEmailPw}
                                                    sendFetchApi={this.sendFetchApi}
                                                />
                                            </div>
                                        </div>
                                    </Collapse>
                                    <Collapse in={this.state.colLicense}>
                                        <div id={uuidv4()}>
                                            <div className="body-dashboard">
                                                <div>
                                                    LI
                                                </div>
                                            </div>
                                        </div>
                                    </Collapse>
                                </CardBody>
                            </Card>

                        </div>
                    </CardBody>
                </Card>
                <FormAddModal
                    showAddFormModal={this.state.showAddFormModal}
                    id={this.state.getId}
                    designation={this.state.designation}
                    onSetShowAddFormModal={this.onSetShowAddFormModal}
                    onSetDesignation={this.onSetDesignation}
                    sendFetchApi={this.sendFetchApi}
                />
                <EmailModal
                    showEmailModal={this.state.showEmailModal}
                    sendEmail={this.state.sendEmail}
                    setShowEmailModal={this.setShowEmailModal}
                />
                <div id="snackbar-success"></div>
                <div id="snackbar-warning"></div>
            </Container>
        )
    }
}