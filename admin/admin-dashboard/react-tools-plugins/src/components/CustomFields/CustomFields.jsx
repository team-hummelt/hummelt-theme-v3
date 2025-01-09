import {Card, CardBody, Form, Row, Accordion, Col, Container, Button, Nav, Collapse} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../../utils/AppTools.js";
import AddCustomFieldModal from "./AddCustomFieldModal.jsx";
import CustomFieldLoop from "./CustomFieldLoop.jsx";


const {Component, Fragment} = wp.element;

const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class CustomFields extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            addCustomFieldModal: false,
            customFields: [],
            selectTypes: [],
            id: '',
            addCustomField: {
                designation: '',
                type: ''
            },
            spinner: {
                showAjaxWait: false,
                ajaxMsg: '',
                ajaxStatus: ''
            },
        }

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        this.sendFetchApi = this.sendFetchApi.bind(this);

        this.getCustomFields = this.getCustomFields.bind(this);
        this.setShowAddCustomFieldModal = this.setShowAddCustomFieldModal.bind(this);
        this.onSetAddCustomFieldValue = this.onSetAddCustomFieldValue.bind(this);
        this.setSaveAjax = this.setSaveAjax.bind(this);
        this.onSetValue = this.onSetValue.bind(this);
        this.onSetCustomSortable = this.onSetCustomSortable.bind(this);
        this.onUpdateSortable = this.onUpdateSortable.bind(this);
        this.onDeleteCustomField = this.onDeleteCustomField.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.triggerCustomFields) {
             this.getCustomFields();
             this.setState({
                 spinner: {
                     showAjaxWait: false,
                     ajaxMsg: '',
                     ajaxStatus: ''
                 },
                 addCustomField: {
                     designation: '',
                     type: ''
                 },
             })
            this.props.onSetTriggerCustomFields(false);
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

    setSaveAjax(data, method, id=''){
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': method,
                'custom': JSON.stringify(data),
                'id': id
            }
            _this.sendFetchApi(formData)
        }, 1000);
    }

    getCustomFields() {
        let formData = {
            'method': 'get_custom_fields'
        }
        this.sendFetchApi(formData)
    }

    onSetAddCustomFieldValue(e, type) {
        let addCustomField = this.state.addCustomField;
        addCustomField[type] = e;
        this.setState({
            addCustomField: addCustomField
        })
    }

    setShowAddCustomFieldModal(state) {
        this.setState({
            addCustomFieldModal: state
        })
    }

    onSetValue(e, type , id) {
        const edit = [...this.state.customFields]
        const find = this.findArrayElementById(edit, id, 'id');
        if(find) {
            find[type] = e;
            this.setState({
                customFields: edit,
                spinner: {
                    showAjaxWait: true
                }
            })

            this.setSaveAjax(this.state.customFields, 'update_custom_field', id)
        } else {
            AppTools.warning_message('Element nicht gefunden')
        }
    }

    onSetCustomSortable(newState) {
        this.setState({
            customFields: newState
        })
    }

    onUpdateSortable() {
        this.setState({
            spinner: {
                showAjaxWait: true
            }
        })
        sleep(50).then(() => {
            this.setSaveAjax(this.state.customFields, 'update_custom_field')
        })
    }

    onDeleteCustomField(id) {
        let swal = {
            'title': `Feld löschen?`,
            'msg': 'Das Löschen kann nicht rückgängig gemacht werden.',
            'btn': 'Feld löschen'
        }
        let formData = {
            'method': 'delete_custom_field',
            'field_id': id,
        }
        AppTools.swal_delete_modal(swal).then(result => {
            if(result){
                this.sendFetchApi(formData)
            }
        })
    }


    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_custom_fields':
                    if (data.status) {
                        this.setState({
                            customFields: data.custom_fields,
                            selectTypes: data.select_custom_types,
                            edit: {},
                        })
                    }
                    break;
                case 'add_custom_field':
                    if (data.status) {
                        this.setState({
                            customFields: [...this.state.customFields, data.record],
                            addCustomFieldModal: false,
                            addCustomField: {
                                designation: '',
                                type: ''
                            },
                        })
                        AppTools.success_message(data.msg)
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'update_custom_field':
                    this.setState({
                        spinner: {
                            showAjaxWait: false,
                            ajaxMsg: data.msg,
                            ajaxStatus: data.status
                        }
                    })
                    if(data.id && data.slug) {
                       const customFields = [...this.state.customFields];
                       const find = this.findArrayElementById(customFields, data.id, 'id');
                       if(find){
                           find.slug = data.slug;
                           this.setState({
                               customFields: customFields
                           })
                       }
                    }
                    break;
                case 'delete_custom_field':
                     if(data.status) {
                         this.setState({
                             customFields: this.filterArrayElementById([...this.state.customFields], data.id, 'id')
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
            <Fragment>
                <Card className="shadow-sm my-2">
                    <CardBody>
                        <h6>
                            <i className="bi bi-arrow-right-short me-1"></i>
                            Custom Fields
                        </h6>
                        <hr/>
                        <Button
                            onClick={() => this.setState({addCustomFieldModal: true})}
                            variant={`success`}>
                            <i className="bi bi-node-plus me-2"></i>
                            Benutzerdefiniertes Feld hinzufügen
                        </Button>
                        <hr/>
                        <CustomFieldLoop
                            selectType={this.state.selectTypes}
                            customFields={this.state.customFields}
                            spinner={this.state.spinner}
                            onSetValue={this.onSetValue}
                            onSetCustomSortable={this.onSetCustomSortable}
                            onDeleteCustomField={this.onDeleteCustomField}
                            onUpdateSortable={this.onUpdateSortable}
                        />
                    </CardBody>
                </Card>
                <AddCustomFieldModal
                    addCustomField={this.state.addCustomField}
                    addCustomFieldModal={this.state.addCustomFieldModal}
                    selectType={this.state.selectTypes}
                    setShowAddCustomFieldModal={this.setShowAddCustomFieldModal}
                    onSetAddCustomFieldValue={this.onSetAddCustomFieldValue}
                    sendFetchApi={this.sendFetchApi}
                />
            </Fragment>
        )
    }
}