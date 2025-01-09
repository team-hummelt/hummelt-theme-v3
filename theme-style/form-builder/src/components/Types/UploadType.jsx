const {Component, Fragment, createRef} = wp.element;
import {v4 as uuidv4} from "uuid";
import {dropzoneUpload} from "../utils/dropzoneUpload";
import Form from "react-bootstrap/Form";

export default class UploadType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.dropZoneContainer = createRef();
        this.dropZoneTemplate = createRef();
        this.dropZoneMessage = createRef();
        this.formRef = createRef();
        this.state = {}

        this.onDropzoneCallback = this.onDropzoneCallback.bind(this);
    }

    onDropzoneCallback(data, type) {
        switch (type) {
            case 'delete':
                let formData = {
                    'method': 'delete_upload_file',
                    'file_id': data.id,
                    'data': JSON.stringify(this.props.form.config.default),
                    'form_id': this.props.form.id,
                    'builder_id': this.props.builder_id,
                    'grid_id': this.props.gridId
                }
                this.props.WpFetchApi(formData)
                break;
            case 'upload':
                this.props.onSetFormUploadTypes(data, this.props.form.id)
                break;
        }
    }

    componentDidMount() {

        dropzoneUpload(this.onDropzoneCallback, this.props.form, this.dropZoneContainer.current.id, this.dropZoneTemplate.current.id, this.props.random, this.props.builder_id, this.props.gridId)
    }


    render() {

        return (
            <Fragment>
                <div className={`bs-form-builder-upload ${this.props.form.required && !this.props.form.config.default.files || !this.props.form.config.default.files.length ? 'is-invalid' : ''} ${this.props.form.config.custom_class} ${this.props.onFindConditionDisabledForms(this.props.form.condition.type || false) ? 'disabled' : ''}`}>
                    {this.props.form.hide_label ? '' : (
                        <div className="mb-1 upload-label">
                            {this.props.form.label}
                        </div>
                    )}
                    <div className="upload-inner position-relative">
                        <div className="upload-wrapper btn-open-file" ref={this.dropZoneContainer}
                             id={uuidv4()}>
                            <div ref={this.dropZoneTemplate} id={uuidv4()} className="file-row position-relative">

                                {/*}   <span className="preview"><img data-dz-thumbnail=""/></span>{*/}
                                <div className=" upload-box d-flex align-items-center">

                                    <div className="upload-success">
                                        <i className="bi bi-check2-circle me-2 text-success"></i>
                                    </div>
                                    <div data-dz-default="" className="dz-message dz-default"><span></span></div>
                                    <div className="name" data-dz-name=""></div>
                                    <div className="ms-auto">
                                        <div className="d-flex align-items-center">
                                            <div className="dz-size" data-dz-size=""></div>
                                            <div data-dz-remove=""
                                                 className="dz-remove position-absolute- ms-2">
                                                <i className="bi bi-x-circle cursor-pointer"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <b className="error text-danger fw-semibold"
                                   data-dz-errormessage=""></b>
                                <div className="progress dz-progress progress-stacked" role="progressbar"
                                     aria-valuemin="0"
                                     aria-valuemax="100" aria-valuenow="0">
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                                        style={{width: '0%'}}
                                        data-dz-uploadprogress=""></div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="upload-message position-absolute p-3 d-flex align-items-center w-100 h-100 justify-content-center">
                            {this.props.form.message.drag_file_txt}
                        </div>
                    </div>
                    {this.props.form.required ? (
                        <Form.Control.Feedback type="invalid">
                            {this.props.form.err_msg || 'Error'}
                        </Form.Control.Feedback>) : (<></>)}
                    <div className="d-flex flex-wrap">
                        {this.props.form.config.show_btn ? (
                            <button type="button"
                                    className="btn-open-file btn btn-outline-secondary d-none- my-2 btn-sm">
                                {this.props.form.config.datei_select_txt}
                            </button>) : (<></>)}
                    </div>

                </div>
            </Fragment>
        )
    }
}