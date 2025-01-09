import {Card, CardBody, Container, Nav, Collapse, CardHeader} from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import BsFormBuilder from "./BsFormBuilder";
import SetAjaxData from "./components/utils/SetAjaxData.jsx";

const {Component, Fragment} = wp.element;
const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class App extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            notFoundAlert: false,
            showSpamTerms: false,
            showSendForm: false,
            showSendError: false,
            reset_formular: false,
            sendFormMsg: '',
            sendErrorMsgHeadline: '',
            sendErrorLabel: '',
            sendAlertType: 'danger',
            notFoundMsg: '',
            random: '',
            checkCondition: false,
            error_messages: '',
            formData: [],
            form_id: '',
            builder_id: '',
            conditions: [],
            con_fields: [],
            emptyField: [],
            emptyGroup: [],
            settings: {},
            page: '',
            pages: [],
            form: [],
            showGrid: true
        }

        this.WpFetchApi = this.WpFetchApi.bind(this);
        this.onCheckConValue = this.onCheckConValue.bind(this);
        this.onCheckEmptyFields = this.onCheckEmptyFields.bind(this);
        this.onChangeCheckCondition = this.onChangeCheckCondition.bind(this);
        this.onSetStateSpamTerms = this.onSetStateSpamTerms.bind(this);
        this.onSetStateSendForm = this.onSetStateSendForm.bind(this);
        this.onSetStateShowSendError = this.onSetStateShowSendError.bind(this);
        this.onSetStateResetFormular = this.onSetStateResetFormular.bind(this);

        this.onGetFormBuilder = this.onGetFormBuilder.bind(this);
        this.onSetFormPage = this.onSetFormPage.bind(this);
        this.onCheckConditions = this.onCheckConditions.bind(this);

        this.onSetFormTextTypes = this.onSetFormTextTypes.bind(this);
        this.onSwitchTypeValue = this.onSwitchTypeValue.bind(this);
        this.onCheckboxTypeValue = this.onCheckboxTypeValue.bind(this);
        this.onSelectedTypeValue = this.onSelectedTypeValue.bind(this);

        this.onFormatFormular = this.onFormatFormular.bind(this);
        this.onFindConditionForms = this.onFindConditionForms.bind(this);

        this.onDocumentEmptyGroups = this.onDocumentEmptyGroups.bind(this);
        this.onFindConditionDisabledForms = this.onFindConditionDisabledForms.bind(this);
        this.onDocumentAddEmptyGroups = this.onDocumentAddEmptyGroups.bind(this);
        this.onDocumentRemoveEmptyGroups = this.onDocumentRemoveEmptyGroups.bind(this);
        this.onSetFormUploadTypes = this.onSetFormUploadTypes.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }


    componentDidMount() {

        let formData = {
            'method': 'get_app_form_builder',
            'builder_id': this.props.id,
            'load': true,
            page: 1,
        }
        this.WpFetchApi(formData)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.checkCondition) {
            this.onCheckEmptyFields()
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

    onSetFormUploadTypes(file, form_id) {
        let updFormdata = [];
        this.state.formData.map((p, pIndex) => {
            p.map((d) => {
                d.grid.map((g, gIndex) => {
                    g.forms.map((f, fIndex) => {
                        if (f.id === form_id) {
                            f.config.default.files = [...f.config.default.files, {
                                file: file.file,
                                file_name: file.file_name,
                                id: file.id
                            }];
                        }
                    })
                })
            })
            updFormdata.push(p)
        })
        this.setState({
            formData: updFormdata
        })
    }

    onDocumentRemoveEmptyGroups() {
        let emptyGroup = document.querySelectorAll('.condition-group');
        if (emptyGroup.length) {
            for (let i = 0; i < emptyGroup.length; i++) {
                const removeClass = "g-0 condition-group";
                const classLists = removeClass.split(" ");
                const currentNode = emptyGroup[i];
                currentNode.classList.remove(...classLists)
            }
        }
    }

    onDocumentAddEmptyGroups() {
        let emptyGroup = document.querySelectorAll('.empty-group');
        if (emptyGroup.length) {
            for (let i = 0; i < emptyGroup.length; i++) {
                const parentNode = emptyGroup[i].parentNode;
                const addClass = "g-0 condition-group";
                const classLists = addClass.split(" ");
                parentNode.classList.add(...classLists)
            }
        }
    }

    onFindConditionDisabledForms(cond_id) {
        if (!cond_id) {
            return false;
        }
        const updCon = [...this.state.conditions]
        const findCon = this.findArrayElementById(updCon, cond_id)
        if (findCon) {
            if (findCon.deactivate) {
                return findCon.deactivate
            }
        } else {
            return false;
        }
    }

    onDocumentEmptyGroups() {
        let emptyGroup = document.querySelectorAll('.empty-group');
        if (emptyGroup.length) {
            for (let i = 0; i < emptyGroup.length; i++) {
                let currentNode = emptyGroup[i];
                let parentNode = emptyGroup[i].parentNode;
                let addClass = "g-0 condition-group";
                const classLists = addClass.split(" ");
                parentNode.classList.add(...classLists)
                parentNode.setAttribute('data-id', currentNode.getAttribute('data-id'))
            }
        }
    }

    onFindConditionForms(cond_id) {
        if (!cond_id) {
            return true;
        }
        const updCon = [...this.state.conditions]
        const findCon = this.findArrayElementById(updCon, cond_id)
        if (findCon) {
            if (findCon.visibility) {
                return findCon.visibility
            }
        } else {
            return true;
        }
    }

    onFormatFormular() {
        let updFormdata = [];
        this.state.formData.map((p, pIndex) => {
            p.map((d) => {
                d.grid.map((g, gIndex) => {
                    if (g.forms.length !== 0) {
                        g.forms.map((f, fIndex) => {
                            let optArr = [];
                            if (f.form_type === 'credit-card') {
                                optArr = {
                                    'full_name': f.options.full_name,
                                    'card_number': f.options.card_number || '',
                                    'expiry_date': f.options.expiry_date || '',
                                    'cvc': f.options.cvc || ''
                                }
                            } else {
                                f.options.map((o, oIndex) => {
                                    let item = {
                                        'id': o.id,
                                        'default': o.default || '',
                                        'selected': o.selected || '',
                                        'checked': o.checked || '',
                                        'value': o.value || ''
                                    }
                                    optArr.push(item)
                                })
                            }

                            d = {
                                'grid': g.id,
                                'form': {
                                    'id': f.id,
                                    'form_type': f.form_type,
                                    'type': f.type,
                                    'slug': f.slug,
                                    'options': optArr,
                                    'config': {
                                        'selected': f.config.selected || '',
                                        'default': f.config.default || '',
                                    },
                                    'condition': f.condition
                                }
                            }
                            updFormdata.push(d)
                        })
                    }
                })
            })
        })

        return updFormdata;
    }

    onSelectedTypeValue(value, form_id) {
        let updFormdata = [];
        this.state.formData.map((p, pIndex) => {
            p.map((d) => {
                d.grid.map((g, gIndex) => {
                    g.forms.map((f, fIndex) => {
                        if (f.id === form_id) {
                            f.config.selected = value
                        }
                    })
                })
            })
            updFormdata.push(p)
        })

        this.setState({
            formData: updFormdata
        })

        this.onCheckConditions(form_id, value)
    }

    onCheckboxTypeValue(optId, value, form_id) {
        let updFormdata = [];
        this.state.formData.map((p, pIndex) => {
            p.map((d) => {
                d.grid.map((g, gIndex) => {
                    g.forms.map((f, fIndex) => {
                        if (f.options.length) {
                            f.options.map((o, oIndex) => {
                                if (o.id === optId) {
                                    o.checked = value;
                                    o.default = o.value
                                }
                            })
                        }
                    })
                })
            })
            updFormdata.push(p)
        })

        this.setState({
            formData: updFormdata
        })
        this.onCheckConditions(form_id, optId)
    }

    onSwitchTypeValue(optId, value, form_id, form_type) {
        let updFormdata = [];

        this.state.formData.map((p, pIndex) => {
            p.map((d) => {
                d.grid.map((g, gIndex) => {

                    g.forms.map((f, fIndex) => {
                        if (f.options.length) {
                            f.options.map((o, oIndex) => {
                                if (o.id === optId) {
                                    o.default = value
                                }
                            })
                        }
                    })
                })
            })
            updFormdata.push(p)
        })
        this.setState({
            formData: updFormdata
        })
        this.onCheckConditions(form_id, optId)
    }

    onSetFormTextTypes(e, form_id, policy = false) {
        let updFormdata = [];
        this.state.formData.map((p, pIndex) => {
            p.map((d) => {
                d.grid.map((g, gIndex) => {
                    g.forms.map((f, fIndex) => {
                        if (f.id === form_id) {
                            if (policy) {
                                f.config.selected = e;
                            } else {
                                f.config.default = e;
                            }
                        }
                    })
                })
            })
            updFormdata.push(p)
        })

        this.setState({
            formData: updFormdata
        })
        this.onCheckConditions(form_id, e)
    }

    onCheckConditions(formId, value) {
        let conFields = this.state.con_fields;
        let formData;
        let data = this.onFormatFormular();

        if (conFields.includes(formId)) {
            formData = {
                'method': 'check_form_condition',
                'form': formId,
                'form_id': this.state.form_id,
                'builder_id': this.props.id,
                'value': value,
                'data': JSON.stringify(data)
            }
            this.WpFetchApi(formData)
        }
    }

    onSetFormPage(page) {
        this.setState({
            page: page
        })
    }

    onGetFormBuilder(target, page) {
        let formData = {
            'method': 'get_app_form_builder',
            'form_id': this.props.id,
            'builder_id': this.props.builder_id,
            'page': page,
            'load': true,
        }
        this.WpFetchApi(formData)
    }

    onSetStateResetFormular(state) {
        this.setState({
            reset_formular: state
        })
        if (!state) {
            sleep(50).then(() => {
                this.setState({
                    formData: []
                })
                let formData = {
                    'method': 'get_app_form_builder',
                    'form_id': this.props.form_id,
                    'builder_id': this.props.id,
                    'load': true,
                    page: 1,
                }
                this.WpFetchApi(formData)
            })
        }
    }

    onSetStateShowSendError(state) {
        this.setState({
            showSendError: state
        })
    }

    onSetStateSendForm(state) {
        this.setState({
            showSendForm: state
        })
    }

    onSetStateSpamTerms(state) {
        this.setState({
            showSpamTerms: state
        })
    }

    onChangeCheckCondition(check) {
        this.setState({
            checkCondition: check
        })
    }

    onCheckEmptyFields(formData) {

        let emptyArr = [];
        let emptyGroup = [];
        formData.map((p, pIndex) => {
            p.map((d) => {
                d.grid.map((g, gIndex) => {
                    g.forms.map((f, fIndex) => {
                        if (f.condition.type) {
                            let check = this.onCheckConValue(f.condition.type)
                            if (!check) {
                                emptyArr.push(f.id)
                                emptyGroup.push(g.id)
                            }
                        }
                    })
                })
            })
        })
        if (emptyArr) {
            this.setState({
                emptyField: emptyArr,
                emptyGroup: emptyGroup
            })
        }
    }

    onCheckConValue(id) {
        const con = [...this.state.conditions]
        const find = this.findArrayElementById(con, id)
        if (find) {
            return find.visibility;
        }
        //return true;
    }

    sendFetchAjax(formData, url = hummeltPublicObj.ajax_url) {
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

    WpFetchApi(formData, path = hummeltRestEditorObj.public_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_app_form_builder':
                    if (data.status) {
                        const checkFieldPromise = new Promise((resolve, reject) => {
                            this.setState({
                                formData: data.record,
                                error_messages: data.error_messages,
                                page: data.page,
                                pages: data.pages,
                                settings: data.form_settings,
                                conditions: data.conditions,
                                con_fields: data.con_fields,
                                form_id: data.form_id,
                                random: data.random
                            })
                            resolve(data.record)
                        })

                        checkFieldPromise.then((resolve) => {
                            this.onCheckEmptyFields(resolve)
                        })
                    } else {
                        this.setState({
                            notFoundAlert: true,
                            notFoundMsg: data.msg
                        })
                    }
                    break;
                case 'check_form_condition':
                    const updCon = [...this.state.conditions]
                    const findCon = this.findArrayElementById(updCon, data.condition)
                    let conType = data.con_type;
                    switch (conType) {
                        case 'show':
                            findCon.visibility = !!data.status;

                            let emptyGroup = document.querySelectorAll('.condition-group');
                            for (let i = 0; i < emptyGroup.length; i++) {
                                if (emptyGroup[i].hasAttribute('data-id') && emptyGroup[i].getAttribute('data-id') === data.condition) {
                                    if (data.status) {
                                        emptyGroup[i].classList.remove('g-0')
                                    } else {
                                        emptyGroup[i].classList.add('g-0');
                                    }
                                }
                            }
                            break;
                        case 'hide':
                            findCon.visibility = !data.status;
                            if (data.status) {
                                sleep(50).then(() => {
                                    this.onDocumentAddEmptyGroups()
                                });
                            } else {
                                sleep(50).then(() => {
                                    this.onDocumentRemoveEmptyGroups()
                                });
                            }
                            break;
                        case 'deactivate':
                            findCon.deactivate = !!data.status;
                            break;
                        case 'activate':
                            findCon.deactivate = !data.status;
                            break;
                    }
                    this.setState({
                        conditions: updCon
                    })
                    break;
                case 'formular_builder_send':
                    this.setState({
                        showSendForm: false,
                        showSpamTerms: false
                    })
                    if (data.status) {
                        if (data.redirect && data.redirect_url) {
                            sleep(1000).then(() => {
                                window.location.href = data.redirect_url;
                                return false;
                            })
                        }
                        this.setState({
                            showSendError: true,
                            sendFormMsg: data.msg,
                            sendErrorLabel: '',
                            sendAlertType: 'success',
                            sendErrorMsgHeadline: '',
                            reset_formular: true
                        })
                    } else {
                        this.setState({
                            showSendError: true,
                            sendFormMsg: data.msg,
                            sendErrorLabel: data.error_label,
                            sendAlertType: 'danger',
                            sendErrorMsgHeadline: data.error_headline
                        })
                    }
                    break;
            }
        }).catch(
            (error) => {
                if (error.code === 'rest_permission_error' || error.code === 'rest_failed') {
                    console.log(error.message);
                }
            }
        );
    }

    render() {

        const NotFoundAlert = () => {
            return (
                this.state.notFoundAlert ? (
                    <Alert variant={"danger"}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {this.state.notFoundMsg}
                    </Alert>) : (<></>)
            )
        }
        return (
            <Fragment>
                <NotFoundAlert/>
                <BsFormBuilder
                    formData={this.state.formData}
                    pages={this.state.pages}
                    page={this.state.page}
                    settings={this.state.settings}
                    emptyField={this.state.emptyField}
                    emptyGroup={this.state.emptyGroup}
                    builder_id={this.props.id}
                    form_id={this.state.form_id}
                    random={this.state.random}
                    error_messages={this.state.error_messages}
                    showSpamTerms={this.state.showSpamTerms}
                    showSendForm={this.state.showSendForm}
                    showSendError={this.state.showSendError}
                    sendFormMsg={this.state.sendFormMsg}
                    sendErrorLabel={this.state.sendErrorLabel}
                    sendAlertType={this.state.sendAlertType}
                    sendErrorMsgHeadline={this.state.sendErrorMsgHeadline}
                    reset_formular={this.state.reset_formular}
                    WpFetchApi={this.WpFetchApi}
                    onGetFormBuilder={this.onGetFormBuilder}
                    onCheckEmptyFields={this.onCheckEmptyFields}
                    onSetFormPage={this.onSetFormPage}
                    onSetFormTextTypes={this.onSetFormTextTypes}
                    onSwitchTypeValue={this.onSwitchTypeValue}
                    onCheckboxTypeValue={this.onCheckboxTypeValue}
                    onSelectedTypeValue={this.onSelectedTypeValue}

                    onFindConditionForms={this.onFindConditionForms}
                    onFindConditionDisabledForms={this.onFindConditionDisabledForms}
                    onSetStateSpamTerms={this.onSetStateSpamTerms}
                    onSetStateSendForm={this.onSetStateSendForm}
                    onSetFormUploadTypes={this.onSetFormUploadTypes}
                    onSetStateShowSendError={this.onSetStateShowSendError}
                    onSetStateResetFormular={this.onSetStateResetFormular}

                />
            </Fragment>
        )
    }
}