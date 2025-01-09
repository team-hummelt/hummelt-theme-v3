const {Component} = wp.element;
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import {Col} from "react-bootstrap";

import Row from 'react-bootstrap/Row';

export default class FormMeldungen extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {
        return (
            <>

                <div className="card shadow-sm bg-body-tertiary mb-2">
                    <div className="card-header fs-5 fw-semibold py-3">
                        <div className="card-title">
                            Formular Meldungen
                        </div>
                    </div>
                    <div className="card-body ">
                        <h5> Formular:</h5>

                        <div className="row gy-2">
                            {this.props.message.form_message.map((m, index) => {
                                return (
                                    <div key={index} className="col-12">
                                        <div className={"my-1 text-body small"}>
                                            <i className="bi bi-exclamation-circle text-body me-2"></i>
                                            {m.label}
                                        </div>
                                        <FloatingLabel
                                            controlId={uuidv4()}
                                            label='Text'

                                        >
                                            <Form.Control
                                                className="no-blur border border-warning"
                                                type="text"
                                                value={m.value}
                                                onChange={(e) => this.props.onUpdateFormMessage(e.currentTarget.value, m.id, 'form')}
                                                placeholder='Text'/>
                                        </FloatingLabel>
                                    </div>
                                )
                            })}
                        </div>
                        <hr/>
                        <h5> Felder:</h5>

                        <div className="row gy-2 pb-3">
                            {this.props.message.field_message.map((m, index) => {
                                return (
                                    <div key={index} className="col-12">
                                        {m.type === 'checkbox' ? (
                                            <div className="row gy-2">
                                                {m.checkbox.map((c, cIndex) => {
                                                    return (
                                                        <div className="col-12" key={cIndex}>
                                                            <div className={"my-1 text-body small"}>
                                                                <i className="bi bi-exclamation-circle text-body me-2"></i>
                                                                {c.label}
                                                            </div>
                                                            <FloatingLabel
                                                                controlId={uuidv4()}
                                                                label='Text'
                                                            >
                                                                <Form.Control
                                                                    className="no-blur border border-warning"
                                                                    type="text"
                                                                    value={c.value}
                                                                    onChange={(e) => this.props.onUpdateFormMessage(e.currentTarget.value, m.id, 'checkbox', '', c.id)}
                                                                    placeholder='Text'/>
                                                            </FloatingLabel>
                                                        </div>
                                                    )
                                                })}

                                            </div>) : (<>
                                                {m.type === 'upload' && !m.required ? (<></>) : (
                                                    <>
                                                        <div className={"my-1 text-body small"}>
                                                            <i className="bi bi-exclamation-circle text-body me-2"></i>
                                                            {m.label}
                                                        </div>
                                                        <FloatingLabel
                                                            controlId={uuidv4()}
                                                            label='Text'
                                                        >
                                                            <Form.Control
                                                                className="no-blur border border-warning"
                                                                type="text"
                                                                value={m.value}
                                                                onChange={(e) => this.props.onUpdateFormMessage(e.currentTarget.value, m.id, 'field')}
                                                                placeholder='Text'/>
                                                        </FloatingLabel>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {m.type === 'upload' ? (
                                            <>
                                                <div
                                                     className="p-3 mx-4 border my-3 rounded">
                                                    <h6 className="mb-2">Uploader Meldungen</h6>
                                                    <Row className="g-2">
                                                        <Form.Group as={Col} xs={12} xxl={4} xl={6}
                                                                    controlId={uuidv4()}>
                                                            <Form.Label className="mb-1 small-lg">
                                                                {m.message.drag_file_label}
                                                            </Form.Label>
                                                            <Form.Control
                                                                className="no-blur"
                                                                size="sm"
                                                                type="text"
                                                                value={m.message.drag_file_txt}
                                                                onChange={(e) => this.props.onUpdateFormMessage(e.currentTarget.value, m.id, 'message', 'drag_file_txt')}
                                                                placeholder={m.message.drag_file_label}/>
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={12} xxl={4} xl={6}
                                                                    controlId={uuidv4()}>
                                                            <Form.Label className="mb-1 small-lg">
                                                                {m.message.invalid_type_label}
                                                            </Form.Label>
                                                            <Form.Control
                                                                className="no-blur"
                                                                size="sm"
                                                                type="text"
                                                                value={m.message.invalid_type_txt}
                                                                onChange={(e) => this.props.onUpdateFormMessage(e.currentTarget.value, m.id, 'message', 'invalid_type_txt')}
                                                                placeholder={m.message.invalid_type_label}/>
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={12} xxl={4} xl={6}
                                                                    controlId={uuidv4()}>
                                                            <Form.Label className="mb-1 small-lg">
                                                                {m.message.max_filesize_label}
                                                            </Form.Label>
                                                            <Form.Control
                                                                className="no-blur"
                                                                size="sm"
                                                                type="text"
                                                                value={m.message.max_filesize_txt}
                                                                onChange={(e) => this.props.onUpdateFormMessage(e.currentTarget.value, m.id, 'message', 'max_filesize_txt')}
                                                                placeholder={m.message.max_filesize_label}/>
                                                        </Form.Group>

                                                        <Form.Group as={Col} xs={12} xxl={4} xl={6}
                                                                    controlId={uuidv4()}>
                                                            <Form.Label className="mb-1 small-lg">
                                                                {m.message.max_total_file_label}
                                                            </Form.Label>
                                                            <Form.Control
                                                                className="no-blur"
                                                                size="sm"
                                                                type="text"
                                                                value={m.message.max_total_file_txt}
                                                                onChange={(e) => this.props.onUpdateFormMessage(e.currentTarget.value, m.id, 'message', 'max_total_file_txt')}
                                                                placeholder={m.message.max_total_file_label}/>
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={12} xxl={4} xl={6}
                                                                    controlId={uuidv4()}>
                                                            <Form.Label className="mb-1 small-lg">
                                                                {m.message.file_large_label}
                                                            </Form.Label>
                                                            <Form.Control
                                                                className="no-blur"
                                                                size="sm"
                                                                type="text"
                                                                value={m.message.file_large_txt}
                                                                onChange={(e) => this.props.onUpdateFormMessage(e.currentTarget.value, m.id, 'message', 'file_large_txt')}
                                                                placeholder={m.message.file_large_label}/>
                                                        </Form.Group>
                                                    </Row>
                                                </div>
                                            </>
                                        ) : (<></>)}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </>
        )
    }

}