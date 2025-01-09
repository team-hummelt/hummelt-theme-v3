const {Component, Fragment} = wp.element;
import Dropzone from 'react-dropzone'

export default class DropzoneUpload extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            acceptFiles: []
        }

        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(acceptedFiles) {
        this.setState({
            acceptFiles: acceptedFiles
        })
        let formData;
        acceptedFiles.map((file) => {
            formData = {
                'file': file,
                'method': 'import_page_builder'
            }
            this.props.sendFetchAjax(formData)
        })
    }


    render() {
        return (
            <>
                <div className="col-xl-6 mx-auto ">
                    <Dropzone
                        onDrop={this.onDrop}
                        accept={{
                            'application/json': ['.json'],
                        }}
                        multiple={false}
                    >
                        {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
                            return (
                                <div
                                    className="react-dropzone border rounded bg-body-secondary mt-4 mb-2 text-center p-3" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {!isDragActive && 'Datei hier per Drag & Drop ablegen oder klicken.'}
                                    {isDragActive && !isDragReject && 'Datei ablegen'}
                                    {isDragReject && 'Dateityp nicht akzeptiert!'}
                                </div>
                            )
                        }
                        }
                    </Dropzone>
                    <div className="form-text text-center">Upload json File</div>
                </div>
            </>
        )
    }
}

