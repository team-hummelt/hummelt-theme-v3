import {Card, CardBody, Form, Row, Accordion, Col, Container, Button, Nav, Collapse} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../../utils/AppTools.js";
import AddSliderGalleryModal from "../../utils/AddSliderGalleryModal.jsx";
const {Component, Fragment} = wp.element;
import EditGallery from "./EditGallery.jsx";
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Gallery extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            colStart: true,
            colEdit: false,
            triggerSliderGalleryModal: false,
            gallery: [],
            animateSelects: [],
            mediaSizeSelects: [],
            edit: {},
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        this.sendFetchApi = this.sendFetchApi.bind(this);

        this.onToggleSlider = this.onToggleSlider.bind(this);
        this.onSetAddSliderGalleryModal = this.onSetAddSliderGalleryModal.bind(this);
        this.onDeleteGallery = this.onDeleteGallery.bind(this);
        this.onSetSliderGallery = this.onSetSliderGallery.bind(this);
        this.onSetGalleryUpdates = this.onSetGalleryUpdates.bind(this);
        this.getThemeGallery = this.getThemeGallery.bind(this);
        this.onGetEditGallery = this.onGetEditGallery.bind(this);
        this.onSetBreakpoint = this.onSetBreakpoint.bind(this);


    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.triggerGallery) {
            this.getThemeGallery();
            this.setState({
                edit: {},
                colStart: true,
                colEdit: false,
                spinner: {
                    showAjaxWait: false,
                    ajaxMsg: '',
                    ajaxStatus: ''
                },
            })
            this.props.onSetTriggerGallery(false)
        }
    }

    getThemeGallery() {
        let formData = {
            'method': 'get_theme_gallery'
        }
        this.sendFetchApi(formData)
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

    onSetAddSliderGalleryModal(state) {
        this.setState({
            triggerSliderGalleryModal: state
        })
    }

    onSetSliderGallery(e, type) {
        let edit = this.state.edit;
        edit[type] = e;

        this.setState({
            edit: edit
        })
        if(this.state.edit.id) {
            this.setState({
                spinner: {
                    showAjaxWait: true
                }
            })
            this.onSetGalleryUpdates(edit, 'update_gallery')
        }
    }

    onSetGalleryUpdates(data, method) {
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': method,
                'data': JSON.stringify(data),
                'id': _this.state.edit.id
            }
            _this.sendFetchApi(formData)
        }, 1000);
    }

    onDeleteGallery(id, handle) {
        let formData = {
            'method': 'delete_slider_gallery',
            'id': id,
            'handle': handle
        }
        let swal = {
            'title': 'Galerie löschen?',
            'btn': 'Galerie löschen',
            'msg': 'Das Löschen kann nicht rückgängig gemacht werden.'
        };
        AppTools.swal_delete_modal(swal).then(result => {
            if(result) {
                this.sendFetchApi(formData)
            }
        })
    }

    onGetEditGallery(id) {
        const gallery = [...this.state.gallery]
        const find = this.findArrayElementById(gallery, id, 'id');
        if(find) {
            this.setState({
                edit: find,
            })
            this.onToggleSlider('edit')
        }
    }

    onSetBreakpoint(e, type, id) {
       const breakpoints = this.state.edit.breakpoints;
       breakpoints[id][type] = e;
        let edit = this.state.edit;
        edit.breakpoints = breakpoints;
        this.setState({
            edit: edit
        })
        this.onSetGalleryUpdates(edit, 'update_gallery')
    }

    onToggleSlider(target, reset = false) {
        let start = false;
        let edit = false;
        switch (target){
            case'start':
                start = true;
                break;
            case 'edit':
                edit = true;
                break;
        }
        this.setState({
            colStart: start,
            colEdit: edit,
        })
        if(reset) {
            this.setState({
                edit: {}
            })
        }
    }

    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_theme_gallery':
                    if (data.status) {
                        this.setState({
                            gallery: data.gallery,
                            animateSelects: data.animate_selects,
                            mediaSizeSelects: data.select_media_size,
                            edit: {},
                        })
                    }
                    break;
                case 'add_slider_gallery':
                    if(data.status) {
                        this.setState({
                            gallery: [...this.state.gallery, data.record],
                            triggerSliderGalleryModal: false,
                            edit: {}
                        })
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_slider_gallery':
                    if(data.status){
                        this.setState({
                            gallery: this.filterArrayElementById([...this.state.gallery], data.id, 'id')
                        })
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'update_gallery':
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        },
                    })
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
                <Card className="shadow-sm my-2">
                    <CardBody>
                        <h6>
                            <i className="bi bi-arrow-right-short me-1"></i>
                            Theme Galerie
                        </h6>
                        <hr/>
                        <Collapse
                            in={this.state.colStart}>
                            <div id={uuidv4()}>
                                <Button variant="success"
                                        size={'sm'}
                                        onClick={() => this.setState({edit: {}, triggerSliderGalleryModal: true})}>
                                    <i className="bi bi-node-plus me-2"></i>
                                    Galerie erstellen
                                </Button>
                                <hr/>
                                {this.state.gallery.length ?
                                    <div className="overview-grid">
                                        {this.state.gallery.map((g, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="overview-item border rounded  mx-sm-auto text-center position-relative">
                                                    <div
                                                        title='Bearbeiten'
                                                        onClick={() => this.onGetEditGallery(g.id)}
                                                        className="p-2 d-flex flex-column align-items-center cursor-pointer h-100 ">
                                                        <i className="bi bi-images mb-3 fs-4"></i>
                                                        <div>{g.designation}</div>
                                                    </div>
                                                    <small
                                                        onClick={() => this.onDeleteGallery(g.id, 'gallery')}
                                                        className="position-absolute hover-scale top-0 end-0 mt-1 me-1">
                                                        <i title='löschen' className="bi bi-trash  cursor-pointer text-danger"></i>
                                                    </small>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    :
                                    <div className="fs-6">
                                        <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                                        keine Galerie vorhanden
                                    </div>
                                }
                            </div>
                        </Collapse>
                        <Collapse
                            in={this.state.colEdit}>
                            <div id={uuidv4()}>
                                <EditGallery
                                    edit={this.state.edit}
                                    spinner={this.state.spinner}
                                    animateSelects={this.state.animateSelects}
                                    mediaSizeSelects={this.state.mediaSizeSelects}
                                    onSetSliderGallery={this.onSetSliderGallery}
                                    onToggleSlider={this.onToggleSlider}
                                    onSetBreakpoint={this.onSetBreakpoint}
                                />
                            </div>
                        </Collapse>
                    </CardBody>
                </Card>

                <AddSliderGalleryModal
                    handle={'gallery'}
                    edit={this.state.edit}
                    triggerSliderGalleryModal={this.state.triggerSliderGalleryModal}
                    onSetAddSliderGalleryModal={this.onSetAddSliderGalleryModal}
                    onSetSliderGallery={this.onSetSliderGallery}
                    sendFetchApi={this.sendFetchApi}
                />

            </Fragment>
        )
    }


}