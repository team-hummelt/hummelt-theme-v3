//import * as React from "react";
import {dropzoneUpload} from "./dropzoneUpload";
import {v4 as uuidv4} from "uuid";

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));
export default class MediaUpload extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.dropZoneContainer = React.createRef();
        this.dropZoneTemplate = React.createRef();
        this.state = {
            data: {},
        }
        this.onDropzoneCallback = this.onDropzoneCallback.bind(this);

    }

    onDropzoneCallback(data, type) {
        switch (type) {
            case 'delete':
                this.props.onMediathekCallback(data, 'delete');
                break;
            case 'upload':
                this.props.onMediathekCallback(data, 'upload');
                break;
            case 'start_complete':
                this.props.onMediathekCallback(data, 'start_complete');
                break;
        }
    }

    componentDidMount() {

        let optionen = {
            maxFiles: this.props.maxFiles,
            chunking: this.props.chunking || false,
            assets: this.props.assets,
            container: this.dropZoneContainer.current.id,
            template: this.dropZoneTemplate.current.id,
            form_id: this.props.form_id,
            delete_after: this.props.delete_after || false,
            delete_after_time: this.props.delete_after_time || 2500
        };

        dropzoneUpload(
            this.onDropzoneCallback,
            optionen
        )
    }

    render() {
        return (
            <div className="media-upload">
                <div className="upload-inner position-relative">
                    <div className="upload-wrapper btn-open-file" ref={this.dropZoneContainer}
                         id={uuidv4()}>
                        <div ref={this.dropZoneTemplate} id={uuidv4()} className="file-row position-relative">
                            <div className=" upload-box me-2 d-flex align-items-center">
                                <span className="preview me-2">
                                    <img className="preview-img img-fluid" alt="" data-dz-thumbnail=""/>
                                </span>
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
                            <b className="error text-center text-danger fw-semibold"
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
                        Dateien hier per Drag & Drop ablegen oder klicken.
                    </div>
                </div>
            </div>
        )
    }
}