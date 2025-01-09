import {Card, CardBody} from "react-bootstrap";
import FontLoop from "./loops/FontLoop.jsx";
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;

export default class FontHeadline extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
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
                                    Überschriften
                                </h6>
                                <hr/>
                                {this.props.settings.theme_design.font_headline &&
                                    <Fragment>
                                        {this.props.settings.theme_design.font_headline.map((h, i) => {
                                            return (
                                                <Fragment key={i}>
                                                    <FontLoop
                                                        fonts={this.props.fonts}
                                                        settings={h}
                                                        handle="font_headline"
                                                        second_label="Überschrift"
                                                        ist_gutenberg={this.props.settings.theme_wp_optionen.gutenberg_active}
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