const {Component, Fragment} = wp.element;
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4} from "uuid";
export default class RadioType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
    }

    render() {
        return (
            <div className={this.props.form.config.custom_class}>
                {this.props.form.hide_label ? (<></>) : (
                    <div
                        id={uuidv4()}
                        className="text-truncate d-block mb-2">
                        {this.props.form.label}
                    </div>
                )}
                {this.props.form.options.map((o, index) => {
                    return (
                        <Form.Check
                            key={index}
                            disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                            inline={this.props.form && this.props.form.config.inline || false}
                            className={`text-field-check`}
                            type="radio"
                            defaultChecked={this.props.form.config.selected === o.id}
                            onClick={() => this.props.onSelectedTypeValue(o.id, this.props.form.id)}
                            name={this.props.form.id}
                            id={uuidv4()}
                            label={o.label + (o.required ? ' *' : '')}

                        />
                    )
                })}
                {this.props.form.config.caption ? (
                    <div className="form-text">
                        {this.props.form.config.caption}
                    </div>
                ) : (<></>)}
            </div>
        )
    }
}