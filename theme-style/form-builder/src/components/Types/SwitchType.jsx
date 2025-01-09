const {Component, Fragment} = wp.element;

export default class SwitchType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
    }

    render() {
        return (
            <div className={this.props.form.config.custom_class}>
                {this.props.form.hide_label ? (<></>) : (
                    <div className="d-block mb-2">
                        {this.props.form.label || ''}
                    </div>
                )}
                <div role="group" aria-label="btn-group"
                     className={`btn-group ${this.props.form.config.alignment === 'vertikal' ? ' btn-group-vertical' : ''} ${this.props.form.config.alignment === 'vertikal full-width' ? ' btn-group-vertical w-100' : ''} switch-btn-group ${this.props.form.config.btn_size} ${this.props.form.config.alignment}`}>
                    {this.props.form.options.map((o, index) => {
                        return (
                            <Fragment key={o.id}>
                                <button
                                    disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type || false)}
                                    type="button"
                                    onClick={() => this.props.onSwitchTypeValue(o.id, !o.default, this.props.form.id, this.props.form.type)}
                                    className={"text-nowrap btn btn-outline-primary" + (o.default ? ' active' : '')}>
                                    {o.label}
                                </button>
                            </Fragment>
                        )
                    })}
                </div>
                {this.props.form && this.props.form.config.caption ? (
                    <div className="form-text">
                        {this.props.form.config.caption}
                    </div>
                ) : (<></>)}
            </div>
        )
    }
}