import * as React from "react";

export default class SetAjaxResponse extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            data: {},
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.props.msg ? (
                    <small className="ajax-response fw-normal">
                        <i className={`me-2 ${this.props.status ? ' text-success fw-bold bi bi-check2-circle' : ' text-danger bi bi-exclamation-triangle'}`}></i>
                        <span style={{color: this.props.color ? '#606060' : '#dbdbdb'}}>{this.props.status ? 'Saved! Last: '  : ''}{this.props.msg}</span>
                    </small>
                ) : ''}
            </React.Fragment>
        )
    }
}