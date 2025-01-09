import {v4 as uuidv4} from "uuid";
import Form from "react-bootstrap/Form";
import TinyMce from "../../../AppComponents/TinyMce";

export default class TinyMceType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.tinyMce = React.createRef();
        this.state = {
            initValue: '',
            editorOptions: {
                height: 350,
                menubar: true,
                promotion: false,
                branding: false,
                language: 'de',
                image_advtab: true,
                image_uploadtab: true,
                image_caption: true,
                importcss_append: false,
                browser_spellcheck: true,
                toolbar_sticky: true,
                toolbar_mode: 'wrap',
                statusbar: true,
                draggable_modal: true,
                relative_urls: true,
                remove_script_host: false,
                convert_urls: false,
                //content_css: '/css/bs-tiny/bootstrap.min.css',
                content_css: false,
                valid_elements: '*[*]',
                schema: "html5",
                verify_html: false,
                valid_children: "+a[div], +div[*]",
                extended_valid_elements: "div[*]",
                file_picker_types: 'image',
            }
        }
        this.onLoadTinyMce = this.onLoadTinyMce.bind(this);
        this.editorCallbackContent = this.editorCallbackContent.bind(this);

    }

    componentDidMount() {
        this.setState({
            initValue: this.props.form.config.default || ''
        })
    }
    editorCallbackContent(content) {
        this.onLoadTinyMce()
    }

    onLoadTinyMce() {
        let content = tinymce.activeEditor.getContent();
        this.props.onSetFormTextTypes(content, this.props.form.id)
    }

    render() {
        return (
            <>
                <div
                    className={`bs-form-form-tinymce ${this.props.form.required && this.props.form.config.default === '' ? 'is-invalid' : ''} ${this.props.onFindConditionDisabledForms(this.props.form.condition.type || false) ? 'disabled' : ''}`}>
                    <TinyMce
                        editorCallbackContent={this.editorCallbackContent}
                        initialValue={this.state.initValue}
                        content={this.props.form.config.default || ''}
                        editorOptions={this.state.editorOptions}
                    />
                    {this.props.form.required ? (
                        <Form.Control.Feedback type="invalid">
                            {this.props.form.err_msg || 'Error'}
                        </Form.Control.Feedback>) : (<></>)}
                </div>
            </>
        )
    }
}