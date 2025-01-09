const {Component, Fragment} = wp.element;
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import {v4 as uuidv4} from "uuid";
export default class TextType extends Component {
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
                        data-condition={this.props.form.condition ? this.props.form.condition.type : ''}
                        controlId={uuidv4()}
                        label={`${this.props.form.label} ${this.props.form.required ? '*' : ''}`}
                        className={`${this.props.form.config.custom_class} ${this.props.form.condition ? 'condition' : ''}`}
                    >
                        <Form.Control
                            required={this.props.form.required}
                            type={this.props.form.type}
                            disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                            defaultValue={this.props.form.config.default || ''}
                            autoComplete={`${this.props.form.type === 'password' ? 'new-password' : 'off'}`}
                            onChange={(e) => this.props.onSetFormTextTypes(e.currentTarget.value, this.props.form.id)}
                            placeholder={this.props.form.config.placeholder}/>
                        {this.props.form.required ? (
                            <Form.Control.Feedback type="invalid">
                                {this.props.form.err_msg || ''}
                            </Form.Control.Feedback>) : (<></>)}
                        {this.props.form.config.caption ? (
                            <Form.Text className="text-muted">
                                {this.props.form.config.caption || ''}
                            </Form.Text>) : (<></>)}
                    </FloatingLabel>
                ) : (
                    <Form.Group
                        className={this.props.form.config.custom_class}
                        controlId={uuidv4()}>
                        {this.props.form.hide_label ? (<></>) : (
                            <Form.Label>
                                {this.props.form.label} {this.props.form.required ? ' *' : ''}
                            </Form.Label>)}
                        <Form.Control
                            type={this.props.form.type}
                            aria-label={this.props.form.label}
                            disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                            autoComplete={`${this.props.form.type === 'password' ? 'new-password' : 'off'}`}
                            defaultValue={this.props.form.config.default || ''}
                            onChange={(e) => this.props.onSetFormTextTypes(e.currentTarget.value, this.props.form.id)}
                            required={this.props.form.required}
                            placeholder={this.props.form.config.placeholder}/>
                        {this.props.form.required ? (
                            <Form.Control.Feedback type="invalid">
                                {this.props.form.err_msg || ''}
                            </Form.Control.Feedback>) : (<></>)}
                        {this.props.form.config.caption ? (
                            <Form.Text className="text-muted">
                                {this.props.form.config.caption || ''}
                            </Form.Text>) : (<></>)}
                    </Form.Group>
                )}
            </Fragment>
        )
    }
}