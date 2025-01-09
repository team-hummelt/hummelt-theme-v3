

const {Component, Fragment, createRef} = wp.element;


const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class WPEditor extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.editorRef = createRef();
        this.editorInstance = null;
        this.state = {}

    }

    componentDidMount() {
        // TinyMCE initialisieren
        this.onLoadTinyMce()
    }

    onLoadTinyMce() {
        //wp.editor.remove(this.editorRef.current.id);
        wp.editor.initialize(this.editorRef.current.id, {
            tinymce: {
                wpautop: false,
                plugins: 'charmap colorpicker hr lists paste tabfocus textcolor wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern',
                toolbar1: 'undo,redo,formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,wp_adv,listbuttons',
                toolbar2: 'styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,wp_help',
                height: 350,
                setup: (editor) => {
                   // this.editorInstance = editor; // Speichert die Editor-Instanz
                    editor.on('change', () => {
                        const content = editor.getContent();
                        if (this.props.onUpdateFormEmailSettings) {
                            this.props.onUpdateFormEmailSettings(content, this.props.handle, 'message'); // Callback für Änderungen
                        }
                    });
                },
            },
            quicktags: {buttons: 'strong,em,link,block,del,ins,img,ul,ol,li,code,more,close'},
            mediaButtons: true,
        });

        const editor = tinymce.get(this.editorRef.current.id);
        if (editor) {
            // Initialen Inhalt setzen
            if (this.props.initialContent) {
                editor.setContent(this.props.initialContent);
            }
        }
    }

    componentWillUnmount() {
        // Editor entfernen, um Speicherlecks zu vermeiden
        if (wp.editor) {
            wp.editor.remove(this.editorRef.current);
        }
    }

    render() {
        return (
            <textarea
                className={`w-100 border-0`}
                ref={this.editorRef}
                id={this.props.id}>
                </textarea>
        );
    }
}