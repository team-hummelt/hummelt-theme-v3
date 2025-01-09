const {Component, Fragment} = wp.element;
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
export default class SelectType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
    }

    render() {
        return (
            <Fragment>
                {this.props.form.floating ? (
                    <FloatingLabel
                        controlId={uuidv4()}
                        label={`${this.props.form.label} ${this.props.form.required ? '*' : ''}`}>
                        <Form.Select
                            required={this.props.form.required}
                            disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                            value={this.props.form.config.selected}
                            onChange={(e) => this.props.onSelectedTypeValue(e.currentTarget.value, this.props.form.id)}
                            aria-label="label select">
                            {this.props.form.config.standard ? (
                                <option></option>
                            ) : (<></>)}
                            {this.props.form.options.map((o, index) =>
                                <option key={o.id} value={o.id}>
                                    {o.label}
                                </option>
                            )}
                        </Form.Select>
                        {this.props.form.required ? (
                            <Form.Control.Feedback type="invalid">
                                {this.props.form.err_msg}
                            </Form.Control.Feedback>) : (<></>)}
                        {this.props.form.config.caption ? (
                            <Form.Text className="text-muted">
                                {this.props.form.config.caption}
                            </Form.Text>) : (<></>)}
                    </FloatingLabel>
                ) : (
                <Form.Group
                    controlId={uuidv4()}
                >
                    {this.props.form.hide_label ? (<></>) : (
                        <div className="form-label">
                            {this.props.form.label} {this.props.form.required ? '*' : ''}
                        </div>
                    )}
                    <Form.Select
                        required={this.props.form.required}
                        disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                        value={this.props.form.config.selected}
                        onChange={(e) => this.props.onSelectedTypeValue(e.currentTarget.value, this.props.form.id)}
                        aria-label="Select-Field">
                        {this.props.form.config.standard ? (
                            <option></option>
                        ) : (<></>)}
                        {this.props.form.options.map((o, index) =>
                            <option key={o.id} value={o.id}>
                                {o.label}
                            </option>
                        )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {this.props.form.err_msg}
                    </Form.Control.Feedback>
                    {this.props.form.config.caption ? (
                        <div className="form-text">
                            {this.props.form.config.caption}
                        </div>
                    ) : (<></>)}
                </Form.Group>)}
            </Fragment>
        )
    }
}