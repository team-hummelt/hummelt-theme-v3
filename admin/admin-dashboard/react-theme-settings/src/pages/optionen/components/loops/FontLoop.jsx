import {Card, CardBody, Col, Row, CardHeader, Form, FloatingLabel} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";
import SimonColorPicker from "../../../../utils/SimonColorPicker.jsx";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;

export default class FontLoop extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onPickrCallback = this.onPickrCallback.bind(this);
    }

    onPickrCallback(color, handle) {
        this.props.onSetFontSettings(color, 'color', this.props.settings.id, this.props.handle)
    }

    render() {
        return (
            <Card className="mb-3">
                <CardHeader className="py-3 text-center-">
                    <b>{this.props.settings.label}</b> {this.props.second_label || ''}
                </CardHeader>
                <CardBody>
                    <fieldset>
                        <Col xxl={12} xl={10} xs={12} className="mx-auto- border rounded p-3">
                            <Row className="g-2">
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`Schriftfamilie`}
                                    >
                                        <Form.Select
                                            className="no-blur mw-100"
                                            disabled={this.props.settings.standard}
                                            value={this.props.settings['font-family'] || ''}
                                            onChange={(e) => this.props.onSetFontSettings(e.target.value, 'font-family', this.props.settings.id, this.props.handle)}
                                            aria-label={`Schriftfamilie`}>
                                            <option value="">auswählen</option>
                                            {this.props.fonts.map((select, index) =>
                                                <option key={index}
                                                        value={select.id}>
                                                    {select.designation}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`Schriftstil`}
                                    >
                                        <Form.Select
                                            disabled={this.props.settings.standard}
                                            className="no-blur mw-100"
                                            value={this.props.settings['font-style'] || ''}
                                            onChange={(e) => this.props.onSetFontSettings(e.target.value, 'font-style', this.props.settings.id, this.props.handle)}
                                            aria-label={`Schriftstil`}>
                                            <option value="">auswählen</option>
                                            {this.props.settings.stil_select.map((select, index) =>
                                                <option key={index}
                                                        value={select.id}>
                                                    {select.full_name}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={4} lg={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Schriftgröße Desktop"
                                    >
                                        <Form.Control
                                            disabled={this.props.settings.standard}
                                            className={`no-blur`}
                                            required={true}
                                            type="number"
                                            value={this.props.settings.size || ''}
                                            onChange={(e) => this.props.onSetFontSettings(e.target.value, 'size', this.props.settings.id, this.props.handle)}
                                            placeholder="Schriftgröße Desktop"/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={4} lg={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Schriftgröße Mobil"
                                    >
                                        <Form.Control
                                            disabled={this.props.settings.standard}
                                            className={`no-blur`}
                                            required={true}
                                            type="number"
                                            value={this.props.settings.size_sm || ''}
                                            onChange={(e) => this.props.onSetFontSettings(e.target.value, 'size_sm', this.props.settings.id, this.props.handle)}
                                            placeholder="Schriftgröße Mobil"/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={4} lg={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Zeilenhöhe"
                                    >
                                        <Form.Control
                                            disabled={this.props.settings.standard}
                                            className={`no-blur`}
                                            required={true}
                                            type="number"
                                            step={0.1}
                                            value={this.props.settings['line-height'] || ''}
                                            onChange={(e) => this.props.onSetFontSettings(e.target.value, 'line-height', this.props.settings.id, this.props.handle)}
                                            placeholder="Zeilenhöhe"/>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <div className="d-flex flex-wrap">
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-2 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.standard || false}
                                            onChange={(e) => this.props.onSetFontSettings(e.target.checked, 'standard', this.props.settings.id, this.props.handle)}
                                            label="Standard-Schrift verwenden"
                                        />
                                        {/*} <Form.Check
                                            disabled={this.props.settings.standard}
                                            type="switch"
                                            className="no-blur my-2 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.display || false}
                                            onChange={(e) => this.props.onSetFontSettings(e.target.checked, 'display', this.props.settings.id, this.props.handle)}
                                            label="Display-Überschrift"
                                        /> {*/}

                                    {this.props.handle === 'font_headline' && this.props.settings.id !== 'widget_headline' ?
                                        <Form.Check
                                            disabled={this.props.settings.standard || !this.props.ist_gutenberg}
                                            type="switch"
                                            className="no-blur my-2 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.show_editor || false}
                                            onChange={(e) => this.props.onSetFontSettings(e.target.checked, 'show_editor', this.props.settings.id, this.props.handle)}
                                            label="im Editor anzeigen"
                                        />
                                        : ''}
                                    </div>
                                </Col>
                                {this.props.settings.color &&
                                    <Col xs={12}>
                                        <div className="d-flex align-items-center">
                                            <SimonColorPicker
                                                color={this.props.settings.color || ''}
                                                handle={this.props.settings.id}
                                                callback={this.onPickrCallback}
                                            />
                                            <div className="fw-semibold ms-2">
                                                {this.props.settings.label} <span
                                                className="fw-light">Schriftfarbe</span>
                                            </div>
                                        </div>
                                    </Col>}

                            </Row>
                        </Col>
                    </fieldset>
                </CardBody>
            </Card>
        )
    }
}