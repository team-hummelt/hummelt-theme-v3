const {Component, Fragment} = wp.element;
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {v4 as uuidv4} from "uuid";
import Form from "react-bootstrap/Form";

export default class TextareaType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
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
                            disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                            type={this.props.form.type}
                            defaultValue={this.props.form.config.default || ''}
                            onChange={(e) => this.props.onSetFormTextTypes(e.currentTarget.value, this.props.form.id)}
                            autoComplete="off"
                            as="textarea"
                            style={{ height: this.props.form.config.height +'px' }}
                            //name={this.props.form.id}
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
                            disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                            aria-label={this.props.form.label}
                            autoComplete="off"
                            as="textarea"
                            rows={this.props.form.config.rows}
                            //name={this.props.form.id}
                            defaultValue={this.props.form.config.default || ''}
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