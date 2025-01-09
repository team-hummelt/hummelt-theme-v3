import {Card, CardBody} from "react-bootstrap";
import FontLoop from "./loops/FontLoop.jsx";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class FontBody extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {

        }
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.theme_design &&
                    <Fragment>
                        <Card className="shadow-sm my-2">
                            <CardBody>
                                <h6>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Schrift Einstellungen
                                </h6>
                                <hr/>
                                {this.props.settings.theme_design.theme_font &&
                                    <Fragment>
                                        {this.props.settings.theme_design.theme_font.map((h, i) => {
                                            return (
                                                <Fragment key={i}>
                                                    <FontLoop
                                                        fonts={this.props.fonts}
                                                        settings={h}
                                                        handle="theme_font"
                                                        schriftStilSelect={this.props.schriftStilSelect}
                                                        onSetFontSettings={this.props.onSetFontSettings}
                                                    />
                                                </Fragment>
                                            )
                                        })}
                                    </Fragment>
                                }
                            </CardBody>
                        </Card>
                    </Fragment>}
            </Fragment>
        )
    }
}