import {Card, CardBody, Form, Row, Accordion, Col, Container, Button, Nav, Collapse} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../../utils/AppTools.js";
import AddSliderGalleryModal from "../../utils/AddSliderGalleryModal.jsx";
import SliderEdit from "./SliderEdit.jsx";
const {Component, Fragment} = wp.element;

const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            colStart: true,
            colEdit: false,
            triggerSliderGalleryModal: false,
            slider: [],
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
        this.getThemeSlider = this.getThemeSlider.bind(this);
        this.onSetSliderGallery = this.onSetSliderGallery.bind(this);
        this.onSetAddSliderGalleryModal = this.onSetAddSliderGalleryModal.bind(this);
        this.onDeleteSlider = this.onDeleteSlider.bind(this);
        this.onToggleSlider = this.onToggleSlider.bind(this);
        this.onGetEditSlider = this.onGetEditSlider.bind(this);
        this.onSetBreakpoint = this.onSetBreakpoint.bind(this);
        this.onSetSliderUpdates = this.onSetSliderUpdates.bind(this);
        this.onSetSortableBreakpoint = this.onSetSortableBreakpoint.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.triggerSliderGallery) {
            this.getThemeSlider()
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

            this.props.onSetTriggerSliderGallery(false)
        }
    }

    getThemeSlider() {
        let formData = {
            'method': 'get_theme_slider'
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

    onSetSliderGallery(e, type, padding = '') {
        let edit = this.state.edit;
        if(padding) {
            edit['padding'][type] = e;
        } else {
            edit[type] = e;
        }

        this.setState({
            edit: edit
        })
        if(this.state.edit.id) {
            this.setState({
                spinner: {
                    showAjaxWait: true
                }
            })
            this.onSetSliderUpdates(edit, 'update_slider')
        }
    }

    onSetAddSliderGalleryModal(state) {
        this.setState({
            triggerSliderGalleryModal: state
        })
    }

    onDeleteSlider(id, handle) {
        let formData = {
            'method': 'delete_slider_gallery',
            'id': id,
            'handle': handle
        }
        let swal = {
            'title': 'Slider löschen?',
            'btn': 'Slider löschen',
            'msg': 'Das Löschen kann nicht rückgängig gemacht werden.'
        };
        AppTools.swal_delete_modal(swal).then(result => {
            if(result) {
                this.sendFetchApi(formData)
            }
        })
    }

    onGetEditSlider(id) {
        const slider = [...this.state.slider];
        const find = this.findArrayElementById(slider, id, 'id')
        if(find) {
            this.setState({
                edit: find,
            })
           this.onToggleSlider('edit')
        }
    }

    onSetSortableBreakpoint(state) {
        let edit = this.state.edit;
        edit.breakpoints = state;
        this.setState({
            edit: edit
        })
    }

    onSetBreakpoint(e, type, id, padding='') {
       let breakpoints = [...this.state.edit.breakpoints]
        const find = this.findArrayElementById(breakpoints, id, 'id');
       if(find){
           if(padding){
               find['padding'][type] = e;
           } else {
               find[type] = e;
           }

           let edit = this.state.edit;
           edit.breakpoints = breakpoints;
           this.setState({
               edit: edit,
               spinner: {
                   showAjaxWait: true
               }
           })
           this.onSetSliderUpdates(edit, 'update_slider')
       }
    }

    onSetSliderUpdates(data, method) {
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



    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_theme_slider':
                    if (data.status) {
                        this.setState({
                            slider: data.slider,
                            edit: {},
                        })
                    }
                    break;
                case 'add_slider_gallery':
                     if(data.status) {
                         this.setState({
                             slider: [...this.state.slider, data.record],
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
                             slider: this.filterArrayElementById([...this.state.slider], data.id, 'id')
                         })
                         AppTools.success_message(data.msg);
                     } else {
                         AppTools.warning_message(data.msg)
                     }
                    break;
                case 'add_breakpoint':
                    if(data.status){
                       const slider = [...this.state.slider];
                       const find = this.findArrayElementById(slider, data.id, 'id');
                       if(find) {
                           find.breakpoints = [...find.breakpoints, data.breakpoint];
                           this.setState({
                               slider: slider
                           })
                       }
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_breakpoint':
                    if(data.status){
                        const slider = [...this.state.slider];
                        const find = this.findArrayElementById(slider, data.id, 'id');
                        if(find) {
                            find.breakpoints = this.filterArrayElementById([...find.breakpoints], data.breakpoint, 'id');
                            this.setState({
                                slider: slider
                            })
                        }
                        AppTools.success_message(data.msg);
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'update_slider':
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
                            Theme Slider
                        </h6>
                        <hr/>
                        <Collapse
                            in={this.state.colStart}>
                            <div id={uuidv4()}>
                                <Button variant="success"
                                        size={'sm'}
                                        onClick={() => this.setState({edit: {}, triggerSliderGalleryModal: true})}>
                                    <i className="bi bi-node-plus me-2"></i>
                                    Slider erstellen
                                </Button>
                                <hr/>
                                {this.state.slider.length ?
                                    <div className="overview-grid">
                                        {this.state.slider.map((s, i) => {
                                            return (
                                                <div
                                                    className="overview-item border shadow rounded  mx-sm-auto text-center position-relative"
                                                    key={i}>
                                                    <div onClick={() => this.onGetEditSlider(s.id)}
                                                         title="bearbeiten"
                                                         className="p-2 d-flex flex-column align-items-center cursor-pointer h-100 ">
                                                        <i className="bi bi-arrow-left-right mb-3 fs-4"></i>
                                                        <div>{s.designation}</div>
                                                    </div>
                                                    <small className="position-absolute hover-scale top-0 end-0 mt-1 me-1">
                                                        <i onClick={() => {this.onDeleteSlider(s.id, 'slider')}}
                                                           title="löschen" className="bi bi-trash  cursor-pointer text-danger"></i>
                                                    </small>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    : <div className="fs-6">
                                        <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                                        keine Slider vorhanden
                                    </div>}
                            </div>
                        </Collapse>
                        <Collapse
                            in={this.state.colEdit}>
                            <div id={uuidv4()}>
                                <SliderEdit
                                  edit={this.state.edit}
                                  spinner={this.state.spinner}
                                  onToggleSlider={this.onToggleSlider}
                                  onSetSliderGallery={this.onSetSliderGallery}
                                  onSetBreakpoint={this.onSetBreakpoint}
                                  sendFetchApi={this.sendFetchApi}
                                  onSetSortableBreakpoint={this.onSetSortableBreakpoint}
                                />
                            </div>
                        </Collapse>

                    </CardBody>
                </Card>
                <AddSliderGalleryModal
                    handle={'slider'}
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