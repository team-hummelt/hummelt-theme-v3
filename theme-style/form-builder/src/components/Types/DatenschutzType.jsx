const {Component, Fragment} = wp.element;
import Form from 'react-bootstrap/Form';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import parser from "html-react-parser";

export default class DatenschutzType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
        this.onChangeSvg = this.onChangeSvg.bind(this);
    }

    onChangeSvg(target, checked, id) {
        //  console.log(checked, target.target.form.querySelector('.animated-checkbox label svg'))
        let svg = target.target.form.querySelector('.animated-checkbox label svg');
        if (checked) {
            //  svg.classList.remove('reverse')
        }
        this.props.onSetFormTextTypes(!this.props.form.config.selected, this.props.form.id, true)
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

                {this.props.form.config.animated ?
                    <div className="animated-checkbox">
                        <input
                            type="checkbox"
                            checked={this.props.form.config.selected}
                            onChange={() => this.props.onSetFormTextTypes(!this.props.form.config.selected, this.props.form.id, true)}
                            id={this.props.form.id}/>
                        <label htmlFor={this.props.form.id} id={uuidv4()}>
                            <svg
                                style={{stroke: this.props.form.config.animated_color || '#0165E7'}}
                                className={`reverse`} viewBox="0 0 100 100">
                                <path className="box"
                                      d="M82,89H18c-3.87,0-7-3.13-7-7V18c0-3.87,3.13-7,7-7h64c3.87,0,7,3.13,7,7v64C89,85.87,85.87,89,82,89z"/>
                                <polyline className="check" points="25.5,53.5 39.5,67.5 72.5,34.5 "/>
                            </svg>
                            <span>{parser(this.props.form.config.link)}</span>
                        </label>
                    </div>
                    :
                    <Form.Check
                        inline={false}
                        disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                        className={`text-field-check ${this.props.form.config.custom_class}`}
                        type={this.props.form && this.props.form.config.switch ? 'switch' : 'checkbox'}
                        id={uuidv4()}
                        checked={this.props.form.config.selected || false}
                        onChange={() => this.props.onSetFormTextTypes(!this.props.form.config.selected, this.props.form.id, true)}
                        label={parser(this.props.form.config.link)}
                        required={true}
                        feedback={this.props.form.err_msg || ''}
                        feedbackType="invalid"
                    />}
                {this.props.form.config.caption ? (
                    <div className="form-text">
                        {this.props.form.config.caption}
                    </div>
                ) : (<></>)}

            </div>
        )
    }
}