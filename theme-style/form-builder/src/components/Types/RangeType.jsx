const {Component, Fragment} = wp.element;

import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
import {FormGroup} from "react-bootstrap";
export default class RangeType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }

    render() {
        let rand= uuidv4()
        return (
            <Fragment>
                <FormGroup className={`${this.props.form.required && this.props.form.config.default > 0 ? '' : 'is-invalid'} ${this.props.form.config.custom_class}`}>
                    {this.props.form.hide_label ? (<></>) : (
                        <Form.Label htmlFor={`rand-${rand}`} className="mb-0">
                            {this.props.form.label} {this.props.form.required ? ' *' : ''}
                        </Form.Label>)}
                    <div className="d-flex flex-column align-items-center">
                        <input
                            type="range"
                            id={`rand-${rand}`}
                            disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                            className="input-bs-form-range w-100"
                            min={this.props.form.config.min || ''}
                            max={this.props.form.config.max || ''}
                            step={this.props.form.config.step || ''}
                            defaultValue={this.props.form.config.default}
                            onChange={(e) => this.props.onSetFormTextTypes(e.currentTarget.value, this.props.form.id)}
                            required={this.props.form.required}
                        />
                        {this.props.form.config.show_value ? (
                            <div
                                className="d-flex mt-1">
                                {this.props.form.config.prefix ? (
                                    <div className="mx-1">
                                        {this.props.form.config.prefix}
                                    </div>
                                ) : ''}
                                <div className="text-center" style={{minWidth: '1.6rem'}}> {this.props.form.config.default}</div>
                                {this.props.form.config.suffix ? (
                                    <div className="mx-1">
                                        {this.props.form.config.suffix}
                                    </div>
                                ) : ''}
                            </div>
                        ) : ''}
                    </div>
                    {this.props.form.required ? (
                        <Form.Control.Feedback type="invalid">
                            {this.props.form.err_msg || 'Error'}
                        </Form.Control.Feedback>) : (<></>)}
                </FormGroup>

                {this.props.form && this.props.form.config.caption ? (
                        <div className="form-text">
                            {this.props.form.config.caption}
                        </div>
                    )
                    :
                    (<></>)}
            </Fragment>
        )
    }
}