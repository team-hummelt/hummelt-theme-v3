const {Component, Fragment} = wp.element;

export default class HrType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }

    render() {
        return (
            <Fragment>
                <hr className={`mx-auto ${this.props.form.config.custom_class}`} style={{width: this.props.form.config.default+'%'}}/>
            </Fragment>
        )
    }
}