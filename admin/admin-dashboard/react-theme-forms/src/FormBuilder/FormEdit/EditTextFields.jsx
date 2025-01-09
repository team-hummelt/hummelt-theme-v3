const {Component, Fragment, createRef} = wp.element;
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import SelectLoop from "./SelectLoop";
import CheckLoop from "./CheckLoop";
import {FormGroup} from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';
import $ from "jquery";

export default class EditTextFields extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.settingsRef = createRef();
        this.state = {
            optionCollapse: false
        }
        this.onChangeOptionsCollapse = this.onChangeOptionsCollapse.bind(this);
        this.onChangeOptionsSingleCollapse = this.onChangeOptionsSingleCollapse.bind(this);
        this.onDeleteField = this.onDeleteField.bind(this);
        this.onChangeCondition = this.onChangeCondition.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.onGetConditionTxt = this.onGetConditionTxt.bind(this);


    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    onGetConditionTxt(id) {
        if (id) {
            const con = [...this.props.selects.conditions]
            const find = this.findArrayElementById(con, id)
            if (find) {
                return find.label;
            }
        }
        return false;
    }

    onChangeOptionsCollapse() {
        this.setState({
            optionCollapse: !this.state.optionCollapse
        })
        $('.option-collapse').removeClass('active')
        const collapseElementList = document.querySelectorAll('.option-multi-collapse')
        const collapseList = [...collapseElementList].map(collapseEl => {
            let bsMulti = new bootstrap.Collapse(collapseEl, {
                toggle: false
            })
            if (!this.state.optionCollapse) {
                bsMulti.hide()
            } else {
                bsMulti.show()
            }
        })
    }

    onChangeOptionsSingleCollapse(e, target) {
        let current = $(e);

        const bsCollapse = new bootstrap.Collapse(target, {
            toggle: false
        })
        if ($(target).hasClass('show')) {
            bsCollapse.hide()
            if (!this.state.optionCollapse) {
                current.addClass('active')
            }

        } else {
            bsCollapse.show()
            current.removeClass('active')
        }

    }

    onDeleteField() {
        let formData = {
            'method': 'delete_form_input',
            'grid': this.props.editFormDataIds.grid_id,
            'group': this.props.editFormDataIds.group_id,
            'input_id': this.props.editFormDataIds.input_id,
            'form_id': this.props.formData.form_id,
        }


        let swal = {
            'title': `Formularfeld löschen?`,
            'msg': "Formularfeld wirklich löschen? Das Löschen kann nicht rückgängig gemacht werden.",
            'btn': "Löschen"
        }

        this.props.onDeleteSwalHandle(formData, swal)
    }

    onSetIdPlaceholder(e) {

    }

    onChangeCondition(e) {

        //onUpdateFormCondition
    }

    render() {
        let rand = uuidv4();
        let cRand = uuidv4();
        return (
            <>

                <div className="row gy-2">
                    <div className="col-12">
                        <Form.Group
                            controlId={uuidv4()}>
                            <Form.Label className="form-edit-label mb-1">Feld ID</Form.Label>
                            <Form.Control
                                className="no-blur"
                                type="text"
                                disabled={true}
                                value={this.props.formEdit.id || ''}
                                onChange={(e) => this.onSetIdPlaceholder(e)}
                                placeholder="Feld ID"/>
                        </Form.Group>
                    </div>


                    {this.onGetConditionTxt(this.props.formEdit.condition.type) ? (
                        <div className="col-12">
                            <hr/>
                            <div className="d-flex">
                                <i className="bi bi-arrow-return-right me-2"></i>
                                <div className="d-flex flex-column">
                                    <div className="fw-semibold">Bedingungen:</div>
                                    {this.onGetConditionTxt(this.props.formEdit.condition.type || '')}
                                </div>
                            </div>
                            <hr/>
                        </div>
                    ) : ''}
                    {this.props.formEdit.form_type === 'html' ||
                    this.props.formEdit.form_type === 'credit-card-date' ||
                    this.props.formEdit.form_type === 'credit-card' ||
                    this.props.formEdit.form_type === 'credit-card-cvc'
                        ? (<></>) : (
                            <div
                                className={"col-12 position-relative" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label="Label"
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit.label || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'label')}
                                        className="no-blur"
                                        placeholder="Label"/>
                                </FloatingLabel>
                            </div>)}
                    <div className="col-12">
                        <FloatingLabel
                            controlId={uuidv4()}
                            label="Slug"
                        >
                            <Form.Control
                                type="text"
                                disabled={this.props.formEdit.form_type === 'html'}
                                value={this.props.formEdit.slug || ''}
                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'slug')}
                                className="no-blur"
                                placeholder="Slug"/>
                        </FloatingLabel>
                        <div className="form-text">
                            Der Slug wird als Platzhalter für den Versand der E-Mail verwendet.
                        </div>
                    </div>

                    {this.props.formEdit.type === 'switch' ? (
                        <>
                            <div className={"col-12"}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label="Größe">
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.btn_size || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'btn_size', true)}
                                        aria-label="Größe">
                                        {this.props.selects.group_size.map((o, index) =>
                                            <option key={index} value={o.type}>
                                                {o.name}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>

                            <div className={"col-12"}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label="Ausrichtung">
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.alignment || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'alignment', true)}
                                        aria-label="Ausrichtung">
                                        {this.props.selects.group_alignment.map((o, index) =>
                                            <option key={index} value={o.type}>
                                                {o.name}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>

                        </>
                    ) : (<></>)}
                    {this.props.formEdit.type === 'button'
                        ? (<></>) : (
                            <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <hr/>
                                {this.props.formEdit.type === 'checkbox' ||
                                this.props.formEdit.type === 'switch' ||
                                this.props.formEdit.form_type === 'html' ||
                                this.props.formEdit.type === 'privacy-check' ||
                                this.props.formEdit.type === 'rating' ||
                                this.props.formEdit.type === 'radio' ? (<></>) : (<>
                                    <Form.Check
                                        className="no-blur mt-1"
                                        type="switch"
                                        id={uuidv4()}
                                        checked={this.props.formEdit.required || false}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'required')}
                                        label="Pflichtfeld"
                                    /></>)}
                                {this.props.formEdit.form_type === 'html' ? (<></>) : (<>
                                    <Form.Check
                                        className="no-blur mt-1"
                                        type="switch"
                                        id={uuidv4()}
                                        disabled={this.props.formEdit.floating}
                                        checked={this.props.formEdit.hide_label || false}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'hide_label')}
                                        label="Label ausblenden"
                                    /></>)}

                                {this.props.formEdit.type === 'tinymce' ||
                                this.props.formEdit.type === 'radio' ||
                                this.props.formEdit.type === 'switch' ||
                                this.props.formEdit.type === 'range' ||
                                this.props.formEdit.form_type === 'html' ||
                                this.props.formEdit.type === 'color' ||
                                this.props.formEdit.type === 'rating' ||
                                this.props.formEdit.form_type === 'upload' ||
                                this.props.formEdit.type === 'privacy-check' ||
                                this.props.formEdit.form_type === 'credit-card' ||
                                this.props.formEdit.type === 'checkbox' ? (<>
                                    <hr/>
                                </>) : (
                                    <>
                                        <Form.Check
                                            className="no-blur mt-1"
                                            type="switch"
                                            id={uuidv4()}
                                            checked={this.props.formEdit.floating || false}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'floating')}
                                            label="Floating label"
                                        />
                                        {this.props.formEdit.type === 'email' ?
                                            <Form.Check
                                                className="no-blur mt-1"
                                                type="switch"
                                                id={uuidv4()}
                                                checked={this.props.formEdit.is_autoresponder || false}
                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'is_autoresponder')}
                                                label="E-Mail für Autoresponder"
                                            />
                                            : ''}
                                        <hr/>
                                    </>
                                )}

                                {this.props.formEdit.type === 'checkbox' ||
                                this.props.formEdit.type === 'privacy-check' ||
                                this.props.formEdit.type === 'radio' ? (
                                        <>
                                            {this.props.formEdit.type === 'checkbox' ||
                                            this.props.formEdit.type === 'privacy-check'
                                                ? (
                                                    <Fragment>
                                                        <Form.Check
                                                            className="no-blur"
                                                            type="switch"
                                                            id={uuidv4()}
                                                            checked={this.props.formEdit !== '' ? this.props.formEdit.config.animated : false}
                                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'animated', true)}
                                                            label="Animierte Checkbox"
                                                        />
                                                        {this.props.formEdit !== '' && this.props.formEdit.config.animated ?
                                                            <Fragment>
                                                                <Form.Label
                                                                    className="mt-3"
                                                                    htmlFor={cRand}>Checkbox Farbe</Form.Label>
                                                                <Form.Control
                                                                    type="color"
                                                                    id={cRand}
                                                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.animated_color : ''}
                                                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'animated_color', true)}
                                                                    title="Wählen Sie Ihre Farbe"
                                                                /></Fragment> : ''}

                                                        {this.props.formEdit !== '' && this.props.formEdit.config.animated === false ?
                                                            <Form.Check
                                                                className="no-blur"
                                                                type="switch"
                                                                id={uuidv4()}
                                                                checked={this.props.formEdit !== '' ? this.props.formEdit.config.switch : false}
                                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'switch', true)}
                                                                label='Switch'
                                                            /> : ''}

                                                    </Fragment>) : (<></>)}
                                            {this.props.formEdit.type !== 'privacy-check' ? (
                                                <Fragment>
                                                    {this.props.formEdit !== '' && this.props.formEdit.config.animated === false ?
                                                        <Form.Check
                                                            className="no-blur mt-1"
                                                            type="switch"
                                                            id={uuidv4()}
                                                            checked={this.props.formEdit !== '' ? this.props.formEdit.config.inline : false}
                                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'inline', true)}
                                                            label='Inline'
                                                        /> : ''}
                                                </Fragment>) : (<></>)}
                                            <hr/>
                                        </>
                                    )
                                    :
                                    (<></>)}
                            </div>
                        )}
                    {this.props.formEdit.type === 'button' ||
                    this.props.formEdit.form_type === 'html' ? (<></>) : (
                        <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label='Beschreibung'
                            >
                                <Form.Control
                                    as="textarea"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.caption : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'caption', true)}
                                    className="no-blur"
                                    style={{height: '80px'}}
                                    placeholder={`Beschreibung`}/>
                            </FloatingLabel>
                        </div>)}

                    {this.props.formEdit.type === 'textarea' ? (
                        <div className="col-12">
                            {this.props.formEdit.floating ? (
                                <>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Höhe"
                                    >
                                        <Form.Control
                                            type="number"
                                            value={this.props.formEdit !== '' ? this.props.formEdit.config.height : ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'height', true)}
                                            className="no-blur"
                                            placeholder="Höhe"/>
                                    </FloatingLabel>
                                    <div className="form-text">
                                        Höhe in PX
                                    </div>
                                </>
                            ) : (
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label="Rows"
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.rows : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'rows', true)}
                                        className="no-blur"
                                        placeholder="Rows"/>
                                </FloatingLabel>
                            )}
                        </div>
                    ) : (<></>)
                    }
                    {
                        this.props.formEdit.type === 'button' ||
                        this.props.formEdit.type === 'tinymce' ||
                        this.props.formEdit.type === 'checkbox' ||
                        this.props.formEdit.type === 'radio' ||
                        this.props.formEdit.type === 'switch' ||
                        this.props.formEdit.type === 'date' ||
                        this.props.formEdit.type === 'color' ||
                        this.props.formEdit.form_type === 'upload' ||
                        this.props.formEdit.type === 'privacy-check' ||
                        this.props.formEdit.type === 'rating' ||
                        this.props.formEdit.form_type === 'html' ||
                        this.props.formEdit.form_type === 'credit-card' ||
                        this.props.formEdit.type === 'range' ||
                        this.props.formEdit.type === 'select' ? (<></>) : (
                            <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label="Platzhalter"
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.placeholder : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'placeholder', true)}
                                        className="no-blur"
                                        placeholder="Platzhalter"/>
                                </FloatingLabel>
                            </div>
                        )
                    }
                    {this.props.formEdit.type === 'privacy-check' ? (
                        <>
                            <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label="Datenschutz Checkbox Text"
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                        className="no-blur"
                                        placeholder="Datenschutz Checkbox Text"/>
                                </FloatingLabel>
                                <div className="form-text">
                                    Der Platzhalter {`{ Text }`} verlinkt den Text mit der Datenschutz URL / URI
                                </div>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label="Datenschutzseite">
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.id || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'id', true)}
                                        aria-label="Datenschutzseite">
                                        <option value="">auswählen</option>
                                        {this.props.selects.pages.map((o, index) =>
                                            <option key={index} value={o.id}>
                                                {o.title}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>
                            <Collapse in={this.props.formEdit.config.id === ''}>
                                <div id={uuidv4()}>
                                    <div className={"col-12"}>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="Datenschutz URL / URI"
                                        >
                                            <Form.Control
                                                type="text"
                                                value={this.props.formEdit !== '' ? this.props.formEdit.config.url : ''}
                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'url', true)}
                                                className="no-blur"
                                                placeholder="Datenschutz URL / URI"/>
                                        </FloatingLabel>
                                    </div>
                                </div>
                            </Collapse>

                            <div className="col-12">
                                <Form.Check
                                    className="no-blur mt-1"
                                    type="switch"
                                    id={uuidv4()}
                                    checked={this.props.formEdit !== '' ? this.props.formEdit.config.new_tab : false}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'new_tab', true)}
                                    label="In neuem Tab öffnen"
                                />
                            </div>
                        </>) : (<></>)}
                    {this.props.formEdit.type === 'html' ? (<></>) : (
                        <div className={"col-12" + (this.props.editFormDataIds.showFields ? '' : ' d-none')}>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label="Extra CSS Class"
                            >
                                <Form.Control
                                    type="text"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.custom_class : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'custom_class', true)}
                                    className="no-blur"
                                    placeholder="Extra CSS Class"/>
                            </FloatingLabel>
                        </div>)}
                    {
                        this.props.formEdit.type === 'select' ||
                        this.props.formEdit.type === 'radio' ||
                        this.props.formEdit.type === 'switch' ||
                        this.props.formEdit.type === 'date' ||
                        this.props.formEdit.form_type === 'upload' ||
                        this.props.formEdit.type === 'range' ||
                        this.props.formEdit.type === 'hr' ||
                        this.props.formEdit.type === 'rating' ||
                        this.props.formEdit.form_type === 'credit-card' ||
                        this.props.formEdit.type === 'privacy-check' ||
                        this.props.formEdit.type === 'checkbox' ? (<></>) : (
                            <div className={"col-12" + (this.props.formEdit.type === 'button' ? ' d-none' : '')}>
                                {this.props.formEdit.type === 'color' ? (<>

                                    <Form.Label htmlFor={rand}>Default</Form.Label>
                                    <Form.Control
                                        type="color"
                                        id={rand}
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                        title="Wählen Sie Ihre Farbe"
                                    />


                                </>) : (<></>)}
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label={this.props.formEdit.type === 'html' ? 'HTML' : 'Default'}
                                >
                                    {this.props.formEdit.type === 'html' ? (
                                        <Form.Control
                                            type="text"
                                            as="textarea"
                                            style={{height: '400px', overflowY: 'scroll'}}
                                            value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                            className={"no-blur"}
                                            placeholder='Default'/>
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                            className={"no-blur"}
                                            placeholder='Default'/>
                                    )}
                                </FloatingLabel>


                                {/*} <Select options={options} />
                                <CreatableSelect  isClearable options={options} /> {*/}

                            </div>)
                    }
                    {this.props.formEdit.type === 'hr' ? (
                        <div className="col-12">
                            <FloatingLabel
                                controlId={uuidv4()}
                                label='Breite'
                            >
                                <Form.Control
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                    className={"no-blur"}
                                    placeholder='Breite'/>
                            </FloatingLabel>
                        </div>
                    ) : (<></>)}
                    {
                        this.props.formEdit.type === 'button' ? (
                            <>
                                <div className={"col-12"}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label='Button Typ'>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.formEdit.config.btn_type || ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'btn_type', true)}
                                            aria-label='Button Typ'>
                                            {this.props.formEdit.options.map((o, index) =>
                                                <option key={index} value={o.type}>
                                                    {o.name}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                                <div className={"col-12"}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label='Button CSS'
                                    >
                                        <Form.Control
                                            type="text"
                                            value={this.props.formEdit !== '' ? this.props.formEdit.config.btn_class : ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'btn_class', true)}
                                            className="no-blur"
                                            placeholder='Button CSS'/>
                                    </FloatingLabel>
                                </div>
                            </>
                        ) : (<></>)
                    }

                    {
                        this.props.formEdit.type === 'tinymce' ? (
                            <>
                                <div className={"col-12"}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label='Sanitization Level'>
                                        <Form.Select
                                            className="no-blur"
                                            value={this.props.formEdit.config.sanitize || ''}
                                            onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'sanitize', true)}
                                            aria-label='Sanitization Level'>
                                            {this.props.formEdit.options.map((o, index) =>
                                                <option key={index} value={o.type}>
                                                    {o.name}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                            </>
                        ) : (<></>)
                    }
                    {
                        this.props.formEdit.type === 'select' ||
                        this.props.formEdit.type === 'radio' ||
                        this.props.formEdit.type === 'switch'
                            ? (
                                <div className={"col-12 builder-options-background"}>
                                    <hr/>
                                    <h5 className="fw-semibold mb-3">
                                        <i className="text-blue bi bi-caret-down me-2"></i>
                                        Optionen
                                    </h5>
                                    <hr/>
                                    <button onClick={() => this.props.onAddOptionsInputField('select')}
                                            className="btn btn-primary btn-sm">
                                        <i className="bi bi-node-plus me-2"></i>
                                        Option hinzufügen
                                    </button>
                                    <hr/>
                                    <div className="d-flex align-items-center pe-2 ps-3">
                                        <div>
                                            {this.props.formEdit.type === 'select' ||
                                            this.props.formEdit.type === 'switch' ? (<>
                                                <Form.Check
                                                    className="no-blur mb-1"
                                                    type="radio"
                                                    name={"standard"}
                                                    checked={this.props.formEdit.config.standard || false}
                                                    onChange={(e) => this.props.onUpdateEditOptionsTextField(e.currentTarget.value, 'standard', false)}
                                                    id={uuidv4()}
                                                    label='kein Standard'
                                                />
                                                {this.props.formEdit.type === 'select' ? (<>
                                                    <Form.Check
                                                        className="no-blur"
                                                        checked={this.props.formEdit.config.send_email || false}
                                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'send_email', true)}
                                                        id={uuidv4()}
                                                        label='E-Mail Empfänger'
                                                    />
                                                    {this.props.formEdit.config.send_email ? (
                                                        <div className="form-text">
                                                            Im Feld Value E-Mail Empfänger eintragen.
                                                        </div>) : (<></>)}
                                                </>) : (<></>)}
                                            </>) : (<></>)}

                                        </div>
                                        <div className="ms-auto">
                                            <i onClick={this.onChangeOptionsCollapse}
                                               className={"collapse-option-btn fw-normal fs-5" + (this.state.optionCollapse ? ' active' : '')}></i>
                                        </div>
                                    </div>
                                    <SelectLoop
                                        formEdit={this.props.formEdit}
                                        onUpdateSelectOptionsSortable={this.props.onUpdateSelectOptionsSortable}
                                        sortableOptions={this.props.sortableOptions}
                                        onUpdateSelectOptions={this.props.onUpdateSelectOptions}
                                        onDeleteSectionOption={this.props.onDeleteSectionOption}
                                        onChangeOptionsSingleCollapse={this.onChangeOptionsSingleCollapse}
                                        optionCollapse={this.state.optionCollapse}
                                        onUpdateEditOptionsTextField={this.props.onUpdateEditOptionsTextField}
                                    />
                                </div>
                            ) : (<></>)
                    }
                    {
                        this.props.formEdit.type === 'checkbox' ? (
                            <div className={"col-12 builder-options-background"}>
                                <hr/>
                                <h5 className="fw-semibold mb-3">
                                    <i className="text-blue bi bi-caret-down me-2"></i>
                                    Optionen
                                </h5>
                                <hr/>
                                <button onClick={() => this.props.onAddOptionsInputField('checkbox')}
                                        className="btn btn-primary btn-sm">
                                    <i className="bi bi-node-plus me-2"></i>
                                    Option hinzufügen
                                </button>
                                <hr/>
                                <div className="d-flex align-items-center pe-2 ps-3">
                                    <div className="ms-auto">
                                        <i onClick={this.onChangeOptionsCollapse}
                                           className={"collapse-option-btn fw-normal fs-5" + (this.state.optionCollapse ? ' active' : '')}></i>
                                    </div>
                                </div>
                                <CheckLoop
                                    formEdit={this.props.formEdit}
                                    onUpdateSelectOptionsSortable={this.props.onUpdateSelectOptionsSortable}
                                    sortableOptions={this.props.sortableOptions}
                                    onUpdateSelectOptions={this.props.onUpdateSelectOptions}
                                    onDeleteSectionOption={this.props.onDeleteSectionOption}
                                    onChangeOptionsSingleCollapse={this.onChangeOptionsSingleCollapse}
                                    optionCollapse={this.optionCollapse}
                                    onUpdateEditOptionsTextField={this.props.onUpdateEditOptionsTextField}
                                    onUpdateEditCheckboxTextField={this.props.onUpdateEditCheckboxTextField}
                                />

                            </div>
                        ) : (<></>)
                    }
                    {this.props.formEdit.type === 'date' ? (
                        <>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Datumstyp'>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.date_type || ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'date_type', true)}
                                        aria-label='Datumstyp'>
                                        {this.props.selects.date_formats.map((o, index) =>
                                            <option key={index} value={o.value}>
                                                {o.label}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>
                            <div className={"col-12"}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Datum von'
                                >
                                    <Form.Control
                                        type={this.props.formEdit.config.date_type || 'date'}
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.date_min : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'date_min', true)}
                                        className="no-blur"
                                        placeholder='Datum von'/>
                                </FloatingLabel>
                            </div>
                            <div className={"col-12"}>
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Datum bis'
                                >
                                    <Form.Control
                                        type={this.props.formEdit.config.date_type || 'date'}
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.date_max : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'date_max', true)}
                                        className="no-blur"
                                        placeholder='Datum bis'/>
                                </FloatingLabel>
                            </div>
                        </>
                    ) : (<></>)}
                    {this.props.formEdit.form_type === 'upload' ? (
                        <div className={"col-12"}>
                            <hr/>
                            <div className="fs-5 mt-2 mb-3 fw-semibold">Einstellungen</div>

                            <Form.Check
                                className="no-blur mb-1"
                                type="switch"
                                checked={this.props.formEdit.config.show_btn || false}
                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'show_btn', true)}
                                id={uuidv4()}
                                label='Button anzeigen'
                            />
                            {/*} <Form.Check
                                className="no-blur mb-1"
                                type="switch"
                                checked={this.props.formEdit.config.chunk_upload || false}
                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'chunk_upload', true)}
                                id={uuidv4()}
                                label={bsFormBuild.lang['Chunk Upload']}
                            />
                            <Form.Check
                                className="no-blur mb-3"
                                type="switch"
                                checked={this.props.formEdit.config.allowFileSizeValidation || false}
                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'allowFileSizeValidation', true)}
                                id={uuidv4()}
                                label={bsFormBuild.lang['Validation of the file size']}
                            />{*/}

                            <FloatingLabel
                                className={!this.props.formEdit.config.show_btn ? 'd-none' : ' mb-2'}
                                controlId={uuidv4()}
                                label='Button Text'
                            >
                                <Form.Control
                                    type="text"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.datei_select_txt : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'datei_select_txt', true)}
                                    className="no-blur"
                                    placeholder='Button Text'/>
                            </FloatingLabel>
                            {/*}<FloatingLabel
                                className={"mb-2"}
                                controlId={uuidv4()}
                                label={bsFormBuild.lang['Minimum file size (MB)']}
                            >
                                <Form.Control
                                    type="number"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.minFileSize : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'minFileSize', true)}
                                    className="no-blur"
                                    placeholder={bsFormBuild.lang['Minimum file size (MB)']}/>
                            </FloatingLabel>{*/}
                            <FloatingLabel
                                className={"mb-2"}
                                controlId={uuidv4()}
                                label='maximale Dateigröße (MB)'
                            >
                                <Form.Control
                                    type="number"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.maxFileSize : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'maxFileSize', true)}
                                    className="no-blur"
                                    placeholder='maximale Dateigröße (MB)'/>
                            </FloatingLabel>
                            {/*} <FloatingLabel
                                className={"mb-2"}
                                controlId={uuidv4()}
                                label={bsFormBuild.lang['maximum total upload size (MB)']}
                            >
                                <Form.Control
                                    type="number"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.maxTotalFileSize : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'maxTotalFileSize', true)}
                                    className="no-blur"
                                    placeholder={bsFormBuild.lang['maximum total upload size (MB)']}/>
                            </FloatingLabel> {*/}
                            <FloatingLabel
                                className={"mb-2"}
                                controlId={uuidv4()}
                                label='Max. Files pro E-Mail'
                            >
                                <Form.Control
                                    type="number"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.maxFiles : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'maxFiles', true)}
                                    className="no-blur"
                                    placeholder='Max. Files pro E-Mail'/>
                            </FloatingLabel>
                            <FloatingLabel
                                controlId={uuidv4()}
                                label='File-Upload MimeTypes'
                            >
                                <Form.Control
                                    type="text"
                                    value={this.props.formEdit !== '' ? this.props.formEdit.config.accept : ''}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'accept', true)}
                                    className="no-blur"
                                    placeholder='File-Upload MimeTypes'/>
                            </FloatingLabel>
                            <div className="form-text">
                                MimeTypes mit Komma oder Semikolon trennen.
                            </div>
                        </div>
                    ) : (<></>)}
                    {this.props.formEdit.type === 'range' ? (
                        <Fragment>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Default'
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                        className="no-blur"
                                        placeholder='Default'/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Minimum'
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.min : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'min', true)}
                                        className="no-blur"
                                        placeholder='Minimum'/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Maximum'
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.max : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'max', true)}
                                        className="no-blur"
                                        placeholder='Maximum'/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Schritt'
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.step : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'step', true)}
                                        className="no-blur"
                                        placeholder='Schritt'/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <Form.Check
                                    className="no-blur my-1"
                                    type="switch"
                                    checked={this.props.formEdit.config.show_value || false}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'show_value', true)}
                                    id={uuidv4()}
                                    label='Wert anzeigen'
                                />
                            </div>
                            {this.props.formEdit.config.show_value ? (
                                <Fragment>
                                    <div className="col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label='Prefix'
                                        >
                                            <Form.Control
                                                type="text"
                                                value={this.props.formEdit !== '' ? this.props.formEdit.config.prefix : ''}
                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'prefix', true)}
                                                className="no-blur"
                                                placeholder='Prefix'/>
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label='Suffix'
                                        >
                                            <Form.Control
                                                type="text"
                                                value={this.props.formEdit !== '' ? this.props.formEdit.config.suffix : ''}
                                                onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'suffix', true)}
                                                className="no-blur"
                                                placeholder='Suffix'/>
                                        </FloatingLabel>
                                    </div>
                                </Fragment>
                            ) : ''}
                        </Fragment>
                    ) : ''}
                    {this.props.formEdit.type === 'rating' ? (
                        <Fragment>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Default'
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.default : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'default', true)}
                                        className="no-blur"
                                        min={0}
                                        max={this.props.formEdit.config.count}
                                        placeholder='Default'/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Anzahl der Sterne'
                                >
                                    <Form.Control
                                        type="number"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.count : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'count', true)}
                                        className="no-blur"
                                        min={1}
                                        placeholder='Anzahl der Sterne'/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Bewertung Typ'>
                                    <Form.Select
                                        className="no-blur"
                                        value={this.props.formEdit.config.type}
                                        onChange={(e) => this.props.onUpdateEditStarField(e.currentTarget.value)}
                                        aria-label='Bewertung Typ'>
                                        {this.props.formEdit.options.map((r, index) =>
                                            <option key={index} value={r.id}>
                                                {r.name}
                                            </option>
                                        )}
                                    </Form.Select>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Schriftgröße'
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.font_size : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'font_size', true)}
                                        className="no-blur"
                                        placeholder='Schriftgröße'/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FloatingLabel
                                    controlId={uuidv4()}
                                    label='Abstand'
                                >
                                    <Form.Control
                                        type="text"
                                        value={this.props.formEdit !== '' ? this.props.formEdit.config.distance : ''}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'distance', true)}
                                        className="no-blur"
                                        placeholder='Abstand'/>
                                </FloatingLabel>
                            </div>
                            <div className="col-12">
                                <FormGroup
                                    className="d-flex justify-content-end flex-row-reverse align-items-center my-1"
                                    controlId={uuidv4()}
                                >
                                    <Form.Label
                                        className="ms-2">
                                        Farbe nicht aktiv
                                    </Form.Label>
                                    <Form.Control
                                        className="no-blur"
                                        type="color"
                                        value={this.props.formEdit.config.color}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'color', true)}
                                        title='Farbe nicht aktiv'
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <FormGroup
                                    className="d-flex justify-content-end flex-row-reverse align-items-center"
                                    controlId={uuidv4()}
                                >
                                    <Form.Label
                                        className="ms-2">
                                        Farbe aktiv
                                    </Form.Label>
                                    <Form.Control
                                        className="no-blur"
                                        type="color"
                                        value={this.props.formEdit.config.color_fill}
                                        onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.value, 'color_fill', true)}
                                        title='Farbe aktiv'
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <Form.Check
                                    className="no-blur my-1"
                                    type="switch"
                                    checked={this.props.formEdit.config.reset || false}
                                    onChange={(e) => this.props.onUpdateEditTextField(e.currentTarget.checked, 'reset', true)}
                                    id={uuidv4()}
                                    label='zurücksetzen aktiv'
                                />
                            </div>
                        </Fragment>
                    ) : ''}

                    <div className="col-12">
                        <hr/>
                        <button onClick={this.onDeleteField}
                                className="btn btn-danger btn-sm">
                            <i className="bi bi-trash me-2"></i>
                            Feld löschen
                        </button>

                    </div>

                </div>
            </>
        )
    }
}