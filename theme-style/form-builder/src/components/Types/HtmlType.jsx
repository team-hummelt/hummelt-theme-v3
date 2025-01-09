const {Component, Fragment} = wp.element;
import parser from "html-react-parser";
export default class HtmlType extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }

    render() {
        return (
            <>
                <div className="html-output">
                     {parser(this.props.form.config.default)}
                </div>
            </>
        )
    }


}