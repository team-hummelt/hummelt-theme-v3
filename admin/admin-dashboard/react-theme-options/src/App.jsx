import ApiErrorAlert from "./utils/ApiErrorAlert.jsx";
import {Card, CardBody, Container, Nav, Collapse, CardHeader} from "react-bootstrap";

const {Component, Fragment} = wp.element;
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import SetAjaxResponse from "./utils/SetAjaxResponse.jsx";
import WpConfig from "./components/WpConfig.jsx";
import UpdateNotizen from "./components/UpdateNotizen.jsx";
import BackendSortable from "./components/BackendSortable.jsx";
import BackendDuplicate from "./components/BackendDuplicate.jsx";
import SetConfigPinModal from "./utils/SetConfigPinModal.jsx";
import DebugLogModal from "./utils/DebugLogModal.jsx";
import * as AppTools from "./utils/AppTools";

let lastKnownScrollPosition = 0;
export default class App extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            selectedCat: 'WP-Config',
            selectedSub: '',
            selectedFirstId: 'config',
            selectedSubId: '',
            collapsedId: 'config',
            stickyTop: false,
            sideVarWrapperHeight: 0,
            wpBarHeight: 'auto',
            showApiError: false,
            apiErrorMsg: '',
            roles: [],
            menu: [],
            settings: {},
            showPinModal: false,
            configPin: '',
            pinHandle: '',
            showLogModal: false,
            debugLogFile: '',
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }
        this.urlSearchParam = this.urlSearchParam.bind(this);
        this.updateWpOptionen = this.updateWpOptionen.bind(this);
        this.onUpdateSortDupOptionen = this.onUpdateSortDupOptionen.bind(this);
        this.onUpdateSortDupPostTypes = this.onUpdateSortDupPostTypes.bind(this);

        this.sendFetchApi = this.sendFetchApi.bind(this);
        this.onSetApiError = this.onSetApiError.bind(this);
        this.sendOptionFormData = this.sendOptionFormData.bind(this);
        this.onSetEditPin = this.onSetEditPin.bind(this);
        this.onGetOpenPinModal = this.onGetOpenPinModal.bind(this);
        this.setShowPinModal = this.setShowPinModal.bind(this);
        this.onSetConfigPin = this.onSetConfigPin.bind(this);

        this.setShowLogModal = this.setShowLogModal.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

    }

    componentDidMount() {
        document.addEventListener("scroll", (event) => {
            lastKnownScrollPosition = window.scrollY;
            let adminBar = document.getElementById('wpadminbar');
            let adminBarHeight = adminBar.getBoundingClientRect().height
            let sideVarWrapper = document.querySelector('.sidebar-menu-wrapper')
            let sideVarWrapperHeight = sideVarWrapper.getBoundingClientRect().height;
            let menuWrapper = document.querySelector('.menu-options-wrapper').getBoundingClientRect().top

            if (lastKnownScrollPosition >= menuWrapper + 220) {
                this.setState({
                    stickyTop: true,
                    sideVarWrapperHeight: sideVarWrapperHeight,
                    wpBarHeight: adminBarHeight + 'px'
                })
            } else {
                this.setState({
                    stickyTop: false,
                    sideVarWrapperHeight: 0,
                    wpBarHeight: 'auto'
                })
            }
        })

        let formData = {
            'method': 'get_theme_optionen',
        }
        this.sendFetchApi(formData);
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

    setShowLogModal(state) {
        this.setState({
            showLogModal: state
        })
    }

    setShowPinModal(state) {
        this.setState({
            showPinModal: state
        })
    }

    onSetConfigPin(pin) {
        this.setState({
            configPin: pin
        })
    }

    onGetOpenPinModal(handle) {
        this.setState({
            pinHandle: handle,
            showPinModal: true,
            configPin: ''
        })
    }

    urlSearchParam(search) {
        const authResult = new URLSearchParams(window.location.search);
        return authResult.get(search)
    }

    onSetApiError(state, reset = false) {
        let msg = '';
        reset ? msg = '' : msg = this.state.apiErrorMsg;
        this.setState({
            showApiError: state,
            msg: msg
        })
    }

    updateWpOptionen(e, type, handle) {
        let upd = this.state.settings[handle];
        upd[type] = e;
        let settings = this.state.settings;
        settings[handle] = upd;
        this.setState({
            settings: settings,
            spinner: {
                showAjaxWait: true
            }
        })
        this.sendOptionFormData(settings[handle], handle + '_handle')
    }

    onUpdateSortDupOptionen(e, type, handle) {
        let upd = this.state.settings[handle];
        upd[type] = e;
        let settings = this.state.settings;
        settings[handle] = upd;
        this.setState({
            settings: settings,
            spinner: {
                showAjaxWait: true
            }
        })
        this.sendOptionFormData(settings[handle], handle + '_handle')
    }

    onUpdateSortDupPostTypes(e, name, handle) {
        const upd = [...this.state.settings[handle]]
        const find = this.findArrayElementById(upd, name, 'name')
        find.value = e;
        let settings = this.state.settings;
        settings[handle] = upd;
        this.setState({
            settings: settings,
            spinner: {
                showAjaxWait: true
            }
        })
        let disabled = true;
        if(handle === 'sortable_post_types') {
            disabled = this.state.settings.theme_sort_options.backend_sortable_disabled;
        }
        if(handle === 'duplicate_post_types') {
            disabled = this.state.settings.theme_duplicate_options.backend_duplicate_disabled;
        }

        let formData = {
            'record': settings[handle],
            'disabled': disabled
        }
        this.sendOptionFormData(formData, handle + '_handle')
    }

    onSetEditPin(pin) {

    }

    sendOptionFormData(settings, method) {
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

    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_theme_optionen':
                    if (data.status) {
                        this.setState({
                            menu: data.menu,
                            settings: data.settings,
                            roles: data.roles
                        })
                    }
                    break;
                case 'wp_optionen_handle':
                case 'wp_config_handle':
                case 'update_msg_handle':
                case 'sortable_post_types_handle':
                case 'theme_sort_options_handle':
                case 'duplicate_post_types_handle':
                case 'theme_duplicate_options_handle':
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
                    break;
                case 'edit_config':
                    this.setState({
                        showPinModal: false,
                        configPin: '',
                        pinHandle: ''
                    })
                    let status = true;
                    if(data.status){
                        status = false;
                    }
                    let settings = this.state.settings;
                    switch (data.handle) {
                        case 'wp_optionen':
                            settings['wp_optionen']['wp_optionen_disabled'] = status;
                            settings['wp_config']['wp_config_disabled'] = status;
                            break;
                        case 'update_msg':
                            settings['update_msg']['update_msg_disabled'] = status;
                            break;
                        case 'theme_sort_options':
                            settings['theme_sort_options']['backend_sortable_disabled'] = status;
                            break;
                        case 'theme_duplicate_options':
                            settings['theme_duplicate_options']['backend_duplicate_disabled'] = status;
                            break;
                    }
                    this.setState({
                        settings: settings
                    })
                    if (!data.status) {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'get_debug_log':
                     if(data.status) {
                         if(data.handle === 'add') {
                             this.setState({
                                 showLogModal: true,
                                 debugLogFile: data.log,
                             })
                         }
                         if(data.handle === 'delete') {
                             this.setState({
                                 showLogModal: false,
                                 debugLogFile: '',
                             })
                             AppTools.success_message(data.msg)
                         }
                     } else {
                         AppTools.warning_message(data.msg);
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
            <Fragment>
                <Container className="pe-lg-4" fluid={true}>
                    <ApiErrorAlert
                        showApiError={this.state.showApiError}
                        apiErrorMsg={this.state.apiErrorMsg}
                        onSetApiError={this.onSetApiError}
                    />
                    <Card style={{background: 'none'}} className="shadow card-dashboard my-4">
                        <CardBody className="position-relative">
                            <div className="mb-4">
                                <a title="hummelt und partner" className="w-100" target="_blank"
                                   href="https://www.hummelt-werbeagentur.de/">
                                    <img style={{maxWidth: '200px'}} className="img-fluid" alt="hummelt und partner"
                                         src={`${hummeltRestObj.theme_admin_url}assets/images/logo_hupa.svg`}/>
                                </a>
                            </div>
                            <hr/>
                            <div className="options-wrapper">
                                <div className="options-head">
                                    <b className="fw-semibold">hummelt und partner </b> <span
                                    className="fw-light small-lg ms-2"> Theme v{hummeltRestObj.version}</span>
                                </div>
                                <div className="d-flex flex-wrap shadow menu-options-wrapper">
                                    <div className="menu-options left-sidebar">
                                        <div style={{paddingTop: this.state.sideVarWrapperHeight + 'px'}}
                                             className="sticky-placeholder"></div>

                                        <div style={{top: this.state.wpBarHeight}}
                                             className={`sidebar-menu ${this.state.stickyTop ? 'sidebar-fixed' : 'sidebar-static'}`}>
                                            <div className="sidebar-menu-wrapper  d-flex flex-column">
                                                <div className="list-unstyled nav-sidebar-wrapper">
                                                    {this.state.menu && this.state.menu.length ?
                                                        <Fragment>
                                                            {this.state.menu.map((m, i) => {
                                                                return (
                                                                    <div key={i}
                                                                         className={`d-flex sidebar-item border-bottom border-secondary px-3 py-1 pt-2 ${i === 0 && this.state.selectedFirstId === 'allgemein' ? 'active' : this.state.selectedFirstId === m.id && 'active'}`}>
                                                                        <i className={`bi ${m.icon} opacity-75 py-2 me-2`}></i>
                                                                        <div className="d-flex flex-column flex-fill">
                                                                            <div
                                                                                onClick={() => this.setState({
                                                                                    selectedFirstId: m.id,
                                                                                    selectedSubId: m.first,
                                                                                    selectedCat: m.headline,
                                                                                    selectedSub: m['first-label'],
                                                                                    collapsedId: !m.sub.length ? m.id : m.first
                                                                                })}
                                                                                className="py-2 cursor-pointer first-item multi">
                                                                                {m.label}
                                                                            </div>
                                                                            {m.sub && m.sub.length ?
                                                                                <Collapse
                                                                                    in={this.state.selectedFirstId === m.id}>
                                                                                    <div id={uuidv4()}>
                                                                                        <div
                                                                                            className="d-flex flex-column">
                                                                                            {m.sub.map((s, si) => {
                                                                                                return (
                                                                                                    <span
                                                                                                        onClick={() => this.setState({
                                                                                                            selectedSubId: s.id,
                                                                                                            selectedSub: s.label,
                                                                                                            collapsedId: s.id
                                                                                                        })}
                                                                                                        key={si}
                                                                                                        className={`cursor-pointer sub-item pe-2 py-1 ${this.state.selectedSubId === s.id ? 'active' : ''}`}>
                                                                                                    {s.label}
                                                                                                </span>
                                                                                                )
                                                                                            })}
                                                                                        </div>
                                                                                    </div>
                                                                                </Collapse>
                                                                                : ''}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </Fragment>
                                                        : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="menu-content-wrapper">
                                        <Card className="h-100 rounded-0 border-0">
                                            <div className="content-header p-3">
                                                <div style={{minHeight: '1.75rem'}}
                                                     className="d-flex fs-5 align-items-center">
                                                    <div>
                                                        {this.state.selectedCat}
                                                        {this.state.selectedSub &&
                                                            <i className="bi bi-arrow-right-short mx-1"></i>}
                                                        <span className="fw-light">{this.state.selectedSub}</span>
                                                    </div>
                                                    <span className="ms-auto">
                                                <div
                                                    className={`ajax-spinner text-muted ${this.state.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                                <small>
                                                    <SetAjaxResponse
                                                        status={this.state.spinner.ajaxStatus}
                                                        msg={this.state.spinner.ajaxMsg}
                                                    />
                                                </small>
                                            </span>
                                                </div>
                                            </div>
                                            <CardHeader className="d-flex align-items-center shadow"
                                                        style={{minHeight: '50px', backgroundColor: '#ebebeb'}}>
                                                <div className="fs-6">
                                                    <i className="bi bi-arrow-right-short me-1"></i>
                                                    {this.state.selectedSub ? this.state.selectedSub : this.state.selectedCat}
                                                </div>
                                            </CardHeader>

                                            <CardBody style={{fontSize: '16px'}}>
                                                <Collapse
                                                    in={this.state.collapsedId === 'config'}>
                                                    <div id={uuidv4()}>
                                                        <WpConfig
                                                            settings={this.state.settings}
                                                            updateWpOptionen={this.updateWpOptionen}
                                                            onGetOpenPinModal={this.onGetOpenPinModal}
                                                            sendFetchApi={this.sendFetchApi}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'update-notizen'}>
                                                    <div id={uuidv4()}>
                                                        <UpdateNotizen
                                                            settings={this.state.settings}
                                                            updateWpOptionen={this.updateWpOptionen}
                                                            onGetOpenPinModal={this.onGetOpenPinModal}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'sortable'}>
                                                    <div id={uuidv4()}>
                                                        <BackendSortable
                                                            settings={this.state.settings}
                                                            roles={this.state.roles}
                                                            onUpdateSortDupOptionen={this.onUpdateSortDupOptionen}
                                                            onUpdateSortDupPostTypes={this.onUpdateSortDupPostTypes}
                                                            onGetOpenPinModal={this.onGetOpenPinModal}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'duplicate'}>
                                                    <div id={uuidv4()}>
                                                        <BackendDuplicate
                                                            settings={this.state.settings}
                                                            roles={this.state.roles}
                                                            onUpdateSortDupOptionen={this.onUpdateSortDupOptionen}
                                                            onUpdateSortDupPostTypes={this.onUpdateSortDupPostTypes}
                                                            onGetOpenPinModal={this.onGetOpenPinModal}
                                                        />
                                                    </div>
                                                </Collapse>
                                            </CardBody>
                                        </Card>
                                    </div>

                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <hr/>
                </Container>
                <SetConfigPinModal
                    showPinModal={this.state.showPinModal}
                    configPin={this.state.configPin}
                    pinHandle={this.state.pinHandle}
                    setShowPinModal={this.setShowPinModal}
                    onSetConfigPin={this.onSetConfigPin}
                    sendFetchApi={this.sendFetchApi}
                />
                <DebugLogModal
                    showLogModal={this.state.showLogModal}
                    debugLogFile={this.state.debugLogFile}
                    setShowLogModal={this.setShowLogModal}
                    sendFetchApi={this.sendFetchApi}
                />
                <div id="snackbar-success"></div>
                <div id="snackbar-warning"></div>
            </Fragment>
        )
    }
}