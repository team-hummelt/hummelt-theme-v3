import ApiErrorAlert from "./utils/ApiErrorAlert.jsx";
import {Card, CardBody, CardHeader, Collapse, Container} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";
import MapDatenschutz from "./components/MapDatenschutz.jsx";
import GmapsApi from "./components/GmapsApi.jsx";
import Leaflet from "./components/Leaflet.jsx";
import Slider from "./components/Slider/Slider.jsx";
import Gallery from "./components/Gallery/Gallery.jsx";
import SetAjaxResponse from "./utils/SetAjaxResponse.jsx";
import CustomFields from "./components/CustomFields/CustomFields.jsx";
import TopArea from "./components/TopArea.jsx";
import Aktionsbanner from "./components/Aktionsbanner.jsx";
import * as AppTools from "./utils/AppTools";

const {Component, Fragment} = wp.element;

let lastKnownScrollPosition = 0;
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class App extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            selectedCat: '',
            selectedSub: '',
            selectedFirstId: '',
            selectedSubId: '',
            collapsedId: '',
            stickyTop: false,
            sideVarWrapperHeight: 0,
            wpBarHeight: 'auto',
            showApiError: false,
            apiErrorMsg: '',
            triggerSliderGallery: false,
            triggerGallery: false,
            menu: [],
            pages: [],
            post_types: [],
            posts: [],
            topArea: [],
            osm_tile_layers: [],
            aktionsBanner: {},
            settings: {
                google_maps_datenschutz: [],
                google_maps: {},
            },
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
            triggerMapDs: false,
            triggerOsmLeafletModal: false,
            triggerLeafletEdit: false,
            triggerCustomFields: false,
        }
        this.urlSearchParam = this.urlSearchParam.bind(this);
        //Leaflet
        this.onSetAddEditLeafletModal = this.onSetAddEditLeafletModal.bind(this);
        this.omSetTriggerLeafletEdit = this.omSetTriggerLeafletEdit.bind(this);
        this.onAddLeafletPin = this.onAddLeafletPin.bind(this);
        this.onSetPinEdit = this.onSetPinEdit.bind(this);
        this.sendOptionFormData = this.sendOptionFormData.bind(this);
        this.onDeleteLeafletPin = this.onDeleteLeafletPin.bind(this);
        this.onSetLeafletHandle = this.onSetLeafletHandle.bind(this);
        this.onSetTriggerSliderGallery = this.onSetTriggerSliderGallery.bind(this);
        this.onSetTriggerGallery = this.onSetTriggerGallery.bind(this);
        this.onSetTriggerCustomFields = this.onSetTriggerCustomFields.bind(this);

        this.onSetTopArea = this.onSetTopArea.bind(this);
        this.onSetSortableTopArea = this.onSetSortableTopArea.bind(this);
        this.onUpdateSortableTopArea = this.onUpdateSortableTopArea.bind(this);
        this.onSetAktionsBanner = this.onSetAktionsBanner.bind(this);

        this.onSetTriggerMapDs = this.onSetTriggerMapDs.bind(this);
        this.onSetGMapsApi = this.onSetGMapsApi.bind(this);
        this.onSetGmapsPins = this.onSetGmapsPins.bind(this);
        this.onDeleteGmapsPin = this.onDeleteGmapsPin.bind(this);
        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);


        this.sendFetchApi = this.sendFetchApi.bind(this);
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
            'method': 'get_theme_tools_plugins',
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

    onSetTriggerCustomFields(state) {
        this.setState({
            triggerCustomFields: state
        })
    }

    onSetTriggerSliderGallery(state) {
        this.setState({
            triggerSliderGallery: state
        })
    }

    onSetTriggerGallery(state) {
        this.setState({
            triggerGallery: state
        })
    }

    onSetTriggerMapDs(state) {
        this.setState({
            triggerMapDs: state
        })
    }

    onSetAddEditLeafletModal(state) {
        this.setState({
            triggerOsmLeafletModal: state
        })
    }

    omSetTriggerLeafletEdit(state) {
        this.setState({
            triggerLeafletEdit: state
        })
    }

    onSetGMapsApi(e, type) {
        let settings = this.state.settings;
        let google_maps_api = settings.google_maps_api;
        google_maps_api[type] = e;
        settings.google_maps_api = google_maps_api;
        this.setState({
            settings: settings
        })
    }

    onSetGmapsPins(e, type, id) {
        const pins = [...this.state.settings.google_maps_api.map_pins]
        const find = this.findArrayElementById(pins, id, 'id');
        let settings = this.state.settings;
        settings.google_maps_api.map_pins = pins;
        if (find) {
            find[type] = e;
            this.setState({
                settings: settings
            })
        }
    }

    onDeleteGmapsPin(id) {
        let map_pins = this.filterArrayElementById([...this.state.settings.google_maps_api.map_pins], id, 'id');
        let settings = this.state.settings;
        settings.google_maps_api.map_pins = map_pins;
        this.setState({
            settings: settings
        })
    }

    onAddLeafletPin(pin, id) {
        const leaflet = [...this.state.settings.leaflet]
        const find = this.findArrayElementById(leaflet, id, 'id');
        if (find) {
            find.pins = [...find.pins, pin];
            let settings = this.state.settings;
            settings.leaflet = leaflet;
            this.setState({
                settings: settings
            })
        }
    }

    onDeleteLeafletPin(pinId, leafletId) {
        let swal = {
            'title': 'Pin löschen?',
            'btn': 'Pin löschen',
            'msg': 'Das Löschen kann nicht rückgängig gemacht werden!'
        }
        AppTools.swal_delete_modal(swal).then((result) => {
            if (result) {
                let formData = {
                    'method': 'delete_leaflet_pin',
                    'pin_id': pinId,
                    'leaflet_id': leafletId
                }
                this.sendFetchApi(formData)
            }
        })
    }

    onSetLeafletHandle(e, type, id) {
        const leaflet = [...this.state.settings.leaflet];
        const findLeaflet = this.findArrayElementById(leaflet, id, 'id');
        findLeaflet[type] = e;
        let settings = this.state.settings;
        settings.leaflet = leaflet;
        this.setState({
            settings: settings,

        })
        let formData = {
            'method': 'osm_leaflet_handle',
            'handle': 'update',
            'data': JSON.stringify(findLeaflet)
        }
        this.sendFetchApi(formData)
    }

    onSetPinEdit(e, type, pinId, leafletId) {
        const leaflet = [...this.state.settings.leaflet];
        const findLeaflet = this.findArrayElementById(leaflet, leafletId, 'id');
        if (findLeaflet) {
            const pins = [...findLeaflet.pins];
            const findPin = this.findArrayElementById(pins, pinId, 'id');
            if (findPin) {
                findPin[type] = e;
                findLeaflet.pins = pins;
                let settings = this.state.settings;
                settings.leaflet = leaflet;
                this.setState({
                    settings: settings,
                    spinner: {
                        showAjaxWait: true
                    }
                })
                let updateForm = {
                    'pin': findPin,
                    'leaflet_id': leafletId
                }

                this.sendOptionFormData(updateForm, 'leaflet_update_pin')

            }
        }
    }

    onSetAktionsBanner(e, type) {
        let settings = this.state.settings;
        let ab = settings.aktionsbanner;
        ab[type] = e;
        settings.aktionsbanner = ab;
        this.setState({
            settings: settings
        })

        this.sendOptionFormData(settings.aktionsbanner, 'update_aktionsbanner')
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
        }, 500);
    }

    onSetTopArea(e, type, slug) {
        let topArea = this.state.settings.theme_top_area;
        topArea[slug][type] = e;

        let settings = this.state.settings;
        settings.theme_top_area = topArea;
        this.setState({
            settings: settings
        })

        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_top_area',
                'slug': slug,
                'data': JSON.stringify(topArea[slug])
            }
            _this.sendFetchApi(formData)
        }, 1000);
    }

    onSetSortableTopArea(setState) {
        this.setState({
            topArea: setState
        })
    }

    onUpdateSortableTopArea() {
        sleep(50).then(() => {
            let formData = {
                'method': 'update_position_top_area',
                'data': JSON.stringify(this.state.topArea)
            }
            this.sendFetchApi(formData)
        })
    }


    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_theme_tools_plugins':
                    if (data.status) {
                        this.setState({
                            menu: data.menu,
                            settings: data.settings,
                            pages: data.pages,
                            topArea: data.top_area_widgets,
                            osm_tile_layers: data.osm_tile_layers,
                            post_types: data.post_types,
                            posts: data.posts
                        })
                    }
                    break;
                case 'maps_ds_handle':
                    if (data.status) {
                        console.log(data.handle)
                        if (data.handle === "insert") {
                            const dsSettings = [...this.state.settings.google_maps_datenschutz, data.record];
                            let settings = this.state.settings;
                            settings.google_maps_datenschutz = dsSettings;
                            this.setState({
                                settings: settings
                            })
                        }
                        this.setState({
                            triggerMapDs: true
                        })
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_ds':
                    if (data.status) {
                        let settings = this.state.settings;
                        settings.google_maps_datenschutz = this.filterArrayElementById([...settings.google_maps_datenschutz], data.id, 'id');
                        this.setState({
                            settings: settings
                        })
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'gmaps_add_api_pin':
                    if (data.status) {
                        const addPin = [...this.state.settings.google_maps_api.map_pins, data.record];
                        let settings = this.state.settings;
                        settings.google_maps_api.map_pins = addPin;
                        this.setState({
                            settings: settings
                        })
                    }
                    break;
                case 'gmaps_api_handle':
                    if (data.status) {
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'osm_leaflet_handle':
                    if (data.status) {
                        let settings = this.state.settings;
                        settings.leaflet = data.leaflet;
                        this.setState({
                            settings: settings,
                            triggerOsmLeafletModal: false
                        })
                        AppTools.success_message(data.msg)
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_osm_leaflet':
                    if (data.status) {
                        let settings = this.state.settings;
                        settings.leaflet = this.filterArrayElementById([...this.state.settings.leaflet], data.id, 'id');
                        this.setState({
                            settings: settings
                        })
                        AppTools.success_message(data.msg)
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'leaflet_update_pin':
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
                    break;
                case 'delete_leaflet_pin':
                    if (data.status) {
                        const leaflet = [...this.state.settings.leaflet];
                        const findLeaflet = this.findArrayElementById(leaflet, data.leaflet_id, 'id');
                        if (findLeaflet) {
                            findLeaflet.pins = this.filterArrayElementById([...findLeaflet.pins], data.pin_id, 'id')
                            let settings = this.state.settings;
                            settings.leaflet = leaflet;
                            this.setState({
                                settings: settings
                            })
                        }
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg);
                    }
                    break;
                case 'get_posts_by_type':
                        if(data.status) {
                            this.setState({
                                posts: data.posts
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


    urlSearchParam(search) {
        const authResult = new URLSearchParams(window.location.search);
        return authResult.get(search)
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
                                                                                    collapsedId: !m.sub.length ? m.id : m.first,
                                                                                    triggerMapDs: true,
                                                                                    triggerSliderGallery: m.id === 'medien-slider',
                                                                                    triggerCustomFields: m.id === 'custom-fields',
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
                                                                                                            collapsedId: s.id,
                                                                                                            triggerLeafletEdit: s.id === 'open-street-leaflet'
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
                                                    <div className="ms-auto">
                                                        <div
                                                            className={`ajax-spinner text-muted ${this.state.spinner.showAjaxWait ? 'wait' : ''}`}></div>
                                                        <small>
                                                            <SetAjaxResponse
                                                                status={this.state.spinner.ajaxStatus}
                                                                msg={this.state.spinner.ajaxMsg}
                                                            />
                                                        </small>
                                                    </div>
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
                                                    in={this.state.collapsedId === 'maps-ds'}>
                                                    <div id={uuidv4()}>
                                                        <MapDatenschutz
                                                            settings={this.state.settings}
                                                            triggerMapDs={this.state.triggerMapDs}
                                                            pages={this.state.pages}
                                                            sendFetchApi={this.sendFetchApi}
                                                            onSetTriggerMapDs={this.onSetTriggerMapDs}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'gmaps-api'}>
                                                    <div id={uuidv4()}>
                                                        <GmapsApi
                                                            settings={this.state.settings}
                                                            triggerMapDs={this.state.triggerMapDs}
                                                            pages={this.state.pages}
                                                            sendFetchApi={this.sendFetchApi}
                                                            onSetTriggerMapDs={this.onSetTriggerMapDs}
                                                            onSetGMapsApi={this.onSetGMapsApi}
                                                            onSetGmapsPins={this.onSetGmapsPins}
                                                            onDeleteGmapsPin={this.onDeleteGmapsPin}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'open-street-leaflet'}>
                                                    <div id={uuidv4()}>
                                                        <Leaflet
                                                            settings={this.state.settings}
                                                            triggerOsmLeafletModal={this.state.triggerOsmLeafletModal}
                                                            triggerLeafletEdit={this.state.triggerLeafletEdit}
                                                            osm_tile_layers={this.state.osm_tile_layers}
                                                            sendFetchApi={this.sendFetchApi}
                                                            onSetAddEditLeafletModal={this.onSetAddEditLeafletModal}
                                                            omSetTriggerLeafletEdit={this.omSetTriggerLeafletEdit}
                                                            onAddLeafletPin={this.onAddLeafletPin}
                                                            onSetPinEdit={this.onSetPinEdit}
                                                            onDeleteLeafletPin={this.onDeleteLeafletPin}
                                                            onSetLeafletHandle={this.onSetLeafletHandle}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'medien-gallery'}>
                                                    <div id={uuidv4()}>
                                                        <Gallery
                                                            triggerGallery={this.state.triggerGallery}
                                                            onSetTriggerGallery={this.onSetTriggerGallery}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'custom-fields'}>
                                                    <div id={uuidv4()}>
                                                        <CustomFields
                                                            triggerCustomFields={this.state.triggerCustomFields}
                                                            onSetTriggerCustomFields={this.onSetTriggerCustomFields}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'medien-slider'}>
                                                    <div id={uuidv4()}>
                                                        <Slider
                                                            triggerSliderGallery={this.state.triggerSliderGallery}
                                                            onSetTriggerSliderGallery={this.onSetTriggerSliderGallery}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'top-area'}>
                                                    <div id={uuidv4()}>
                                                        <TopArea
                                                            topArea={this.state.topArea}
                                                            settings={this.state.settings}
                                                            onSetTopArea={this.onSetTopArea}
                                                            onSetSortableTopArea={this.onSetSortableTopArea}
                                                            onUpdateSortableTopArea={this.onUpdateSortableTopArea}
                                                        />
                                                    </div>
                                                </Collapse>
                                                <Collapse
                                                    in={this.state.collapsedId === 'aktionsbanner'}>
                                                    <div id={uuidv4()}>
                                                        <Aktionsbanner
                                                            settings={this.state.settings}
                                                            post_types={this.state.post_types}
                                                            pages={this.state.pages}
                                                            posts={this.state.posts}
                                                            onSetAktionsBanner={this.onSetAktionsBanner}
                                                            sendFetchApi={this.sendFetchApi}
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
                <div id="snackbar-success"></div>
                <div id="snackbar-warning"></div>
            </Fragment>
        )
    }
}