const {Component, Fragment} = wp.element;
import {Form, Collapse, FloatingLabel, Row, Col} from 'react-bootstrap';
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const v5NameSpace = 'ab510b60-edbe-11ee-b21a-325096b39f47';
export default class FormSettings extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            responderOpen: false,
        };

    }


    render() {
        return (
            <div className="card shadow-sm mb-2">
                <div className="card-header fs-5 fw-semibold py-3">
                    <i className="bi bi-gear text-blue me-2"></i>
                    Formular-Einstellungen
                </div>
                <div className="card-body">
                    <div className="col-xxl-10 col-xl-12 col-12 mx-auto">
                        <div className="row g-3 align-items-stretch">
                            <div className="col-xl-6 col-12">
                                <div className="p-3 h-100 border rounded">
                                    <h6 className="mb-3"> Responsive Einstellungen: </h6>
                                    <hr/>
                                    <div className="fw-semibold mb-2">Formular Spalten</div>
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === ''}
                                        onChange={() => this.props.onChangeBuilderSettings('', 'col')}
                                        label='Spalten nicht umbrechen'
                                        id={uuidv4()}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'sm'}
                                        onChange={() => this.props.onChangeBuilderSettings('sm', 'col')}
                                        label="< 575 (sm)"
                                        id={uuidv4()}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'md'}
                                        onChange={() => this.props.onChangeBuilderSettings('md', 'col')}
                                        label="< 767 (md)"
                                        id={uuidv4()}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'lg'}
                                        onChange={() => this.props.onChangeBuilderSettings('lg', 'col')}
                                        label="< 991 (lg)"
                                        id={uuidv4()}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'xl'}
                                        onChange={() => this.props.onChangeBuilderSettings('xl', 'col')}
                                        label="< 1199 (xl)"
                                        id={uuidv4()}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="breakpoint"
                                        checked={this.props.builderSettings.col === 'xxl'}
                                        onChange={() => this.props.onChangeBuilderSettings('xxl', 'col')}
                                        label="< 1399 (xxl)"
                                        id={uuidv4()}
                                    />
                                </div>

                            </div>
                            <div className="col-xl-6 col-12">
                                <div className="p-3 border h-100 rounded">
                                    <h6 className="mb-3">Responsive Einstellungen: </h6>
                                    <hr/>
                                    <div className="fw-semibold mb-2">Raster</div>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        className="mb-3"
                                        label='Formular Gutter'>
                                        <Form.Select
                                            value={this.props.builderSettings.gutter}
                                            onChange={(e) => this.props.onChangeBuilderSettings(e.currentTarget.value, 'gutter')}
                                            className="no-blur"
                                            aria-label="Gutter Select">
                                            <option value="individuell">Individuell</option>
                                            <option value="g-1">Gutter 1 (g-1)</option>
                                            <option value="g-2">Gutter 2 (g-2)</option>
                                            <option value="g-3">Gutter 3 (g-3)</option>
                                            <option value="g-4">Gutter 4 (g-4)</option>
                                            <option value="g-5">Gutter 5 (g-5)</option>
                                        </Form.Select>
                                    </FloatingLabel>

                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label='Individuelles Raster'
                                    >
                                        <Form.Control
                                            type="text"
                                            disabled={this.props.builderSettings.gutter !== 'individuell'}
                                            value={this.props.builderSettings.individuell || ''}
                                            onChange={(e) => this.props.onChangeBuilderSettings(e.currentTarget.value, 'individuell')}
                                            className="no-blur"
                                            placeholder='Individuelles Raster' />
                                    </FloatingLabel>
                                    <div className="form-text mb-3">
                                        mögliche Werte z.b gx-1 gy-2 usw.
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-12">
                                <div className="p-3 border h-100 rounded">
                                    <h6 className="">Formular Umleitung: </h6>
                                    <div className="form-text mb-3">
                                        Nach dem Senden auf eine Seite umleiten.
                                    </div>
                                    <hr/>
                                    <div className="fw-semibold mb-2">Umleitung</div>
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        className="no-blur mb-3"
                                        id={uuidv4()}
                                        checked={this.props.builderSettings.redirection_active || false}
                                        onChange={(e) => this.props.onChangeBuilderSettings(e.currentTarget.checked, 'redirection_active')}
                                        label='Umleitung aktiv'
                                    />
                                    <Collapse in={this.props.builderSettings.redirection_active || false}>
                                        <div id={uuidv4()}>
                                            <hr/>
                                           <Row className="g-3">
                                               <Col xs={12}>
                                                   <FloatingLabel
                                                       controlId={uuidv4()}
                                                       label={`Seite`}
                                                   >
                                                       <Form.Select
                                                           className="no-blur mw-100"
                                                           value={this.props.builderSettings.page_id || ''}
                                                           onChange={(e) => this.props.onChangeBuilderSettings(e.currentTarget.value, 'page_id')}
                                                           aria-label={`Seite`}>
                                                           <option value="">URL eingeben</option>
                                                           {this.props.sites.map((select, index) =>
                                                               <option key={index}
                                                                       value={select.id}>
                                                                   {select.title}
                                                               </option>
                                                           )}
                                                       </Form.Select>
                                                   </FloatingLabel>
                                               </Col>
                                               {/*}   <Col xs={12}>
                                                   <Form.Check // prettier-ignore
                                                       type="switch"
                                                       disabled={!this.props.builderSettings.page_id}
                                                       className="no-blur"
                                                       id={uuidv4()}
                                                       checked={this.props.builderSettings.js_data_active || false}
                                                       onChange={(e) => this.props.onChangeBuilderSettings(e.currentTarget.checked, 'js_data_active')}
                                                       label='JavaScript aktiv'
                                                   />
                                               </Col> {*/}
                                               <Col xs={12}>
                                                   <FloatingLabel
                                                       controlId={uuidv4()}
                                                       label='Url'
                                                   >
                                                       <Form.Control
                                                           type="text"
                                                           disabled={this.props.builderSettings.page_id}
                                                           value={this.props.builderSettings.url || ''}
                                                           onChange={(e) => this.props.onChangeBuilderSettings(e.currentTarget.value, 'url')}
                                                           className="no-blur"
                                                           placeholder='Url' />
                                                   </FloatingLabel>
                                               </Col>

                                           </Row>
                                        </div>
                                    </Collapse>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}