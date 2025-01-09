const {Component, Fragment} = wp.element;
import Form from 'react-bootstrap/Form';
import {v5 as uuidv5, v4 as uuidv4} from "uuid";
const v5NameSpace = '1e63ac42-9312-4db3-8d06-5e45305a2f12';
export default class CheckboxType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}

        this.onClickSvg = this.onClickSvg.bind(this);
    }

    onClickSvg(id, checked, formId) {

       // this.props.onCheckboxTypeValue(o.id, !o.checked, this.props.form.id)
    }

    render() {
        return (
            <div className={`${this.props.form.config.custom_class}`}>
                {this.props.form.hide_label ? (<></>) : (
                    <div
                        id={uuidv4()}
                        className="text-truncate d-block mb-2">
                        {this.props.form.label}
                    </div>
                )}
                {this.props.form.options.map((o, index) => {

                    return (
                        <span className="form-custom-checkbox me-3" key={index}>
                            {this.props.form.config.animated ?
                                    <div className="animated-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={o.checked}
                                            onChange={() => this.props.onCheckboxTypeValue(o.id, !o.checked, this.props.form.id)}
                                            id={o.id}/>
                                        <label  htmlFor={o.id} id={uuidv4()}>
                                            <svg style={{stroke: this.props.form.config.animated_color || '#0165E7'}} className={`${o.checked ? '' : ''} reverse`} viewBox="0 0 100 100">
                                                <path className="box" d="M82,89H18c-3.87,0-7-3.13-7-7V18c0-3.87,3.13-7,7-7h64c3.87,0,7,3.13,7,7v64C89,85.87,85.87,89,82,89z"/>
                                                <polyline className="check" points="25.5,53.5 39.5,67.5 72.5,34.5 "/>
                                            </svg>
                                            <span>{o.label + (o.required ? ' *' : '')}</span>
                                        </label>
                                    </div>
                                 :
                            <Form.Check

                                disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                                inline={this.props.form && this.props.form.config.inline || false}
                                className={`text-field-check`}
                                type={this.props.form && this.props.form.config.switch ? 'switch' : 'checkbox'}
                                id={uuidv4()}
                                checked={o.checked}
                                onChange={() => this.props.onCheckboxTypeValue(o.id, !o.checked, this.props.form.id)}
                                label={o.label + (o.required ? ' *' : '')}
                                required={o.required}
                                feedback={o.err_msg || ''}
                                feedbackType="invalid"
                            />}
                        </span>
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