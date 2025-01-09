import ApiErrorAlert from "../../utils/ApiErrorAlert.jsx";
import {Card, CardBody, Col, Container, Nav, Collapse} from "react-bootstrap";
import {v5 as uuidv5} from 'uuid';
import Home from "./components/Home.jsx";
import Plugins from "./components/Plugins.jsx";
import Import from "./components/Import.jsx";
const {Component, Fragment} = wp.element;
import * as AppTools from "../../utils/AppTools";
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            showApiError: false,
            apiErrorMsg: '',
            selectedNav: 'home',
            colHome: true,
            colPlugins: false,
            colImport: false,
            colLizenz: false,
            local: false,
            cron_active: false,
            license: {
                theme: {
                    aktiv: false,
                    license: ''
                },
                plugins: []
            }
        }

        this.sendFetchApi = this.sendFetchApi.bind(this);
        this.onSetApiError = this.onSetApiError.bind(this);
        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onSetThemeLicense = this.onSetThemeLicense.bind(this);
        this.onSetPluginLicense = this.onSetPluginLicense.bind(this);
        this.onActivatePlugin = this.onActivatePlugin.bind(this);
        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);

    }

    componentDidMount() {
        let formData = {
            'method': 'get_dashboard_settings',
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

    onSetApiError(state, reset = false) {
        let msg = '';
        reset ? msg = '' : msg = this.state.apiErrorMsg;
        this.setState({
            showApiError: state,
            msg: msg
        })
    }

    onToggleCollapse(target) {
        let home = false;
        let plugins = false;
        let importe = false;
        let lizenz = false;
        switch (target) {
            case 'home':
                home = true;
                break;
            case 'plugins':
                plugins = true;
                break;
            case 'importe':
                importe = true;
                break;
            case 'lizenz':
                lizenz = true;
                break;
        }

        this.setState({
            colHome: home,
            colPlugins: plugins,
            colImport: importe,
            colLizenz: lizenz,
            selectedNav: target
        })
    }

    onSetThemeLicense(e, type) {
        let themeLicense = this.state.license.theme;
        themeLicense[type] = e;
        let license = this.state.license;
        license.theme = themeLicense;
        this.setState({
            license: license
        })
    }

    onSetPluginLicense(e, type, slug) {
        const plugins = [...this.state.license.plugins]
        const find = this.findArrayElementById(plugins, slug, 'slug');
        if(find){
            find[type] = e;
        }
        let license = this.state.license;
        license.plugins = plugins;
        this.setState({
            license: license
        })
    }

    onActivatePlugin(id, slug) {
        const plugins = [...this.state.license.plugins]
        const find = this.findArrayElementById(plugins, slug, 'slug');
        if(find) {
            let formData = {
                'method': 'activate_plugin',
                'slug': slug,
                'id': id
            }
            this.sendFetchApi(formData)
        }
    }

    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_dashboard_settings':
                    if (data.status) {
                        this.setState({
                            license: data.license,
                            local: data.local,
                            cron_active: data.cron_aktiv
                        })
                    }
                    break;
                case 'activate_theme':
                     if(data.status) {
                         let license = this.state.license;
                         license.theme = data.record;
                         this.setState({
                             license: license
                         })
                         location.reload();
                        AppTools.success_message(data.msg)
                     } else {
                         AppTools.warning_message(data.msg)
                     }
                    break;
                case 'activate_plugin':
                    if(data.status) {
                        let license = this.state.license;
                        location.reload();
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
            <Container fluid={false}>
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
                        <Nav
                            onSelect={(selectedKey) => this.onToggleCollapse(selectedKey)}
                            variant="tabs"
                            activeKey={this.state.selectedNav}>
                            <Nav.Item>
                                <Nav.Link eventKey="home">Willkommen</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="plugins">Plugins</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="importe">Import</Nav.Link>
                            </Nav.Item>
                            {/*} <Nav.Item>
                                <Nav.Link eventKey="lizenz">Lizenzen</Nav.Link>
                            </Nav.Item> {*/}
                        </Nav>

                        <Collapse  in={this.state.colHome}>
                            <div id={uuidv5('colHome', v5NameSpace)}>
                                <div className="py-3 body-dashboard">
                                    <Home
                                        license={this.state.license}
                                        local={this.state.local}
                                        cron_active={this.state.cron_active}
                                        onSetThemeLicense={this.onSetThemeLicense}
                                        sendFetchApi={this.sendFetchApi}
                                    />
                                </div>
                            </div>
                        </Collapse>
                        <Collapse in={this.state.colPlugins}>
                            <div  id={uuidv5('colPlugins', v5NameSpace)}>
                                <div className="py-3 body-dashboard">
                                    <Plugins
                                        license={this.state.license}
                                        local={this.state.local}
                                        cron_active={this.state.cron_active}
                                        onSetPluginLicense={this.onSetPluginLicense}
                                        sendFetchApi={this.sendFetchApi}
                                    />
                                </div>
                            </div>
                        </Collapse>
                        <Collapse in={this.state.colImport}>
                            <div id={uuidv5('colImport', v5NameSpace)}>
                                <div className="py-3 body-dashboard">
                                    <Import/>
                                </div>
                            </div>
                        </Collapse>
                        <Collapse in={this.state.colLizenz}>
                            <div id={uuidv5('colLizenz', v5NameSpace)}>
                                <div className="py-3 body-dashboard">
                                    Lizenzen
                                </div>
                            </div>
                        </Collapse>

                        <div className="">

                        </div>
                    </CardBody>
                </Card>
            </Container>
        )
    }
}