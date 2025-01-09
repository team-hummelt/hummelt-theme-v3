const {Component, Fragment, createRef} = wp.element;
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
//Message
import FormSendAlert from "./components/Alerts/FormSendAlert";
//Types
import SwitchType from "./components/Types/SwitchType";
import DatenschutzType from "./components/Types/DatenschutzType";
import TextType from "./components/Types/TextType";
import DateType from "./components/Types/DateType";
import TextareaType from "./components/Types/TextareaType";
//import TinyMceType from "./components/Types/TinyMceType";
import SelectType from "./components/Types/SelectType";
import CheckboxType from "./components/Types/CheckboxType";
import ColorType from "./components/Types/ColorType";
import UploadType from "./components/Types/UploadType";
import ButtonType from "./components/Types/ButtonType";
import HiddenType from "./components/Types/HiddenType";
import HtmlType from "./components/Types/HtmlType";
import HrType from "./components/Types/HrType";
import RadioType from "./components/Types/RadioType";
import RangeType from "./components/Types/RangeType";
import RateType from "./components/Types/RateType";

import {v4 as uuidv4} from "uuid";

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class BsFormBuilder extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.builderForm = createRef();
        this.builderParent = createRef();
        this.builderEmailSpam = createRef();
        this.builderNameSpam = createRef();
        this.builderTermsSpam = createRef();
        this.state = {
            formValidated: false,
            showErrorMsg: false,
            tinyMceRef: '',
            showGrid: true,
        }
        this.onSubmitBsForm = this.onSubmitBsForm.bind(this);
        this.onPrevNextButton = this.onPrevNextButton.bind(this);
        this.onSetTinyRef = this.onSetTinyRef.bind(this);
        this.onSetStateErrorMsg = this.onSetStateErrorMsg.bind(this);
    }

    componentDidMount() {
        let content = document.getElementsByClassName("bs-form-builder-content");
        for (let i = 0; i < content.length; i++) {
            if (content[i].classList.contains('active')) {
                content[i].style.maxHeight = 100 + "%";
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let form = this.builderForm.current;
        if (this.state.showErrorMsg) {
            if (form.checkValidity() === true) {
                this.setState({
                    showErrorMsg: false
                })
            }
        }
        if (this.props.reset_formular) {
            this.setState({
                showErrorMsg: false,
                formValidated: false
            })
            this.props.onSetStateResetFormular(false)
        }
    }

    onSetTinyRef(ref) {
        this.setState({
            tinyMceRef: ref
        })
    }

    onSubmitBsForm(event) {
        const form = event.currentTarget;
        this.props.onSetStateSpamTerms(true);
        event.preventDefault();
        event.stopPropagation();

        this.setState({
            formValidated: true,
            showErrorMsg: false
        })
        if (form.checkValidity() === false) {
            this.setState({
                showErrorMsg: true
            })
            return false;
        }

        this.props.onSetStateSendForm(true);

        let updFormdata = [];
        this.props.formData.map((p, pIndex) => {
            p.map((d) => {
                d.grid.map((g, gIndex) => {
                    if (g.forms.length !== 0) {
                        g.forms.map((f, fIndex) => {
                            let optArr = [];
                            f.options.map((o, oIndex) => {
                                let item = {
                                    'id': o.id,
                                    'label': o.label || '',
                                    'default': o.default || '',
                                    'selected': o.selected || '',
                                    'checked': o.checked || '',
                                    'value': o.value || ''
                                }
                                optArr.push(item)
                            })
                            d = {
                                'grid': g.id,
                                'form': {
                                    'id': f.id,
                                    'label': f.label || '',
                                    'form_type': f.form_type,
                                    'type': f.type,
                                    'slug': f.slug,
                                    'options': optArr,
                                    'config': {
                                        'selected': f.config.selected || '',
                                        'default': f.config.default,
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

        sleep(50).then(() => {
            let formData = {
                'method': 'formular_builder_send',
                'form_ref': this.builderForm.current.id,
                'form_id': this.props.form_id,
                'builder': this.props.builder_id,
                'data': JSON.stringify(updFormdata),
                'email': this.builderEmailSpam.current.value,
                'name': this.builderNameSpam.current.value,
                'terms': this.builderTermsSpam.current.checked
            }
            this.props.WpFetchApi(formData)
        });
    }

    onPrevNextButton(event, page, type) {

        const form = event.target.form;
        if (type === 'next' && form.checkValidity() === false) {

            this.setState({
                formValidated: true,
                showErrorMsg: true
            })
            return false;
        } else {

            this.props.onSetFormPage(page)
            new bootstrap.Collapse('#bs-form-builder-content' + page, {
                toggle: true,
                parent: '#' + this.builderParent.current.id
            });
        }

        this.setState({
            formValidated: false,
            showErrorMsg: false
        })
    }

    onSetStateErrorMsg(status) {
        this.setState({
            showErrorMsg: status
        })
    }

    render() {

        return (
            <Fragment>
                <Form ref={this.builderForm} noValidate validated={this.state.formValidated}
                      onSubmit={this.onSubmitBsForm} id={this.props.random}>
                    <fieldset disabled={this.props.showSendForm}>
                        <Form.Group className="bs-form-builder-sp-form-controller" controlId={uuidv4()}>
                            <Form.Label>Your e-mail here</Form.Label>
                            <Form.Control
                                ref={this.builderEmailSpam}
                                type="email"
                                name="email"
                                autoComplete="off"
                                placeholder="Your e-mail here"/>
                        </Form.Group>
                        <Form.Group className="bs-form-builder-sp-form-controller" controlId={uuidv4()}>
                            <Form.Label>Your name here</Form.Label>
                            <Form.Control
                                ref={this.builderNameSpam}
                                type="text"
                                name="name"
                                autoComplete="off"
                                placeholder="Your name here"/>
                        </Form.Group>
                        {this.props.showSpamTerms ? (
                            <Form.Check
                                ref={this.builderTermsSpam}
                                autoComplete="off"
                                className="bs-form-builder-sp-form-controller"
                                type="checkbox"
                                defaultChecked={false}
                                id={uuidv4()}
                                name="terms"
                                label="Check this terms"
                            />
                        ) : ''}

                        <div ref={this.builderParent} id={`builder${this.props.random}`}>
                            {this.props.formData.map((p, pIndex) => {
                                return (
                                    <div id={`bs-form-builder-content${pIndex + 1}`} key={pIndex}
                                         className={`bs-form-builder-content collapse  ${pIndex === 0 ? 'show' : ''}`}>
                                        <Row className={this.props.settings.gutter}>
                                            {p.map((b, bIndex) => {
                                                return (
                                                    <Fragment key={bIndex}>
                                                        {b.grid.map((g, gIndex) => {
                                                            return (
                                                                <div key={gIndex}
                                                                     className={`col-12 ${g.css || ''} ${this.props.settings.col ? 'col-' + this.props.settings.col + '-' + g.col : ''}`}>
                                                                    {g.forms.map((f, fIndex) => {
                                                                        return (
                                                                            <Fragment key={fIndex}>
                                                                                {this.props.onFindConditionForms(f.condition.type || '') ? (<>
                                                                                    {f.type === 'switch' ? (
                                                                                        <SwitchType
                                                                                            form={f}
                                                                                            onSwitchTypeValue={this.props.onSwitchTypeValue}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {
                                                                                        f.type === 'text' ||
                                                                                        f.type === 'url' ||
                                                                                        f.type === 'email' ||
                                                                                        f.type === 'number' ||
                                                                                        f.type === 'phone' ||
                                                                                        f.type === 'password'
                                                                                            ? (
                                                                                                <TextType
                                                                                                    form={f}
                                                                                                    onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                                    onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                                />
                                                                                            ) : (<></>)}

                                                                                    {f.type === 'radio' ? (
                                                                                        <RadioType
                                                                                            form={f}
                                                                                            onSelectedTypeValue={this.props.onSelectedTypeValue}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'date' ? (
                                                                                        <DateType
                                                                                            form={f}
                                                                                            onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'privacy-check' ? (
                                                                                        <DatenschutzType
                                                                                            form={f}
                                                                                            onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'textarea' ? (
                                                                                        <TextareaType
                                                                                            form={f}
                                                                                            onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {/*}  {f.type === 'tinymce' ? (
                                                                                    <TinyMceType
                                                                                        onSetTinyRef={this.onSetTinyRef}
                                                                                        form={f}
                                                                                        onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                        onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                    />
                                                                                ) : (<></>)} {*/}
                                                                                    {f.type === 'select' ? (
                                                                                        <SelectType
                                                                                            form={f}
                                                                                            onSelectedTypeValue={this.props.onSelectedTypeValue}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'checkbox' ? (
                                                                                        <CheckboxType
                                                                                            form={f}
                                                                                            onCheckboxTypeValue={this.props.onCheckboxTypeValue}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}

                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'color' ? (
                                                                                        <ColorType
                                                                                            form={f}
                                                                                            onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'upload' ? (
                                                                                        <UploadType
                                                                                            form={f}
                                                                                            gridId={g.id}
                                                                                            random={this.props.random}
                                                                                            builder_id={this.props.builder_id}
                                                                                            onSetFormUploadTypes={this.props.onSetFormUploadTypes}
                                                                                            WpFetchApi={this.props.WpFetchApi}
                                                                                            onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'hidden' ? (
                                                                                        <HiddenType
                                                                                            form={f}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'button' ? (
                                                                                        <ButtonType
                                                                                            form={f}
                                                                                            onPrevNextButton={this.onPrevNextButton}
                                                                                            page={this.props.page}
                                                                                            pages={this.props.pages}
                                                                                            showSendForm={this.props.showSendForm}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                            onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'html' ? (
                                                                                        <HtmlType
                                                                                            form={f}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'hr' ? (
                                                                                        <HrType
                                                                                            form={f}
                                                                                        />
                                                                                    ) : (<></>)}
                                                                                    {f.type === 'range' ? (
                                                                                        <RangeType
                                                                                            form={f}
                                                                                            onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : ''}
                                                                                    {f.type === 'rating' ? (
                                                                                        <RateType
                                                                                            form={f}
                                                                                            onSetFormTextTypes={this.props.onSetFormTextTypes}
                                                                                            onFindConditionDisabledForms={this.props.onFindConditionDisabledForms}
                                                                                        />
                                                                                    ) : ''}
                                                                                </>) : (
                                                                                    <div
                                                                                        data-id={f.condition.type || ''}
                                                                                        className="empty-group"></div>)}

                                                                            </Fragment>
                                                                        )
                                                                    })}
                                                                </div>
                                                            )
                                                        })}
                                                    </Fragment>
                                                )
                                            })}
                                        </Row>
                                    </div>
                                )
                            })}
                        </div>
                    </fieldset>
                </Form>
                {this.props.showSendForm ? (
                    <div className="load send-form-info d-flex align-items-center mt-2">
                        <div className="spinner-border text-success spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="send text-muted ms-2">Formular wird gesendet</div>
                    </div>) : ''}
                {this.state.showErrorMsg ? (
                    <div className="form-field-error-info text-danger pt-3 pb-2">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {this.props.error_messages}
                    </div>
                ) : ''}
                <FormSendAlert
                    showSendError={this.props.showSendError}
                    sendFormMsg={this.props.sendFormMsg}
                    sendErrorLabel={this.props.sendErrorLabel}
                    sendAlertType={this.props.sendAlertType}
                    sendErrorMsgHeadline={this.props.sendErrorMsgHeadline}
                    onSetStateShowSendError={this.props.onSetStateShowSendError}
                />
            </Fragment>
        )
    }
}