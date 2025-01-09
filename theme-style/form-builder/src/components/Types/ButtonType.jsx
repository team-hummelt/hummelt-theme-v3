const {Component, Fragment} = wp.element;

export default class ButtonType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {}
    }

    render() {
        return (
            <Fragment>
                <div
                    className={this.props.form.config.custom_class ? this.props.form.config.custom_class : 'bs-form-button'}>
                    {this.props.form.config.btn_type === 'submit' ? (
                        <button type="submit"
                                disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type) || this.props.showSendForm}
                                className={`${this.props.form.config.btn_class ? this.props.form.config.btn_class : 'btn btn-secondary'}`}>
                            {this.props.form.label}
                        </button>
                    ) : (<></>)}
                    {this.props.form.config.btn_type === 'reset' ? (
                        <button type="reset"
                                className={`${this.props.form.config.btn_class ? this.props.form.config.btn_class : 'btn btn-secondary'}`}>
                            {this.props.form.label}
                        </button>
                    ) : (<></>)}
                    {
                        this.props.form.config.btn_type === 'prev'
                            ? (
                                <Fragment>
                                    {this.props.pages.includes(this.props.page -1) ? (
                                    <button onClick={(e) => this.props.onPrevNextButton(e, this.props.page-1, 'prev')}
                                        type="button"
                                            disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type) || this.props.showSendForm}
                                            className={`${this.props.form.config.btn_class ? this.props.form.config.btn_class : 'btn btn-secondary'}`}>
                                        {this.props.form.label}
                                    </button>) : (<></>)}
                                </Fragment>
                            ) : (<></>)}
                    {this.props.form.config.btn_type === 'next' ? (
                        <Fragment>
                            {this.props.pages.includes(this.props.page + 1) ? (
                                <button onClick={(e) => this.props.onPrevNextButton(e, this.props.page+1, 'next')}
                                        type="button"
                                        disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type) || this.props.showSendForm}
                                        className={`${this.props.form.config.btn_class ? this.props.form.config.btn_class : 'btn btn-secondary'}`}>
                                    {this.props.form.label}
                                </button>) : (<></>)}
                        </Fragment>
                    ) : (<></>)}
                    {this.props.form.config.btn_type === 'button' ? (
                        <Fragment>
                                <button  onClick={() => this.props.onSetFormTextTypes(!this.props.form.config.default, this.props.form.id)}
                                    type="button"
                                        disabled={this.props.onFindConditionDisabledForms(this.props.form.condition.type) || this.props.showSendForm}
                                        className={`${this.props.form.config.btn_class ? this.props.form.config.btn_class : 'btn btn-secondary'} ${this.props.form.config.default ? 'active' : ''}`}>
                                    {this.props.form.label}
                                </button>
                        </Fragment>
                    ) : (<></>)}
                </div>
            </Fragment>
        )
    }
}