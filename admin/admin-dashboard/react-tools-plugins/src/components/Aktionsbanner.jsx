import {
    Card,
    CardBody,
    Form,
    Row,
    Accordion,
    Col,
    Container,
    Button,
    Nav,
    Collapse,
    FloatingLabel,

} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";
import * as AppTools from "../utils/AppTools.js";
import * as React from "react";

const {Component, Fragment} = wp.element;
const v5NameSpace = 'daca1c58-544e-4c1d-8947-6d87bea650ef';
export default class Aktionsbanner extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onChangePostType = this.onChangePostType.bind(this);
    }

    onChangePostType(e, type) {
        this.props.onSetAktionsBanner(e, type)
        this.props.onSetAktionsBanner(0, 'post_id')
        if (e === "") {
            return false;
        }
        let formData = {
            'method': 'get_posts_by_type',
            'type': e
        }
        this.props.sendFetchApi(formData)
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.aktionsbanner ?
                    <Card className="shadow-sm my-2 col-xl-10 col-lg-10 col-12 mx-auto">
                        <CardBody>
                            <h6>
                                <i className="bi bi-arrow-right-short me-1"></i>
                                Sichtbarkeit
                            </h6>
                            <hr/>
                            Modal ID: <code>#theme-aktionsbanner</code>
                            <hr/>
                            <Row className="g-3">
                                <Col xs={12}>
                                    <div className="d-flex flex-wrap">
                                        <Form.Check
                                            label='aktiv'
                                            type="switch"
                                            className="no-blur me-4 my-1"
                                            checked={this.props.settings.aktionsbanner.aktiv || false}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'aktiv')}
                                            id={uuidv4()}
                                        />
                                        <Form.Check
                                            label='nur für eingeloggte Benutzer sichtbar'
                                            type="switch"
                                            disabled={this.props.settings.aktionsbanner.aktiv === true}
                                            className="no-blur me-4 my-1"
                                            checked={this.props.settings.aktionsbanner.show_login_user || false}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'show_login_user')}
                                            id={uuidv4()}
                                        />

                                        <Form.Check
                                            label='1 mal pro Sitzung anzeigen'
                                            type="switch"
                                            className="no-blur my-1"
                                            checked={this.props.settings.aktionsbanner.show_pro_sitzung || false}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'show_pro_sitzung')}
                                            id={uuidv4()}
                                        />
                                    </div>
                                    <hr className="mb-1"/>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`Post Type`}
                                    >
                                        <Form.Select
                                            className="no-blur mw-100"
                                            value={this.props.settings.aktionsbanner.post_type || ''}
                                            onChange={(e) => this.onChangePostType(e.target.value, 'post_type')}
                                            aria-label={`Post Type`}>
                                            <option value="">auswählen...</option>
                                            {this.props.post_types.map((select, index) =>
                                                <option key={index}
                                                        value={select.type}>
                                                    {select.label}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                    <Form.Check
                                        label='Beitragsbild anzeigen'
                                        type="switch"
                                        className="no-blur my-3"
                                        checked={this.props.settings.aktionsbanner.show_beitrags_image || false}
                                        onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'show_beitrags_image')}
                                        id={uuidv4()}
                                    />
                                    <Collapse
                                        in={this.props.settings.aktionsbanner.show_beitrags_image === true}>
                                        <div id={uuidv4()}>
                                            <Row className="g-2">
                                                <Col xl={3} lg={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        className="mw-100"
                                                        label={`Bildgröße`}
                                                    >
                                                        <Form.Select
                                                            className="no-blur mw-100"
                                                            value={this.props.settings.aktionsbanner.image_size || ''}
                                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'image_size')}
                                                            aria-label={`Bildgröße`}>
                                                            <option value="full">full</option>
                                                            <option value="large">large</option>
                                                            <option value="medium">medium</option>
                                                            <option value="thumbnail">thumbnail</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xl={3} lg={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label="Object fit"
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            type="text"
                                                            value={this.props.settings.aktionsbanner.object_fit || ''}
                                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'object_fit')}
                                                            placeholder="Object fit"/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xl={3} lg={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label="Object Position"
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            type="text"
                                                            value={this.props.settings.aktionsbanner.object_postion || ''}
                                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'object_postion')}
                                                            placeholder="Object Position"/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xl={3} lg={6} xs={12}>
                                                    <FloatingLabel
                                                        controlId={uuidv4()}
                                                        label="Höhe"
                                                    >
                                                        <Form.Control
                                                            className={`no-blur`}
                                                            type="text"
                                                            value={this.props.settings.aktionsbanner.height || ''}
                                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'height')}
                                                            placeholder="Höhe"/>
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Collapse>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        className="mw-100"
                                        label={`Beitrag`}
                                    >
                                        <Form.Select
                                            className="no-blur mw-100"
                                            disabled={this.props.settings.aktionsbanner.last_post || !this.props.settings.aktionsbanner.post_type || !this.props.posts.length}
                                            value={this.props.settings.aktionsbanner.post_id || ''}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'post_id')}
                                            aria-label={`Beitrag`}>
                                            <option value="">auswählen...</option>
                                            {this.props.posts.map((select, index) =>
                                                <option key={index}
                                                        value={select.id}>
                                                    {select.title}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                    <Form.Check
                                        label='letzten Beitrag anzeigen'
                                        type="switch"
                                        className="no-blur mt-3"
                                        checked={this.props.settings.aktionsbanner.last_post || false}
                                        onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'last_post')}
                                        id={uuidv4()}
                                    />
                                </Col>

                                <Col xs={12}>
                                    <hr/>
                                    <h6>
                                        <i className="bi bi-arrow-right-short me-1"></i>
                                        Sichtbarkeit einschränken
                                    </h6>
                                    <hr/>
                                </Col>
                                <Col xs={12}>
                                    <Form.Check
                                        label='auf allen Seiten anzeigen'
                                        type="switch"
                                        className="no-blur me-4 my-1"
                                        checked={this.props.settings.aktionsbanner.show_all_pages || false}
                                        onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'show_all_pages')}
                                        id={uuidv4()}
                                    />
                                </Col>

                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`Seiten`}
                                    >
                                        <Form.Select
                                            disabled={this.props.settings.aktionsbanner.show_all_pages !== false}
                                            className="no-blur mw-100"
                                            value={this.props.settings.aktionsbanner.show_page_id || 0}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'show_page_id')}
                                            aria-label={`Seiten`}>
                                            <option value="">auswählen...</option>
                                            {this.props.pages.map((select, index) =>
                                                <option key={index}
                                                        value={select.id}>
                                                    {select.title}
                                                </option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs={12}>
                                    <hr/>
                                    <h6>
                                        <i className="bi bi-arrow-right-short me-1"></i>
                                        Modal-Einstellungen
                                    </h6>
                                    <hr/>
                                </Col>
                                <Col xs={12}>
                                    <div className="d-flex flex-wrap">
                                        <Form.Check
                                            label='static'
                                            type="switch"
                                            className="no-blur me-4 my-1"
                                            checked={this.props.settings.aktionsbanner.static || false}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'static')}
                                            id={uuidv4()}
                                        />
                                        <Form.Check
                                            label='scrollable'
                                            type="switch"
                                            className="no-blur me-4 my-1"
                                            checked={this.props.settings.aktionsbanner.scrollable || false}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'scrollable')}
                                            id={uuidv4()}
                                        />
                                        <Form.Check
                                            label='centered'
                                            type="switch"
                                            className="no-blur me-4 my-1"
                                            checked={this.props.settings.aktionsbanner.centered || false}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.currentTarget.checked, 'centered')}
                                            id={uuidv4()}
                                        />
                                    </div>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label={`Größe`}
                                    >
                                        <Form.Select
                                            className="no-blur mw-100"
                                            value={this.props.settings.aktionsbanner.size || ''}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'size')}
                                            aria-label={`Größe`}>
                                            <option value="modal-sm">SM</option>
                                            <option value="">normal</option>
                                            <option value="modal-lg">LG</option>
                                            <option value="modal-xl">XL</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}></Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Dialog extra CSS"
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            type="text"
                                            value={this.props.settings.aktionsbanner.dialog_css || ''}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'dialog_css')}
                                            placeholder="Dialog extra CSS"/>
                                    </FloatingLabel>
                                </Col>
                                <Col xl={6} xs={12}>
                                    <FloatingLabel
                                        controlId={uuidv4()}
                                        label="Modal extra CSS"
                                    >
                                        <Form.Control
                                            className={`no-blur`}
                                            type="text"
                                            value={this.props.settings.aktionsbanner.modal_css || ''}
                                            onChange={(e) => this.props.onSetAktionsBanner(e.target.value, 'modal_css')}
                                            placeholder="Modal extra CSS"/>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    : ''}
            </Fragment>
        )
    }
}