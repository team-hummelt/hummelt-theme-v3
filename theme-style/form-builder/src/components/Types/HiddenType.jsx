const {Component, Fragment} = wp.element;
export default class HiddenType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }
    render() {
        return (
            <Fragment>
                <input type="hidden" value={this.props.form.config.default}/>
            </Fragment>
        )
    }
}