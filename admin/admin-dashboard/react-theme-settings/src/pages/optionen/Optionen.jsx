import ApiErrorAlert from "../../utils/ApiErrorAlert.jsx";
import {Card, CardBody, Container, Nav, Collapse, CardHeader} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import Layout from "./components/Layout.jsx";
import ColorBg from "./components/ColorBg.jsx";
import ColorSonstige from "./components/ColorSonstige.jsx";
import ColorLoginPage from "./components/ColorLoginPage.jsx";
import ColorMenu from "./components/ColorMenu.jsx";
import ThemeFonts from "./components/ThemeFonts.jsx";
import FontBody from "./components/FontBody.jsx";
import FontHeadline from "./components/FontHeadline.jsx";
import FontTopArea from "./components/FontTopArea.jsx";
import Info from "./components/Info.jsx";
import LogoFavicon from "./components/LogoFavicon.jsx";
import Reset from "./components/Reset.jsx";
import Sitemap from "./components/Sitemap.jsx";
import Templates from "./components/Templates.jsx";
import WpOptionen from "./components/WpOptionen.jsx";
import Gutenberg from "./components/Gutenberg.jsx";
import * as AppTools from "../../utils/AppTools";

import SetAjaxResponse from "../../utils/SetAjaxResponse.jsx";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
let lastKnownScrollPosition = 0;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Optionen extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            selectedCat: 'Allgemein',
            selectedSub: 'Layout',
            selectedFirstId: 'allgemein',
            selectedSubId: 'layout',
            collapsedId: 'layout',
            showApiError: false,
            stickyTop: false,
            sideVarWrapperHeight: 0,
            wpBarHeight: 'auto',
            apiErrorMsg: '',
            settings: {},
            menu: [],
            capabilities: [],
            selectUserRole: [],
            fonts: [],
            adobe_fonts: [],
            triggerFonts: false,
            schriftStilSelect: [],
            showColorModal: false,
            selects: {
                footer: [],
                header: [],
                pages: [],
                sidebar: [],
                breakpoints: []
            },
            editor: {
                palette: [],
                layout: []
            },
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }
        this.sendFetchApi = this.sendFetchApi.bind(this);
        this.onSetApiError = this.onSetApiError.bind(this);

        this.onSetThemeGeneral = this.onSetThemeGeneral.bind(this);
        this.onSetWpOptionen = this.onSetWpOptionen.bind(this);
        this.onSetThemeDesignColor = this.onSetThemeDesignColor.bind(this);
        this.onSetTriggerFonts = this.onSetTriggerFonts.bind(this);
        this.onSetFontSettings = this.onSetFontSettings.bind(this);
        this.onUpdateTemplateOptionen = this.onUpdateTemplateOptionen.bind(this);

        //Gutenberg
        this.onUpdateEditorLayout = this.onUpdateEditorLayout.bind(this);
        this.onUpdateEditorColor = this.onUpdateEditorColor.bind(this);
        this.onDeleteEditorColor = this.onDeleteEditorColor.bind(this);
        this.onSetShowModal = this.onSetShowModal.bind(this);


        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        this.sendOptionFormData = this.sendOptionFormData.bind(this);
        this.onAddUploadFont = this.onAddUploadFont.bind(this);
        this.onSetAdobeFontEdit = this.onSetAdobeFontEdit.bind(this);
        this.onUpdateSitemap = this.onUpdateSitemap.bind(this);

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

    onSetTriggerFonts(state) {
        this.setState({
            triggerFonts: state
        })
    }

    onAddUploadFont(data) {

        const fonts = [...this.state.fonts]
        const findFont = this.findArrayElementById(fonts, data.id, 'id')
        if (findFont) {
            findFont.fontData = data.fontData;
            findFont.fontInfo = data.fontInfo;
            findFont.isTtf = data.isTtf;
            findFont.isWoff = data.isWoff;
            findFont.isWoff2 = data.isWoff2;
            findFont.localName = data.localName;
            this.setState({
                fonts: fonts
            })
        } else {
            this.setState({
                fonts: [...this.state.fonts, data]
            })
        }
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
            'method': 'get_optionen_settings',
        }
        this.sendFetchApi(formData);
    }


    onToggleContent(target) {
        let layout = false;
        switch (target) {
            case 'layout':
                layout = true;
                break;
        }

        this.setState({
            colLayout: layout
        })
    }

    onUpdateSitemap() {
        let formData = {
            'method': 'update_sitemap'
        }
        this.sendFetchApi(formData)
    }

    onSetThemeGeneral(e, type) {
        let settingsGeneral = this.state.settings.theme_wp_general;
        settingsGeneral[type] = e;
        let settings = this.state.settings;
        settings.theme_wp_general = settingsGeneral;

        this.setState({
            settings: settings,
            spinner: {
                showAjaxWait: true
            }
        })
        this.sendOptionFormData(settingsGeneral, 'set_general_options')
    }

    onSetWpOptionen(e, type, handle) {
        let updSettings = this.state.settings[handle];
        updSettings[type] = e;
        let settings = this.state.settings;
        settings[handle] = updSettings;
        this.setState({
            settings: settings,
            spinner: {
                showAjaxWait: true
            }
        })
        let updForm = {
            'theme_capabilities': settings.theme_capabilities,
            'theme_wp_optionen': settings.theme_wp_optionen,
        }
        this.sendOptionFormData(updForm, 'set_wp_options')
    }

    onSetThemeDesignColor(e, type) {
        let updSettings = this.state.settings.theme_design.theme_color;
        updSettings[type] = e;
        let settings = this.state.settings;
        settings.theme_design.theme_color = updSettings;
        this.setState({
            settings: settings,
            spinner: {
                showAjaxWait: true
            }
        })

        this.sendOptionFormData(updSettings, 'set_theme_colors')
    }

    onSetFontSettings(e, type, id, handle) {
        const design = [...this.state.settings.theme_design[handle]]
        const find = this.findArrayElementById(design, id, 'id')
        find[type] = e;
        if (type === 'font-family') {
            find.stil_select = [];
            find['font-style'] = '';
        }
        let settings = this.state.settings;
        settings.theme_design[handle] = design;
        this.setState({
            settings: settings,
            spinner: {
                showAjaxWait: true
            }
        })

        if (type === 'font-family') {
            if (e) {
                let formSelect = {
                    'method': 'get_font_style',
                    'family': parseInt(e),
                    'handle': handle,
                    'id': id
                }
                this.sendFetchApi(formSelect)
            }
        }
        let formData = {
            'font': find,
            'id': id,
            'handle': handle
        }

        this.sendOptionFormData(formData, 'set_theme_fonts')
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

    onUpdateTemplateOptionen(e, type, id = 0) {
        let settingsGeneral = this.state.settings.theme_wp_general;
        let settings = this.state.settings;
        if (id) {
            const settingsCat = [...settingsGeneral.template_options]
            const findCat = this.findArrayElementById(settingsCat, id, 'id');
            findCat[type] = e;
            settings.theme_wp_general.template_options = settingsCat;
            this.setState({
                settings: settings,
                spinner: {
                    showAjaxWait: true
                }
            })
            this.sendOptionFormData(settings.theme_wp_general, 'set_general_options')
        } else {
            settingsGeneral[type] = e;

            settings.theme_wp_general = settingsGeneral;

            this.setState({
                settings: settings,
                spinner: {
                    showAjaxWait: true
                }
            })
            this.sendOptionFormData(settingsGeneral, 'set_general_options')
        }
    }

    onUpdateEditorLayout(e, type) {
        let layout = this.state.editor.layout;
        layout[type] = e;
        let editor = this.state.editor;
        editor.layout = layout;
        this.setState({
            editor: editor,
            spinner: {
                showAjaxWait: true
            }
        })
        this.sendOptionFormData(editor.layout, 'set_editor_layout')
    }


    onUpdateEditorColor(color, slug) {
        let palette = [...this.state.editor.palette];
        let find = this.findArrayElementById(palette, slug, 'slug');
        find.color = color;
        let editor = this.state.editor;
        editor.palette = palette;
        this.setState({
            editor: editor,
            spinner: {
                showAjaxWait: true
            }
        })

        let formData = {
            'method': 'gutenberg_color_handle',
            'handle': 'update',
            'slug': find.slug,
            'bezeichnung': find.name,
            'color': color
        }
        this.sendFetchApi(formData);
    }

    onDeleteEditorColor(slug) {
        let swal = {
            'title': 'Farbe löschen?',
            'btn': 'Farbe löschen',
            'msg': 'Das löschen kann nicht rückgängig gemacht werden!'
        };

        AppTools.swal_delete_modal(swal).then((result) => {
            if (result) {
                let formData = {
                    'method': 'delete_gutenberg_color',
                    'slug': slug
                }
                this.sendFetchApi(formData)
            }
        })
    }


    onSetShowModal(state) {
        this.setState({
            showColorModal: state
        })
    }

    onSetAdobeFontEdit(e, type, id) {
        const fonts = this.state.fonts;
        const find = this.findArrayElementById(fonts, id, 'id')
        find.fontInfo[type] = e;
        this.setState({
            fonts:  fonts
        })

        let formData = {
            'method': 'update_adobe_fonts',
            'id': id,
            'type': type,
            'value': e
        }
        this.sendFetchApi(formData)
    }


    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_optionen_settings':
                    if (data.status) {
                        this.setState({
                            settings: data.record,
                            menu: data.menu,
                            capabilities: data.capabilities,
                            selectUserRole: data.select_user_role,
                            fonts: data.fonts,
                            adobe_fonts: data.adobe_fonts,
                            selects: data.selects,
                            editor: data.editor
                        })
                    }
                    break;
                case 'set_general_options':
                case 'set_wp_options':
                case 'set_theme_colors':
                case 'set_theme_fonts':
                case 'set_editor_layout':
                case 'update_sitemap':
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
                    break;
                case 'font_edit':
                    if (data.status) {
                        this.setState({
                            triggerFonts: true
                        })
                    }
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
                    break;
                case 'delete_font':
                    if (data.status) {
                        this.setState({
                            fonts: this.filterArrayElementById([...this.state.fonts], data.id, 'id')
                        })
                    }
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
                    break;
                case 'get_font_style':
                    if (data.status) {
                        const design = [...this.state.settings.theme_design[data.handle]]
                        const find = this.findArrayElementById(design, data.id, 'id')
                        find.stil_select = data.record;
                        let settings = this.state.settings;
                        settings.theme_design.stil_select = design;
                        this.setState({
                            settings: settings
                        })
                    }
                    break;
                case 'gutenberg_color_handle':
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
                    if (data.status) {
                        let editor = this.state.editor;
                        editor.palette = data.palette;
                        this.setState({
                            editor: editor,
                            showColorModal: false
                        })
                    }
                    break;
                case 'delete_gutenberg_color':
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
                    if (data.status) {
                        let palette = this.filterArrayElementById([...this.state.editor.palette], data.slug, 'slug');
                        let editor = this.state.editor;
                        editor.palette = palette;
                        this.setState({
                            editor: editor
                        })
                    }
                    break;
                case 'reset_gutenberg_settings':
                    if (data.status) {
                        this.setState({
                            editor: data.editor,
                            spinner: {
                                showAjaxWait: false,
                                ajaxMsg: data.msg,
                                ajaxStatus: data.status
                            },
                        })
                    }
                    break;
                case 'import_adobe_font':
                     if(data.status){
                         this.setState({
                             fonts: [...this.state.fonts, data.record],
                             triggerFonts: true
                         })
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
                                                                <Fragment key={i}>
                                                                    <div
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
                                                                </Fragment>
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
                                                in={this.state.collapsedId === 'layout'}>
                                                <div id={uuidv4()}>
                                                    <Layout
                                                        settings={this.state.settings}
                                                        selects={this.state.selects}
                                                        onSetThemeGeneral={this.onSetThemeGeneral}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'logo-favicon'}>
                                                <div id={uuidv4()}>
                                                    <LogoFavicon
                                                        settings={this.state.settings}
                                                        selects={this.state.selects}
                                                        onSetThemeGeneral={this.onSetThemeGeneral}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'template-einstellungen'}>
                                                <div id={uuidv4()}>
                                                    <Templates
                                                        settings={this.state.settings}
                                                        selects={this.state.selects}
                                                        onUpdateTemplateOptionen={this.onUpdateTemplateOptionen}
                                                        onUpdateSitemap={this.onUpdateSitemap}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'headlines'}>
                                                <div id={uuidv4()}>
                                                    <FontHeadline
                                                        settings={this.state.settings}
                                                        fonts={this.state.fonts}
                                                        schriftStilSelect={this.state.schriftStilSelect}
                                                        onSetFontSettings={this.onSetFontSettings}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'body'}>
                                                <div id={uuidv4()}>
                                                    <FontBody
                                                        settings={this.state.settings}
                                                        fonts={this.state.fonts}
                                                        schriftStilSelect={this.state.schriftStilSelect}
                                                        onSetFontSettings={this.onSetFontSettings}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'top-area'}>
                                                <div id={uuidv4()}>
                                                    <FontTopArea
                                                        settings={this.state.settings}
                                                        fonts={this.state.fonts}
                                                        schriftStilSelect={this.state.schriftStilSelect}
                                                        onSetFontSettings={this.onSetFontSettings}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'fonts'}>
                                                <div id={uuidv4()}>
                                                    <ThemeFonts
                                                        settings={this.state.settings}
                                                        fonts={this.state.fonts}
                                                        adobe_fonts={this.state.adobe_fonts}
                                                        triggerFonts={this.state.triggerFonts}
                                                        sendFetchApi={this.sendFetchApi}
                                                        onSetTriggerFonts={this.onSetTriggerFonts}
                                                        onAddUploadFont={this.onAddUploadFont}
                                                        onSetAdobeFontEdit={this.onSetAdobeFontEdit}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'bg-color'}>
                                                <div id={uuidv4()}>
                                                    <ColorBg
                                                        settings={this.state.settings}
                                                        onSetThemeDesignColor={this.onSetThemeDesignColor}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'menu-color'}>
                                                <div id={uuidv4()}>
                                                    <ColorMenu
                                                        settings={this.state.settings}
                                                        onSetThemeDesignColor={this.onSetThemeDesignColor}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'login-seite'}>
                                                <div id={uuidv4()}>
                                                    <ColorLoginPage
                                                        settings={this.state.settings}
                                                        onSetThemeDesignColor={this.onSetThemeDesignColor}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'sonstige'}>
                                                <div id={uuidv4()}>
                                                    <ColorSonstige
                                                        settings={this.state.settings}
                                                        onSetThemeDesignColor={this.onSetThemeDesignColor}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'gutenberg'}>
                                                <div id={uuidv4()}>
                                                    <Gutenberg
                                                        settings={this.state.settings}
                                                        editor={this.state.editor}
                                                        showColorModal={this.state.showColorModal}
                                                        onUpdateEditorLayout={this.onUpdateEditorLayout}
                                                        onUpdateEditorColor={this.onUpdateEditorColor}
                                                        onDeleteEditorColor={this.onDeleteEditorColor}
                                                        onSetShowModal={this.onSetShowModal}
                                                        sendFetchApi={this.sendFetchApi}
                                                    />
                                                </div>
                                            </Collapse>
                                            <Collapse
                                                in={this.state.collapsedId === 'optionen'}>
                                                <div id={uuidv4()}>
                                                    <WpOptionen
                                                        settings={this.state.settings}
                                                        capabilities={this.state.capabilities}
                                                        selectUserRole={this.state.selectUserRole}
                                                        onSetWpOptionen={this.onSetWpOptionen}
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

            </Container>
        )
    }
}