const {Component} = wp.element;
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import Collapse from 'react-bootstrap/Collapse';
import WPEditor from "../../utils/WPEditor.jsx";
const v5NameSpace = '9557a282-6f29-407b-b21f-401acfdcb948';
export default class FormEmailSettings extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            responderOpen: false,

        };
        this.onSaveFormEmailSettings = this.onSaveFormEmailSettings.bind(this);
        this.editorCallbackContent = this.editorCallbackContent.bind(this);
    }

    editorCallbackContent(content, handle) {
        console.log(content, handle)
        this.props.onUpdateFormEmailSettings(content, handle, 'email')
    }

    onSetPlaceholder(e, value, tiny) {
        e.classList.add('text-secondary')
        tinymce.activeEditor.selection.setContent(value)
    }

    onToggleResponder(open) {
        this.setState({
            responderOpen: open
        })
    }

    onSaveFormEmailSettings(event) {

        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {

            let formData = {
                'method': 'update_form_email_settings',
                'form_id': this.props.formData.form_id,
                'data': JSON.stringify(this.props.email_settings),
            }
            this.props.sendFetchApi(formData)
        }
    }



    render() {
        return (

            <div className="card shadow-sm ">
                <div className="card-header fs-5 fw-semibold py-3">
                    <i className="bi bi-envelope text-blue me-2"></i>
                    E-Mail Einstellungen
                </div>
                <div className="card-body">
                    <div className="col-xxl-10 col-xl-12 col-12 mx-auto">
                        {this.props.email_settings.email_select_active ? (
                            <div className="text-danger flicker-animation ms-2 py-2">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                Die E-Mail wird an den ausgewählten Empfänger gesendet.
                            </div>
                        ) : (<></>)}
                        <div className="p-3 border rounded">
                            <Form onSubmit={this.onSaveFormEmailSettings}>
                                <div className="row g-3">
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={`E-Mail senden an ${this.props.email_settings.email_select_active ? '' : ' *'}`}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                required={!this.props.email_settings.email_select_active}
                                                value={this.props.email_settings.email.recipient || ''}
                                                onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'email', 'recipient')}
                                                type="email"
                                                placeholder="name@example.com"/>
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label={`Betreff *`}
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                required={true}
                                                value={this.props.email_settings.email.subject || ''}
                                                onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'email', 'subject')}
                                                type="text"
                                                placeholder="Betreff"/>
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="Cc.."
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                type="text"
                                                value={this.props.email_settings.email.cc || ''}
                                                onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'email', 'cc')}
                                                placeholder="Cc.."/>
                                        </FloatingLabel>
                                        <div className="form-text">
                                            Trennen Sie mehrere Empfänger durch Komma oder Semikolon.
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label="Bcc.."
                                        >
                                            <Form.Control
                                                className="no-blur"
                                                type="text"
                                                value={this.props.email_settings.email.bcc || ''}
                                                onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'email', 'bcc')}
                                                placeholder="Bcc.."/>
                                        </FloatingLabel>
                                        <div className="form-text">
                                            Trennen Sie mehrere Empfänger durch Komma oder Semikolon.
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-3 fs-5 fw-semibold">
                                            Nachricht:
                                        </div>
                                        <h6>Verfügbare Formular Platzhalter:</h6>
                                        <div className="d-flex flex-wrap">
                                            {this.props.inputFields.map((f, index) => {
                                                return (
                                                    <div key={index}>
                                                        {index > 0 ? (
                                                            <span className="mx-1 text-muted">•</span>) : (<></>)}
                                                        <span
                                                            onClick={(e) => this.onSetPlaceholder(e.currentTarget, `{${f.slug}}`, 'tinyEmailNachricht')}
                                                            className="text-primary small cursor-pointer"
                                                        >
                                                     {`{${f.slug}}`}
                                                     </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <span
                                            onClick={(e) => this.onSetPlaceholder(e.currentTarget, `{summary}`, 'tinyEmailNachricht')}
                                            className="mt-2 fw-semibold text-summary d-inline-block mb-3 cursor-pointer"
                                        >
                                          <span className="text-success d-inline-block">{`{summary}`}</span>
                                         </span>
                                        {this.props.email_settings && this.props.email_settings.email &&
                                        <WPEditor
                                            id={uuidv5('email', v5NameSpace)}
                                            initialContent={this.props.email_settings.email.message || ''}
                                            handle={`email`}
                                            onUpdateFormEmailSettings={this.props.onUpdateFormEmailSettings}
                                        /> }

                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary">
                                            <i className="bi bi-save2 me-2"></i>
                                            Speichern
                                        </button>
                                    </div>
                                    <hr/>
                                </div>
                            </Form>


                            <div className="row g-2">
                                <div className="col-12">
                                    <div className="fs-5 fw-semibold">
                                        Automatische Antwort
                                        <small
                                            className={"d-block fw-normal fs-6 small-xl mt-1" + (this.props.email_settings.responder.active ? ' text-success' : ' text-danger')}>
                                            {this.props.email_settings.responder.active ? 'aktiv' : 'nicht aktiv'}
                                        </small>
                                    </div>
                                    <button onClick={() => this.onToggleResponder(!this.state.responderOpen)}
                                            aria-controls="responder-edit"
                                            aria-expanded={this.state.responderOpen}
                                            className="btn btn-switch-blue-outline mt-2 btn-sm">
                                        <i className="bi bi-toggle-on me-2"></i>
                                        {this.state.responderOpen ? 'ausblenden' : 'anzeigen'}
                                    </button>
                                    <Collapse in={this.state.responderOpen}>
                                        <div id="responder-edit">
                                            <Form onSubmit={this.onSaveFormEmailSettings}>
                                                <hr/>
                                                <div className="fs-5 fw-semibold">
                                                    Autoresponder Einstellungen
                                                </div>
                                                <hr/>
                                                {/*}  {this.props.email_settings.email_select_active ? (
                                                    <div className="text-danger flicker-animation mb-2 py-2">
                                                        <i className="bi bi-exclamation-circle me-2"></i>
                                                        {trans['forms']['The e-mail is sent to the selected recipient.']}
                                                    </div>
                                                ) : (<></>)} {*/}
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    className="no-blur mb-3"
                                                    id="custom-switch"
                                                    checked={this.props.email_settings.responder.active || ''}
                                                    onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.checked, 'responder', 'active')}
                                                    label='aktiv'
                                                />
                                                <div className="col-12 mb-3">
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label='Betreff *'
                                                    >
                                                        <Form.Control
                                                            className="no-blur"
                                                            required={true}
                                                            value={this.props.email_settings.responder.subject || ''}
                                                            onChange={(e) => this.props.onUpdateFormEmailSettings(e.currentTarget.value, 'responder', 'subject')}
                                                            type="text"
                                                            placeholder="Betreff"/>
                                                    </FloatingLabel>
                                                </div>
                                                <div className="mb-3 fs-5 fw-semibold">
                                                    Nachricht:
                                                </div>
                                                <h6>Verfügbare Formular Platzhalter:</h6>
                                                <div className="d-flex flex-wrap mb-3">
                                                    {this.props.inputFields.map((f, index) => {
                                                        return (
                                                            <div key={index}>
                                                                {index > 0 ? (
                                                                    <span
                                                                        className="mx-1 text-muted">•</span>) : (<></>)}
                                                                <span
                                                                    onClick={(e) => this.onSetPlaceholder(e.currentTarget, `{${f.slug}}`, 'tinyEmailResponder')}
                                                                    className="text-primary small cursor-pointer"
                                                                >
                                                          {`{${f.slug}}`}
                                                          </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <span
                                                    onClick={(e) => this.onSetPlaceholder(e.currentTarget, `{summary}`, 'tinyEmailResponder')}
                                                    className="mt-2 fw-semibold text-summary d-block mb-3 cursor-pointer"
                                                >
                                                  <span className="text-success d-inline-block">{`{summary}`}</span>
                                                 </span>
                                                {this.props.email_settings && this.props.email_settings.responder &&
                                                    <WPEditor
                                                        id={uuidv5('responder', v5NameSpace)}
                                                        initialContent={this.props.email_settings.responder.message || ''}
                                                        handle={`responder`}
                                                        onUpdateFormEmailSettings={this.props.onUpdateFormEmailSettings}
                                                    /> }

                                                <div className="col-12">
                                                    <button type="submit"
                                                            className="btn btn-outline-primary mt-3">
                                                        <i className="bi bi-save2 me-2"></i>
                                                        Autoresponder speichern
                                                    </button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Collapse>
                                </div>
                                <hr/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}