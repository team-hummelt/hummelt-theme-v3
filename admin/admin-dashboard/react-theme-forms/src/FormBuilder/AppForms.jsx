import {Card, CardBody, Container, Nav, Collapse, Button, ButtonGroup, CardHeader} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import ApiErrorAlert from "../utils/ApiErrorAlert.jsx";
import {ReactSortable} from "react-sortablejs";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import $ from "jquery";

const reactSwal = withReactContent(Swal);
import * as AppTools from "../utils/AppTools";

import TextFields from "./Inputs/TextFields.jsx";
import FormFieldsSelectModal from "./Inputs/FormFieldsSelectModal.jsx";
import EditTextFields from "./FormEdit/EditTextFields.jsx";
import FormSettings from "./Settings/FormSettings.jsx";
import FormOptionen from "./Settings/FormOptionen.jsx";
import FormRefModal from "./Settings/FormRefModal.jsx";
import FormEmailSettings from "./Settings/FormEmailSettings.jsx";
import FormMeldungen from "./Settings/FormMeldungen.jsx";
import FormGridEditModal from "./Inputs/FormGridEditModal.jsx";

const {Component, Fragment} = wp.element;

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class AppForms extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            next: 0,
            prev: 0,
            rowsCount: 0,
            showRefModal: false,
            showGridModal: false,
            editGrid: {},
            referenzen: [],
            activeRef: 0,
            builderToggle: true,
            colStart: true,
            colSettings: false,
            colCondition: false,
            colEmail: false,
            colFormMsg: false,
            loadCondition: false,
            formEditId: '',
            editFormData: '',
            fieldGrid: '',
            fieldGroup: '',
            formFieldsData: [],
            builderSettings: {},
            ratingSelect: [],
            sites: [],
            showFormFieldsModal: false,
            editFormDataIds: {
                grid_id: '',
                group_id: '',
                input_id: '',
                showFields: ''
            },
            form_message: [],
            builderForm: {
                builder: [],
            },
            formData: {
                id: '',
                designation: '',
                form_id: '',
                page: '',
                pages: []
            },
            selects: {
                group_alignment: [],
                group_size: [],
                date_formats: [],
                conditions: [],
                pages: []
            },
            sortableOptions: {
                animation: 300,
                // handle: ".arrow-sortable",
                ghostClass: 'sortable-ghost',
                //forceFallback: true,
                scroll: true,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5
            },
            inputFields: [],
            message: {
                field_message: [],
                form_message: []
            },

            email_settings: {
                email: '',
                responder: '',
                email_select_active: ''
            }

        }
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.sendFetchApi = this.sendFetchApi.bind(this);

        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onDeleteSwalHandle = this.onDeleteSwalHandle.bind(this);
        this.getBuilderForm = this.getBuilderForm.bind(this);
        this.onGetDataPage = this.onGetDataPage.bind(this);
        this.onUpdateFormGroupPosition = this.onUpdateFormGroupPosition.bind(this);
        this.onUpdateGroupSortable = this.onUpdateGroupSortable.bind(this);
        this.onUpdateFormColsPosition = this.onUpdateFormColsPosition.bind(this);
        this.onUpdateColsSortable = this.onUpdateColsSortable.bind(this);
        this.onDeleteCol = this.onDeleteCol.bind(this);
        this.onSplittCol = this.onSplittCol.bind(this);
        this.onGetFormFieldsModal = this.onGetFormFieldsModal.bind(this);
        this.changeFormFieldsModal = this.changeFormFieldsModal.bind(this);
        this.onSelectFormField = this.onSelectFormField.bind(this);
        this.onUpdateSortableInputSortableList = this.onUpdateSortableInputSortableList.bind(this);
        this.onUpdateInputFormsPosition = this.onUpdateInputFormsPosition.bind(this);
        this.onUpdateEndPostionFormInput = this.onUpdateEndPostionFormInput.bind(this);
        this.onGetEditBoxInputField = this.onGetEditBoxInputField.bind(this);
        this.onAddBuilderRow = this.onAddBuilderRow.bind(this);
        this.onUpdateEditTextField = this.onUpdateEditTextField.bind(this);

        this.onUpdateEditOptionsTextField = this.onUpdateEditOptionsTextField.bind(this);
        this.onSendFormUpdateFormData = this.onSendFormUpdateFormData.bind(this);
        this.onAddOptionsInputField = this.onAddOptionsInputField.bind(this);
        this.onDeleteSectionOption = this.onDeleteSectionOption.bind(this);
        this.onUpdateSelectOptionsSortable = this.onUpdateSelectOptionsSortable.bind(this);
        this.onUpdateSelectOptions = this.onUpdateSelectOptions.bind(this);
        this.onUpdateEditStarField = this.onUpdateEditStarField.bind(this);
        this.onUpdateEditCheckboxTextField = this.onUpdateEditCheckboxTextField.bind(this);

        this.onChangeBuilderSettings = this.onChangeBuilderSettings.bind(this);
        this.onSetLoadCondition = this.onSetLoadCondition.bind(this);
        this.onUpdateFormEmailSettings = this.onUpdateFormEmailSettings.bind(this);
        this.onUpdateFormMessage = this.onUpdateFormMessage.bind(this);
        this.onAddBuilderPage = this.onAddBuilderPage.bind(this);
        this.onDeleteBuilderPage = this.onDeleteBuilderPage.bind(this);

        this.onGetNextPrefRef = this.onGetNextPrefRef.bind(this);
        this.onSetReferenzModal = this.onSetReferenzModal.bind(this);
        this.setFormReferenz = this.setFormReferenz.bind(this);
        this.onGetFormReferenzen = this.onGetFormReferenzen.bind(this);
        this.onChangeEmailEditor = this.onChangeEmailEditor.bind(this);
        this.onSetGridModal = this.onSetGridModal.bind(this);
        this.onGetGridExtrasCss = this.onGetGridExtrasCss.bind(this);
        this.onSetGridExtra = this.onSetGridExtra.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.getBuilder) {
            this.getBuilderForm();
            this.props.onSetGetBuilderForm(false)
        }
        if (this.props.triggerDesignation) {
            let formData = this.state.formData;
            formData.designation = this.props.designation;
            this.setState({
                formData: formData
            })
            this.props.onSetGetBuilderForm(false)
        }
    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    filterArrayElementById(array, id) {
        return array.filter((element) => {
            return element.id !== id;
        })
    }

    onSetGridModal(state) {
        this.setState({
            showGridModal: state,
            editGrid: {}
        })
    }

    onSetReferenzModal(state) {
        this.setState({
            showRefModal: state
        })
    }

    setFormReferenz(id) {
        let formData = {
            'method': 'set_referenz',
            'id': id
        }
        this.sendFetchApi(formData)
    }

    onGetFormReferenzen() {
        let formData = {
            'method': 'get_form_referenzen',
            'form_id': this.state.formData.form_id,
        }
        this.sendFetchApi(formData)
    }

    onDeleteGroup(group) {
        let formData = {
            'method': 'delete_builder_group',
            'form_id': this.state.formData.id,
            'group_id': group,
            'id': this.state.formData.form_id,

        }
        let swal = {
            'title': `Gruppe löschen?`,
            'msg': 'Die Gruppe wirklich löschen? Das Löschen kann nicht rückgängig gemacht werden.',
            'btn': 'Gruppe löschen',
        }

        this.onDeleteSwalHandle(formData, swal);
    }

    onToggleCollapse(target, getEmail = false, getMessage = false) {
        let start = false;
        let settings = false;
        let condition = false;
        let email = false;
        let message = false;
        let conditionLoad = false;
        let formData;
        switch (target) {
            case 'start':
                start = true;
                break
            case 'settings':
                settings = true;
                break;
            case 'condition':
                condition = true;
                conditionLoad = true;
                break;
            case 'email':
                email = true;
                break;
            case 'message':
                message = true;
                break;
        }

        if (getEmail) {
            formData = {
                'method': 'get_form_email_settings',
                'form_id': this.state.formData.form_id,
            }
            this.sendFetchApi(formData)
            return false;
        }
        if (getMessage) {
            formData = {
                'method': 'get_form_error_msg',
                'form_id': this.state.formData.form_id,
            }
            this.sendFetchApi(formData)
            return false;
        }

        this.setState({
            colStart: start,
            colSettings: settings,
            colCondition: condition,
            colEmail: email,
            colFormMsg: message,
            loadCondition: conditionLoad
        })
    }

    onDeleteBuilderPage() {
        let formData = {
            'method': 'delete_builder_page',
            'page': this.state.formData.page,
            'load': false,
            'id': this.state.formData.form_id,
        }

        let swal = {
            'title': 'Seite löschen?',
            'msg': 'Seite wirklich löschen? Das Löschen kann nicht rückgängig gemacht werden.',
            'btn': 'Seite löschen',
        }
        this.onDeleteSwalHandle(formData, swal);

    }

    onAddBuilderPage() {
        let formData = {
            'method': 'add_builder_page',
            'id': this.state.formData.form_id,
        }

        this.sendFetchApi(formData)
    }

    onUpdateFormMessage(e, id, handle, type = null, checkId = null) {
        let formEdit
        let checkboxData
        switch (handle) {
            case 'form':
                const updForm = [...this.state.message.form_message];
                const findForm = this.findArrayElementById(updForm, id)
                findForm.value = e;
                let updFormMsg = this.state.message
                updFormMsg['form_message'] = updForm;
                this.setState({
                    message: updFormMsg
                })
                formEdit = findForm
                break;
            case 'field':
                const updField = [...this.state.message.field_message];
                const findField = this.findArrayElementById(updField, id)
                findField['value'] = e;
                let updFieldMsg = this.state.message;
                updFieldMsg['field_message'] = updField;
                this.setState({
                    message: updFieldMsg
                })
                formEdit = findField
                break;
            case 'message':
                const updMsgField = [...this.state.message.field_message];
                const findMsgField = this.findArrayElementById(updMsgField, id)
                findMsgField['message'][type] = e;
                let updUplMsg = this.state.message;
                updUplMsg['field_message'] = updMsgField;

                this.setState({
                    message: updUplMsg
                })
                formEdit = findMsgField
                break;
            case 'checkbox':
                const updCheckField = [...this.state.message.field_message];
                const findCheckField = this.findArrayElementById(updCheckField, id)
                const checkBox = [...findCheckField.checkbox]
                const findCheckBox = this.findArrayElementById(checkBox, checkId)
                let updCheckMsg = this.state.message;
                findCheckBox.value = e;
                updCheckMsg['field_message']['checkbox'] = checkBox

                this.setState({
                    message: updCheckMsg
                })
                formEdit = findCheckField
                checkboxData = findCheckBox

                break;
        }

        if (formEdit) {
            let formData = {
                'method': 'update_form_message',
                'handle': handle,
                'data': JSON.stringify(formEdit),
                'form_id': this.state.formData.form_id,

            }
            if (handle === 'checkbox') {
                formData['checkbox'] = JSON.stringify(checkboxData)
            }

            this.sendFetchApi(formData)
        }
    }

    onUpdateFormEmailSettings(e, handle, type) {
        let upd = this.state.email_settings;
        upd[handle][type] = e
        this.setState({
            email_settings: upd
        })
    }

    onSetLoadCondition(state) {
        this.setState({
            loadCondition: state
        })
    }

    onChangeBuilderSettings(e, type) {
        let upd = this.state.builderSettings;
        upd[type] = e;
        this.setState({
            builderSettings: upd
        })

        let formData = {
            'method': 'update_builder_settings',
            'form_id': this.state.formData.form_id,
            'data': JSON.stringify({...this.state.builderSettings}),
        }
        this.sendFetchApi(formData)
    }

    onUpdateEditCheckboxTextField(e, id, type) {
        const updOptions = [...this.state.builderForm.builder];
        const findUpd = this.findArrayElementById(updOptions, this.state.editFormDataIds.group_id)
        const updGrid = [...findUpd.grid];
        const findGrid = this.findArrayElementById(updGrid, this.state.editFormDataIds.grid_id)
        const updForm = [...findGrid.forms]
        const findForm = this.findArrayElementById(updForm, this.state.editFormData.id)
        const updOpt = [...findForm.options]
        const findOpt = this.findArrayElementById(updOpt, id)
        findOpt[type] = e;
        this.state.editFormData.options = updOpt;
        this.setState({
            editFormData: this.state.editFormData,
            builderForm: {
                builder: updOptions
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            _this.sendFetchApi(_this.onSendFormUpdateFormData(findForm))
        }, 1000);

    }

    onUpdateEditStarField(e) {
        let updEdit = this.state.editFormData
        const updBuilder = [...this.state.builderForm.builder]
        const findBuilder = this.findArrayElementById(updBuilder, this.state.editFormDataIds.group_id)
        const updGrid = [...findBuilder.grid]
        const findGrid = this.findArrayElementById(updGrid, this.state.editFormDataIds.grid_id)
        const updForm = [...findGrid.forms];
        const findForm = this.findArrayElementById(updForm, this.state.editFormData.id)
        const getOpt = [...findForm.options];
        const findOpt = this.findArrayElementById(getOpt, e);

        let conf = findForm.config;
        conf.type = e;
        conf.icon = findOpt.icon;
        conf.icon_active = findOpt.active
        findForm.config = conf

        updEdit.config = conf
        this.setState({
            editFormData: updEdit
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            _this.sendFetchApi(_this.onSendFormUpdateFormData(findForm))
        }, 1000);
        // this.sendFetchApi(this.onSendFormUpdateFormData(findForm))
    }

    onUpdateSelectOptions(e) {
        let elementArray = [];

        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })
        let formData = {
            'method': 'update_select_position',
            'elements': elementArray,
            'id': this.state.editFormData.id,
            'grid': this.state.editFormDataIds.grid_id,
            'group': this.state.editFormDataIds.group_id,
            'form_id': this.state.formData.form_id,
        }

        this.sendFetchApi(formData)
    }

    onUpdateSelectOptionsSortable(sortList) {
        const updOptions = [...this.state.builderForm.builder];
        const findUpd = this.findArrayElementById(updOptions, this.state.editFormDataIds.group_id)
        const updGrid = [...findUpd.grid];
        const findGrid = this.findArrayElementById(updGrid, this.state.editFormDataIds.grid_id)
        const updForm = [...findGrid.forms]
        const form = this.findArrayElementById(updForm, this.state.editFormData.id);
        form.options = sortList;
        this.state.editFormData.options = sortList;
        this.setState({
            editFormData: this.state.editFormData,
            builderForm: {
                builder: updOptions
            }
        })
    }

    onDeleteSectionOption(optionsId) {
        let formData = {
            'method': 'delete_select_option',
            'input': this.state.editFormData.id,
            'grid': this.state.editFormDataIds.grid_id,
            'group': this.state.editFormDataIds.group_id,
            'form_id': this.state.formData.form_id,
            'options': optionsId,
        }
        let swal = {
            'title': `Option löschen?`,
            'msg': 'Option wirklich löschen? Das Löschen kann nicht rückgängig gemacht werden.',
            'btn': 'Option löschen',
        }
        this.onDeleteSwalHandle(formData, swal)
    }

    onAddOptionsInputField(handle) {
        let formData = {
            'method': 'add_selection_option',
            'id': this.state.editFormData.id,
            'grid': this.state.editFormDataIds.grid_id,
            'handle': handle,
            'group': this.state.editFormDataIds.group_id,
            'form_id': this.state.formData.form_id,
        }
        this.sendFetchApi(formData)
    }

    onSendFormUpdateFormData(findForm) {

        return {
            'method': 'update_edit_form_field',
            'data': JSON.stringify(findForm),
            'group': this.state.editFormDataIds.group_id,
            'grid': this.state.editFormDataIds.grid_id,
            'input_id': this.state.editFormDataIds.input_id,
            'form_id': this.state.formData.form_id,

        };
    }

    onUpdateEditOptionsTextField(e, id, option = true, value = false, type = '') {
        //console.log(e,id,option,value,type)
        let optionsArr = [];
        const updOptions = [...this.state.builderForm.builder];
        const findUpd = this.findArrayElementById(updOptions, this.state.editFormDataIds.group_id)
        const updGrid = [...findUpd.grid];
        const findGrid = this.findArrayElementById(updGrid, this.state.editFormDataIds.grid_id)
        const updForm = [...findGrid.forms]
        const findForm = this.findArrayElementById(updForm, this.state.editFormData.id)
        let config = findForm.config;
        if (findForm.type === 'select' || findForm.type === 'switch') {
            findForm.options.map(o => {
                if (value) {
                    if (o.id === id) {
                        o[type] = e
                    }
                } else {
                    if (option) {
                        o.default = o.id === id;
                    } else {
                        o.default = false;
                    }
                }
                optionsArr.push(o)
            })
        }

        if (findForm.type === 'radio') {
            findForm.options.map(o => {
                if (value) {
                    if (o.id === id) {
                        o[type] = e
                    }
                } else {
                    if (o.id === id) {
                        o['checked'] = e
                    } else {
                        if (e) {
                            o['checked'] = false
                        }
                    }
                }
                optionsArr.push(o)
            })
        }

        updForm.forms = findForm;
        updGrid.grid = updForm;

        if (!value) {
            if (findForm.type === 'select' ||
                findForm.type === 'switch'
            ) {
                if (option) {
                    config.selected = id;
                } else {
                    config.selected = '';
                }
                config.standard = !option;
            }
        }

        findForm.options = optionsArr;
        findForm.config = config;

        this.state.editFormData.options = optionsArr;
        this.state.editFormData.config = config;

        this.setState({
            editFormData: this.state.editFormData,
            builderForm: {
                builder: updOptions
            }
        })
        //   this.props.onUpdateEditFormData(this.props.editFormData, findForm, updOptions)
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            _this.sendFetchApi(_this.onSendFormUpdateFormData(findForm))
        }, 1000);
        // this.sendFetchApi(this.onSendFormUpdateFormData(findForm))
    }

    onUpdateEditTextField(e, type, config = false) {
        let updEdit = this.state.editFormData
        if (config) {
            let confUpd = this.state.editFormData.config
            confUpd[type] = e
            updEdit.config = confUpd
            this.setState({
                editFormData: updEdit
            })
        } else {
            updEdit[type] = e
            this.setState({
                editFormData: updEdit
            })
        }

        const updBuilder = [...this.state.builderForm.builder]
        const findBuilder = this.findArrayElementById(updBuilder, this.state.editFormDataIds.group_id)
        const updGrid = [...findBuilder.grid]
        const findGrid = this.findArrayElementById(updGrid, this.state.editFormDataIds.grid_id)
        const updForm = [...findGrid.forms];
        const findForm = this.findArrayElementById(updForm, this.state.editFormData.id)
        if (config) {
            let conf = findForm.config;
            conf[type] = e
            findForm.config = conf
        } else {
            findForm[type] = e;
        }
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            _this.sendFetchApi(_this.onSendFormUpdateFormData(findForm))
        }, 1000);
        // this.sendFetchApi(this.onSendFormUpdateFormData(findForm))
    }

    onAddBuilderRow() {
        let formData = {
            'method': 'add_builder_row',
            'form_id': this.state.formData.id,
            'page': this.state.formData.page,
            'row': this.state.builderForm.builder.length,
            'id': this.state.formData.form_id,
        }
        this.sendFetchApi(formData)
    }

    onGetEditBoxInputField(e, inputId, grid, group) {
        let current = $(e.currentTarget)
        if (current.hasClass('icon-edit-field')) {
            return false;
        }

        let self = current.hasClass('active')
        $('.input-box-field').removeClass('active')
        if (self) {
            current.removeClass('active')
            this.setState({
                editFormData: '',
                editFormDataIds: {
                    grid_id: '',
                    group_id: '',
                    input_id: '',
                    showFields: ''
                }
            })
        } else {
            current.addClass('active')
            if (this.state.builderToggle) {
                this.setState({
                    builderToggle: true
                })
            }
            let formData = {
                'method': 'get_build_edit_data',
                'id': inputId,
                'grid': grid,
                'group': group,
                'form_id': this.state.formData.form_id,
            }

            this.sendFetchApi(formData)
        }
    }

    onUpdateEndPostionFormInput(e, groupId, gridId) {
        let elementArray = [];
        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })
        let parent = $(e.from.parentElement.parentElement);
        let formData = {
            'method': 'update_builder_grid_form',
            'elements': elementArray,
            'form_id': this.state.formData.form_id,
            'from_group': parent.attr('data-from-group'),
            'from_grid': parent.attr('data-from-grid'),
            'to_group': groupId,
            'to_grid': gridId,
        }

        this.sendFetchApi(formData)
    }

    onUpdateInputFormsPosition(e, group, grid) {
        let elementArray = [];
        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })
        let formData = {
            'method': 'update_builder_form_position',
            'elements': elementArray,
            'form_id': this.state.formData.form_id,
            'to_group': group,
            'to_grid': grid,
        }

        this.sendFetchApi(formData)
    }

    onUpdateSortableInputSortableList(e, group, grid) {
        const updBuilder = [...this.state.builderForm.builder]
        const findBuilder = this.findArrayElementById(updBuilder, group)
        const updGrid = [...findBuilder.grid]
        const findGrid = this.findArrayElementById(updGrid, grid)
        findGrid.forms = e;
        updGrid.grid = findGrid

        this.setState({
            builderForm: {
                builder: updBuilder
            }
        })
    }

    onSelectFormField(id) {
        let formData = {
            'method': 'get_new_form_field',
            'id': id,
        }

        this.sendFetchApi(formData)
    }

    changeFormFieldsModal(show) {
        this.setState({
            showFormFieldsModal: show
        })
    }

    onGetFormFieldsModal(group, grid) {
        let formData = {
            'method': 'get_form_fields',
            'handle': 'modal',
            'group': group,
            'grid': grid,
        }
        this.sendFetchApi(formData)
    }

    onSplittCol(col, colId, groupId) {
        let formData = {
            'method': 'builder_splitt_col',
            'form_id': this.state.formData.form_id,
            'col': col,
            'colId': colId,
            'groupId': groupId,
        }
        this.sendFetchApi(formData)
    }

    getBuilderForm() {
        let formData = {
            'method': 'get_build_form',
            'id': this.props.id
        }
        this.sendFetchApi(formData)
    }

    onGetDataPage(page) {
        let formData = {
            'method': 'get_build_form',
            'page': page,
            'id': this.state.formData.form_id,
        }

        this.sendFetchApi(formData)
    }

    onUpdateFormGroupPosition(newState) {
        this.setState({
            builderForm: {
                builder: newState
            }
        })

        sleep(200).then(() => {
        })
    }

    onUpdateGroupSortable(e) {
        let elementArray = [];
        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })

        let formData = {
            'method': 'update_builder_group_position',
            'elements': elementArray,
            'form_id': this.state.formData.form_id,
            'page': this.state.formData.page,
        }

        this.sendFetchApi(formData)
    }

    onUpdateColsSortable(e, group) {
        let elementArray = [];

        e.to.childNodes.forEach(sortable => {
            if (sortable.hasAttribute('data-id')) {
                elementArray.push(sortable.getAttribute('data-id'));
            }
        })
        let formData = {
            'method': 'update_builder_grid_position',
            'elements': elementArray,
            'form_id': this.state.formData.form_id,
            'group': group,
        }

        this.sendFetchApi(formData)
    }

    onDeleteCol(col, grid, groupId, gridId) {
        let formData = {
            'method': 'remove_builder_col',
            'form_id': this.state.formData.id,
            'id': this.state.formData.form_id,
            'col': col,
            'grid': JSON.stringify(grid),
            'group_id': groupId,
            'grid_id': gridId,
        }
        this.sendFetchApi(formData)
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

    onUpdateFormColsPosition(e, group) {
        const updBuilder = [...this.state.builderForm.builder]
        const findBuilder = this.findArrayElementById(updBuilder, group)
        findBuilder.grid = e;
        this.setState({
            builderForm: {
                builder: updBuilder
            }
        })
    }

    onGetNextPrefRef(id, type) {
        let formData = {
            'method': 'get_next_ref',
            'id': id,
            'type': type
        }
        this.sendFetchApi(formData)
    }

    onChangeEmailEditor(e, handle) {
        console.log(e, handle)
    }

    onGetGridExtrasCss(grid, builder_id) {
        grid['builder_id'] = builder_id;
        this.setState({
            editGrid: grid,
            showGridModal: true
        })
    }

    onSetGridExtra(e, type, grid_id, builder_id) {

        const updBuilder = [...this.state.builderForm.builder]
        const findBuilder = this.findArrayElementById(updBuilder, builder_id);
        const grid = [...findBuilder.grid];
        const findGrid = this.findArrayElementById(grid, grid_id);
        findGrid[type] = e;
        findBuilder.grid = grid;
        this.setState({
            builderForm: {
                builder: updBuilder
            }
        })
        let _this = this;
        clearTimeout(this.formUpdTimeOut);
        this.formUpdTimeOut = setTimeout(function () {
            let formData = {
                'method': 'update_extra_grid',
                'data': JSON.stringify(findGrid),
                'grid_id': grid_id,
                'builder_id': builder_id,
                'id': _this.state.formData.form_id
            }
           _this.sendFetchApi(formData)
        }, 1000);
    }

    sendFetchApi(formData, path = hummeltRestObj.form_builder_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_build_form':
                    if (data.status) {
                        this.setState({
                            next: data.next,
                            prev: data.prev,
                            sites: data.sites,
                            formEditId: data.form_id,
                            builderSettings: data.record.settings,
                            builderForm: {
                                builder: data.record.builder
                            },
                            formData: {
                                id: data.record.id,
                                designation: data.record.designation,
                                form_id: data.form_id,
                                page: data.page,
                                pages: data.pages
                            },
                            selects: {
                                group_alignment: data.selects.group_alignment,
                                group_size: data.selects.group_size,
                                date_formats: data.selects.date_formats,
                                pages: data.selects.pages,
                                conditions: data.conditions
                            }
                        })
                        this.onToggleCollapse('start')
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'set_referenz':
                    if (data.status) {
                        let selects = this.state.selects;
                        let formData = this.state.formData;
                        formData.page = data.page;
                        formData.pages = data.pages;
                        selects.conditions = data.conditions;
                        this.setState({
                            builderForm: {
                                builder: data.builder
                            },
                            selects: selects,
                            formData: formData,
                            next: data.next,
                            prev: data.prev,
                            showRefModal: false,
                            activeRef: data.active
                        })
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_builder_group':
                    if (data.status) {
                        const updBuilder = [...this.state.builderForm.builder];
                        const filterBuilder = this.filterArrayElementById(updBuilder, data.group)
                        this.setState({
                            prev: data.prev,
                            builderForm: {
                                builder: filterBuilder
                            }
                        })
                    }
                    break;
                case 'remove_builder_col':
                    if (data.status) {
                        const updForm = [...this.state.builderForm.builder]
                        const findGroup = this.findArrayElementById(updForm, data.record.id);
                        findGroup.grid = data.record.grid;
                        this.setState({
                            prev: data.prev,
                            builderForm: {
                                builder: updForm
                            }
                        })
                    }
                    break;
                case 'builder_splitt_col':
                    if (data.status) {
                        const updForm = [...this.state.builderForm.builder]
                        const findGroup = this.findArrayElementById(updForm, data.group_id);
                        const findGrid = [...findGroup.grid];
                        const findCol = this.findArrayElementById(findGrid, data.col_id)
                        findCol.col = data.splitt;
                        findGrid.grid = findCol;

                        findGroup.grid = [...findGroup.grid, {
                            'id': data.record.id,
                            'col': data.record.col,
                            'position': data.record.position,
                            'forms': data.record.forms
                        }]
                        this.setState({
                            prev: data.prev,
                            builderForm: {
                                builder: updForm
                            }
                        })
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'get_form_fields':
                    if (data.status) {
                        this.setState({
                            showFormFieldsModal: true,
                            formFieldsData: data.record,
                            fieldGrid: data.grid,
                            fieldGroup: data.group
                        })
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'get_build_edit_data':
                    let showFields;
                    let showFieldsArr = ['hidden'];
                    showFields = !showFieldsArr.includes(String(data.record.type));
                    if (data.status) {
                        this.setState({
                            editFormData: data.record,
                            editFormDataIds: {
                                grid_id: data.grid_id,
                                group_id: data.group_id,
                                input_id: data.input_id,
                                showFields: showFields
                            },
                        })
                        if (data.rating) {
                            this.setState({
                                ratingSelect: data.rating_select
                            })
                        }
                        AppTools.scrollToWrap('.builder-wrapper', 50)
                    } else {
                        this.setState({
                            editFormData: '',
                            editFormDataIds: {
                                grid_id: '',
                                group_id: '',
                                input_id: '',
                                showFields: ''
                            },
                        })
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'add_builder_row':
                    if (data.status) {
                        let updBuilder = this.state.builderForm;
                        updBuilder.builder = [...updBuilder.builder, {
                            'id': data.record.id,
                            'grid': data.record.grid,
                        }]

                        this.setState({
                            builderForm: updBuilder,
                            prev: data.prev
                        })
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_form_input':
                    if (data.status) {
                        const updBuilder = [...this.state.builderForm.builder]
                        const findBuilder = this.findArrayElementById(updBuilder, data.group)
                        const updGrid = [...findBuilder.grid]

                        const findGrid = this.findArrayElementById(updGrid, data.grid)
                        const searchForm = [...findGrid.forms];
                        findGrid.forms = this.filterArrayElementById(searchForm, data.input)
                        this.setState({
                            prev: data.prev,
                            builderForm: {
                                builder: updBuilder
                            }
                        })
                        if (data.input === this.state.editFormData.id) {
                            this.setState({
                                editFormData: '',
                                editFormDataIds: {
                                    grid_id: '',
                                    group_id: '',
                                    input_id: '',
                                    showFields: ''
                                },
                            })
                        }
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'add_selection_option':
                    if (data.status) {
                        const updBuilder = [...this.state.builderForm.builder]
                        const findGroup = this.findArrayElementById(updBuilder, data.group);
                        const findGrid = [...findGroup.grid];
                        const updGrid = this.findArrayElementById(findGrid, data.grid)
                        const updForm = [...updGrid.forms]
                        const findForm = this.findArrayElementById(updForm, data.input)
                        switch (data.handle) {
                            case 'select':
                                findForm.options = [...findForm.options, {
                                    default: data.record.default,
                                    id: data.record.id,
                                    label: data.record.label,
                                    value: data.record.value
                                }]

                                this.state.editFormData.options = [...this.state.editFormData.options, {
                                    default: data.record.default,
                                    id: data.record.id,
                                    label: data.record.label,
                                    value: data.record.value
                                }]
                                break;
                            case 'checkbox':
                                findForm.options = [...findForm.options, {
                                    checked: data.record.checked,
                                    id: data.record.id,
                                    label: data.record.label,
                                    value: data.record.value,
                                    err_msg: data.record.err_msg
                                }]

                                this.state.editFormData.options = [...this.state.editFormData.options, {
                                    checked: data.record.checked,
                                    id: data.record.id,
                                    label: data.record.label,
                                    value: data.record.value,
                                    err_msg: data.record.err_msg
                                }]
                                break;
                        }
                        this.setState({
                            prev: data.prev,
                            builderForm: {
                                builder: updBuilder
                            }
                        })
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_select_option':
                    if (data.status) {
                        const updBuilder = [...this.state.builderForm.builder];
                        const findUpd = this.findArrayElementById(updBuilder, data.group)
                        const updGrid = [...findUpd.grid];
                        const findGrid = this.findArrayElementById(updGrid, data.grid)
                        const updForm = [...findGrid.forms]
                        const findForm = this.findArrayElementById(updForm, data.input)
                        const updOptions = [...findForm.options];
                        findForm.options = this.filterArrayElementById(updOptions, data.optionId)
                        if (data.default) {
                            findForm.config.default = true;
                            this.state.editFormData.config.standard = true;
                            // this.props.editFormData.config.selected = '';
                        }

                        this.setState({
                            prev: data.prev,
                            builderForm: {
                                builder: updBuilder
                            }
                        })
                        this.state.editFormData.options = findForm.options;
                        let editFormData = this.state.editFormData;
                        this.setState({
                            editFormData: editFormData
                        })
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'set_form_field':

                    if (data.status) {
                        const updForm = [...this.state.builderForm.builder]
                        const findGroup = this.findArrayElementById(updForm, data.group);
                        const findGrid = [...findGroup.grid];
                        const updGrid = this.findArrayElementById(findGrid, data.grid)
                        updGrid.forms = [...updGrid.forms, {
                            id: data.record.id,
                            label: data.record.label,
                            form_type: data.record.form_type,
                            slug: data.record.slug,
                            show_msg: data.record.show_msg,
                            err_msg: data.record.err_msg,
                            type: data.record.type,
                            required: data.record.required,
                            hide_label: data.record.hide_label,
                            select: data.record.select,
                            icon: data.record.icon,
                            condition: data.record.condition,
                            config: data.record.config,
                            options: data.record.options || [],
                            message: data.record.message || []
                        }]

                        findGrid.grid = updGrid;
                        this.setState({
                            prev: data.prev,
                            builderForm: {
                                builder: updForm
                            },
                            editFormData: '',
                            editFormDataIds: {
                                grid_id: '',
                                group_id: '',
                                input_id: '',
                                showFields: ''
                            },
                            showFormFieldsModal: false
                        })

                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'get_form_email_settings':
                    if (data.status) {
                        this.setState({
                            inputFields: data.fields,
                            email_select_active: data.email_select_active,
                            email_settings: {
                                email: data.record.email,
                                responder: data.record.responder,
                                email_select_active: data.email_select_active
                            }
                        })
                        this.onToggleCollapse('email');
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'update_form_email_settings':
                    if (data.status) {
                        AppTools.success_message(data.msg)
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'get_form_error_msg':
                    if (data.status) {
                        this.setState({
                            message: {
                                field_message: data.field_message,
                                form_message: data.form_message
                            }
                        })
                        this.onToggleCollapse('message')
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'add_builder_page':
                    if (data.status) {
                        let upd = this.state.formData;
                        upd['page'] = data.page;
                        upd['pages'] = data.pages;
                        this.setState({
                            formData: upd,
                            prev: data.prev,
                            builderForm: {
                                builder: data.record
                            },
                            editFormData: '',
                            editFormDataIds: {
                                grid_id: '',
                                group_id: '',
                                input_id: '',
                                showFields: ''
                            }
                        })
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'delete_builder_page':
                    if (data.status) {
                        let upd = this.state.formData;
                        upd['page'] = data.page;
                        upd['pages'] = data.pages;
                        this.setState({
                            formData: upd,
                            prev: data.prev,
                            builderForm: {
                                builder: data.record
                            }
                        })
                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'update_edit_form_field':
                    if (data.status) {
                        if (data.is_slug && data.slug) {
                            let editFormData = this.state.editFormData;
                            editFormData.slug = data.slug;
                            this.setState({
                                prev: data.prev,
                                editFormData: editFormData
                            })
                        }
                    }
                    break;
                case 'update_builder_group_position':
                case 'update_builder_grid_position':
                case 'update_builder_grid_form':
                case 'update_select_position':
                    this.setState({
                        prev: data.prev,
                    })
                    break;
                case 'get_next_ref':
                    if (data.status) {

                    } else {
                        AppTools.warning_message(data.msg)
                    }
                    break;
                case 'get_form_referenzen':
                    if (data.status) {
                        this.setState({
                            referenzen: data.referenz,
                            showRefModal: true,
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

    render() {
        return (
            <Fragment>
                <div className="d-flex flex-wrap">
                    <Button
                        onClick={() => this.props.onToggleStartBuilder('start', true)}
                        size="sm"
                        variant="success my-1 me-2">
                        <i className="bi bi-reply-all me-2"></i>
                        zurück
                    </Button>
                    <ButtonGroup className="flex-wrap" aria-label="Basic example">
                        <Button onClick={() => this.onToggleCollapse('start')}
                                size="sm"
                                variant={`outline-primary my-1 rounded-start ${this.state.colStart ? 'active pe-none' : ''}`}>
                            <i className="bi bi-grid-3x3 me-2"></i>
                            Formular Layout
                        </Button>
                        <Button onClick={() => this.onToggleCollapse('settings')}
                                size="sm"
                                variant={`outline-primary my-1 rounded-0 ${this.state.colSettings ? 'active pe-none' : ''}`}>
                            <i className="bi bi-gear me-2"></i>
                            Formular-Einstellungen
                        </Button>
                        <Button onClick={() => this.onToggleCollapse('condition')}
                                size="sm"
                                variant={`outline-primary my-1 rounded-0 ${this.state.colCondition ? 'active pe-none' : ''}`}>
                            <i className="bi bi-code-slash me-2"></i>
                            Formular Bedingungen
                        </Button>
                        <Button onClick={() => this.onToggleCollapse('email', true)}
                                size="sm"
                                variant={`outline-primary my-1 rounded-0 ${this.state.colEmail ? 'active pe-none' : ''}`}>
                            <i className="bi bi-envelope-at me-2"></i>
                            E-Mail Versand
                        </Button>
                        <Button onClick={() => this.onToggleCollapse('message', false, true)}
                                size="sm"
                                variant={`outline-primary my-1 rounded-end ${this.state.colFormMsg ? 'active pe-none' : ''}`}>
                            <i className="bi bi-tools me-2"></i>
                            Formular Meldungen
                        </Button>
                    </ButtonGroup>
                </div>
                <hr/>
                <Collapse in={this.state.colStart}>
                    <div id={uuidv4()}>
                        <div className="d-flex flex-wrap">
                            <ButtonGroup className="flex-wrap" aria-label="Basic example">
                                {this.state.formData.pages.map((p, index) => {
                                    return (
                                        <Button key={index} onClick={() => this.onGetDataPage(p)}
                                                size="sm"
                                                variant={`outline-primary  ${this.state.formData.page === p ? 'active pe-none' : ''}`}>
                                            Seite {p}
                                        </Button>
                                    )
                                })}
                            </ButtonGroup>
                            <div className="ms-lg-auto d-flex align-items-center">
                                {/*}  <Button
                                    size="sm"
                                    variant={`outline-light text-body border me-1`}>
                                    <i className="bi bi-braces me-2"></i>
                                    Row wrapper
                                </Button> {*/}
                                <span onClick={() => this.setFormReferenz(this.state.prev)}
                                      title="Rückgängig"
                                      className={`btn-prev me-1 ${this.state.prev ? '' : 'disabled'}`}></span>
                                <span onClick={() => this.setFormReferenz(this.state.next)}
                                      className={`btn-next me-1 ${this.state.next ? '' : 'disabled'}`}></span>
                                <Button onClick={this.onGetFormReferenzen}
                                        title="Refenzen"
                                        size="sm"
                                        variant={`outline-light text-body border me-1`}>
                                    <i className="bi bi-activity"></i>
                                </Button>
                                <Button onClick={this.onAddBuilderPage}
                                        size="sm"
                                        variant={`success`}>
                                    <i className="bi bi-node-plus me-2"></i>
                                    Seite hinzufügen
                                </Button>
                                {this.state.formData.page > 1 ?
                                    <Button onClick={this.onDeleteBuilderPage}
                                            size="sm"
                                            variant={`danger`}>
                                        <i className="bi bi-trash me-2"></i>
                                        Seite löschen
                                    </Button>
                                    : ''}
                            </div>
                        </div>
                        <hr/>

                        <div
                            className={`builder-wrapper d-flex flex-wrap g-3 px-2 pb-3 pt-2 mt-3  rounded mb-2 align-items-stretch ${this.state.builderToggle ? 'active' : ''}`}>
                            <div onClick={() => this.setState({builderToggle: !this.state.builderToggle})}
                                 className={`sidebar-toggler ${this.state.builderToggle ? 'open' : 'closed'}`}></div>
                            <ReactSortable
                                className="builder-content col-12- col-xl-10- col-xxl-9-"
                                list={this.state.builderForm.builder}
                                handle=".group-arrow"
                                setList={(newState) => this.onUpdateFormGroupPosition(newState)}
                                {...this.state.sortableOptions}
                                onUpdate={(e) => this.onUpdateGroupSortable(e)}
                            >
                                {this.state.builderForm.builder.map((b, groupIndex) => {
                                    return (
                                        <div className="builder-row mb-3" data-id={b.id} key={b.id}>
                                            <div className="builder-inner p-3">
                                                {groupIndex > 0 ? (
                                                    <div onClick={() => this.onDeleteGroup(b.id)}
                                                         className="group-delete"></div>
                                                ) : (<></>)}
                                                <div className="group-arrow"></div>
                                                <ReactSortable
                                                    className="row g-2"
                                                    list={b.grid}
                                                    handle=".group-box-arrow"
                                                    setList={(newState) => this.onUpdateFormColsPosition(newState, b.id)}
                                                    {...this.state.sortableOptions}
                                                    onUpdate={(e) => this.onUpdateColsSortable(e, b.id)}
                                                >
                                                    {b.grid.map((g, gIndex) => {
                                                        return (
                                                            <div className={`group-target col-12 col-lg-${g.col}`}
                                                                 key={g.id}>
                                                                <div data-from-grid={g.id} data-from-group={b.id}
                                                                     className="group-box">
                                                                    <div
                                                                        onClick={() => this.onGetGridExtrasCss(g, b.id)}
                                                                        className="group-box-edit gx-0">
                                                                        <i className="bi bi-tools"></i>
                                                                    </div>
                                                                    {gIndex > 0 ? (
                                                                        <div
                                                                            onClick={() => this.onDeleteCol(gIndex, b, b.id, g.id)}
                                                                            title="merge"
                                                                            className="group-box-delete gx-0"></div>
                                                                    ) : (<></>)}
                                                                    {g.col > 1 && g.col < 13 ? (
                                                                        <div
                                                                            onClick={() => this.onSplittCol(g.col, g.id, b.id)}
                                                                            title='split'
                                                                            className="group-box-split gx-0"></div>
                                                                    ) : (<></>)}
                                                                    <div
                                                                        onClick={() => this.onGetFormFieldsModal(b.id, g.id)}
                                                                        className="group-box-add gx-0"></div>
                                                                    <div className="group-box-arrow gx-0"></div>
                                                                    <div className="builder-form-box p-3">
                                                                        <ReactSortable
                                                                            className="row g-2"
                                                                            group="inputForms"
                                                                            handle=".forms-arrow"
                                                                            list={g.forms}
                                                                            setList={(newState) => this.onUpdateSortableInputSortableList(newState, b.id, g.id)}
                                                                            {...this.state.sortableOptions}
                                                                            onUpdate={(e) => this.onUpdateInputFormsPosition(e, b.id, g.id)}
                                                                            onAdd={(e) => this.onUpdateEndPostionFormInput(e, b.id, g.id)}
                                                                        >
                                                                            {g.forms.map((f, fIndex) => {
                                                                                return (
                                                                                    <div key={f.id} data-id={f.id}
                                                                                         className="col-12 forms-input-field mt-3">
                                                                                        <div
                                                                                            onClick={(e) => this.onGetEditBoxInputField(e, f.id, g.id, b.id)}
                                                                                            className="input-box-field cursor-pointer rounded">
                                                                                            <TextFields
                                                                                                formInput={f}
                                                                                                groupId={b.id}
                                                                                                gridId={g.id}
                                                                                                gIndex={gIndex}
                                                                                                groupIndex={groupIndex}
                                                                                                formData={this.state.formData}
                                                                                                onDeleteSwalHandle={this.onDeleteSwalHandle}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </ReactSortable>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}

                                                </ReactSortable>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div onClick={this.onAddBuilderRow}
                                     title='Klicken Sie hier, um eine neue Zeile zum Layout hinzuzufügen.'
                                     className="add-builder-row"></div>

                            </ReactSortable>
                            <div className="builder-sidebar col-xxl-3- col-xl-2- ps-lg-2 mt-lg-0 mt-3 col-12-">
                                <div className="p-3 sidebar-inner position-relative">

                                    <div className="d-flex align-items-center flex-wrap">
                                        <div className="mb-lg-0 mb-1">
                                            <i className="bi bi-folder2-open me-2 text-blue"></i>
                                            <span className="fw-semibold">{this.state.formData.designation}
                                                <sup
                                                    onClick={() => this.props.onUpdateDesignation(this.state.formData.designation, this.state.formEditId)}>
                                                <i className="bi bi-pencil-square scale-icon text-blue ms-2 small cursor-pointer"></i></sup>
                                            </span>
                                        </div>
                                    </div>
                                    <hr/>
                                    {this.state.editFormData ?
                                        <EditTextFields
                                            formEdit={this.state.editFormData}
                                            formData={this.state.formData}
                                            editFormDataIds={this.state.editFormDataIds}
                                            selects={this.state.selects}
                                            rating_select={this.state.rating_select}
                                            onUpdateEditTextField={this.onUpdateEditTextField}
                                            onUpdateEditStarField={this.onUpdateEditStarField}
                                            onUpdateEditOptionsTextField={this.onUpdateEditOptionsTextField}
                                            onAddOptionsInputField={this.onAddOptionsInputField}
                                            onDeleteSectionOption={this.onDeleteSectionOption}
                                            sortableOptions={this.state.sortableOptions}
                                            onUpdateSelectOptionsSortable={this.onUpdateSelectOptionsSortable}
                                            onUpdateSelectOptions={this.onUpdateSelectOptions}
                                            onDeleteSwalHandle={this.onDeleteSwalHandle}
                                            onUpdateEditCheckboxTextField={this.onUpdateEditCheckboxTextField}
                                        />
                                        : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </Collapse>
                <Collapse in={this.state.colSettings}>
                    <div id={uuidv4()}>
                        <FormSettings
                            formData={this.state.formData}
                            builderSettings={this.state.builderSettings}
                            sites={this.state.sites}
                            onChangeBuilderSettings={this.onChangeBuilderSettings}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colCondition}>
                    <div id={uuidv4()}>
                        <FormOptionen
                            loadCondition={this.state.loadCondition}
                            onSetLoadCondition={this.onSetLoadCondition}
                            formData={this.state.formData}
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colEmail}>
                    <div id={uuidv4()}>
                        <FormEmailSettings
                            sendFetchApi={this.sendFetchApi}
                            inputFields={this.state.inputFields}
                            email_settings={this.state.email_settings}
                            formData={this.state.formData}
                            onUpdateFormEmailSettings={this.onUpdateFormEmailSettings}
                            onChangeEmailEditor={this.onChangeEmailEditor}
                            handle="email"
                        />
                    </div>
                </Collapse>
                <Collapse in={this.state.colFormMsg}>
                    <div id={uuidv4()}>
                        <FormMeldungen
                            message={this.state.message}
                            onUpdateFormMessage={this.onUpdateFormMessage}
                        />
                    </div>
                </Collapse>
                <FormFieldsSelectModal
                    showFormFieldsModal={this.state.showFormFieldsModal}
                    fieldGrid={this.state.fieldGrid}
                    fieldGroup={this.state.fieldGroup}
                    changeFormFieldsModal={this.changeFormFieldsModal}
                    onSelectFormField={this.onSelectFormField}
                    formFieldsData={this.state.formFieldsData}
                    sendFetchApi={this.sendFetchApi}
                    formData={this.state.formData}
                />
                <FormRefModal
                    showRefModal={this.state.showRefModal}
                    referenzen={this.state.referenzen}
                    rowsCount={this.state.rowsCount}
                    activeRef={this.state.activeRef}
                    onSetReferenzModal={this.onSetReferenzModal}
                    setFormReferenz={this.setFormReferenz}
                />
                <FormGridEditModal
                    showGridModal={this.state.showGridModal}
                    editGrid={this.state.editGrid}
                    onSetGridModal={this.onSetGridModal}
                    onSetGridExtra={this.onSetGridExtra}
                />
            </Fragment>
        )
    }


}