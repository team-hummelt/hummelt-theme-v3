const {Component, Fragment} = wp.element;
import Alert from 'react-bootstrap/Alert';

export default class FormSendAlert extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }
    //The slug is used as a placeholder for sending the e-mail.
    render() {
        return (
            <Fragment>
                {this.props.showSendError ? (
                <Alert className="bs-formbuilder-alert mt-3" variant={this.props.sendAlertType} onClose={() => this.props.onSetStateShowSendError(false)} dismissible>
                    {this.props.sendErrorMsgHeadline ? (
                    <Alert.Heading>{this.props.sendErrorMsgHeadline}</Alert.Heading>) : ''}
                    <div className={`bs-form-builder-alert-message ${this.props.sendAlertType === 'success' ? 'fs-5' : ''}`}>
                        {this.props.sendAlertType === 'success' ?
                            <i className="bi bi-check2 me-2"></i>
                            : ''}
                        {this.props.sendFormMsg}
                        {this.props.sendErrorLabel ? (
                            <small className="bs-formbuilder-error-labels d-block mt-1">
                               ( {this.props.sendErrorLabel} )
                            </small>) : ''}
                    </div>
                </Alert>) : ''}
            </Fragment>
        )
    }
}