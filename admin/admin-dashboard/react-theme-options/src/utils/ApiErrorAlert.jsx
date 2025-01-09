import Alert from 'react-bootstrap/Alert';
const {Component, Fragment} = wp.element;

export default class ApiErrorAlert extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
    }

    render() {
        return (
            <Fragment>
                {this.props.showApiError &&
                <Alert variant="danger" onClose={() => this.props.onSetApiError(false)} dismissible>
                    <div>
                        {this.props.apiErrorMsg}
                    </div>
                </Alert> }
            </Fragment>
        )
    }
}