const {Component, Fragment} = wp.element;

import {v4 as uuidv4} from "uuid";
import Form from "react-bootstrap/Form";

export default class ColorType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }

    render() {
        return (
            <Fragment>
                <Form.Group
                    className={this.props.form.config.custom_class}
                    controlId={uuidv4()}>
                    {this.props.form.hide_label ? (<></>) : (
                        <Form.Label>
                            {this.props.form.label} {this.props.form.required ? ' *' : ''}
                        </Form.Label>)}
                    <Form.Control
                        disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                        type={this.props.form.type}
                        aria-label={this.props.form.label}
                        autoComplete="off"
                        defaultValue={this.props.form.config.default || ''}
                        onChange={(e) => this.props.onSetFormTextTypes(e.currentTarget.value, this.props.form.id)}
                        required={this.props.form.required}
                        placeholder={this.props.form.config.placeholder}/>
                    {/*}   {this.props.form.required ? (
                        <Form.Control.Feedback type="invalid">
                            {this.props.form.err_msg || ''}
                        </Form.Control.Feedback>) : (<></>)}{*/}
                    {this.props.form.config.caption ? (
                        <Form.Text className="text-muted">
                            {this.props.form.config.caption || ''}
                        </Form.Text>) : (<></>)}
                </Form.Group>
            </Fragment>
        )
    }


}