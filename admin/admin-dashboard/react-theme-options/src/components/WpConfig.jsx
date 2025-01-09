import {Card, CardBody, Form, Row, FloatingLabel, Col, Container, Nav, Collapse, Button} from "react-bootstrap";
import {v4 as uuidv4, v5 as uuidv5} from "uuid";

const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const v5NameSpace = '6f46ea32-39d0-412c-972d-e4d045f538d7';
export default class WpConfig extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {}
        this.onGetDebugLog = this.onGetDebugLog.bind(this);

    }

    onGetDebugLog(handle) {
        let formData = {
            'method': 'get_debug_log',
            'handle': handle
        }
        this.props.sendFetchApi(formData)
    }

    render() {
        return (
            <Fragment>
                {this.props.settings && this.props.settings.wp_optionen &&
                    <Fragment>
                        {this.props.settings.wp_optionen.wp_optionen_disabled ?
                        <Button
                            onClick={() => this.props.onGetOpenPinModal('wp_optionen')}
                            size="sm"
                            variant="outline-danger my-1 me-2">
                            Config bearbeiten
                        </Button>: ''}
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6 className={this.props.settings.wp_optionen.wp_optionen_disabled ? 'opacity-50' : ''}>
                                    <i className="bi bi-wordpress text-primary me-2"></i>
                                    WP-Optionen
                                </h6>
                                <hr/>
                                <fieldset disabled={this.props.settings.wp_optionen.wp_optionen_disabled}>
                                    <div className="d-flex flex-wrap">
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_optionen.wp_disabled_automatic_update || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'wp_disabled_automatic_update', 'wp_optionen')}
                                            label="WP Automatic Update disabled"
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_optionen.wp_disable_wp_cron || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'wp_disable_wp_cron', 'wp_optionen')}
                                            label="WP-CRON disabled"
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_optionen.wp_disallow_file_edit || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'wp_disallow_file_edit', 'wp_optionen')}
                                            label="DISALLOW FILE EDIT *"
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_optionen.wp_disallow_file_mods || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'wp_disallow_file_mods', 'wp_optionen')}
                                            label="DISALLOW FILE MODS *"
                                        />
                                    </div>
                                </fieldset>
                                <div
                                    className={this.props.settings.wp_optionen.wp_optionen_disabled ? 'opacity-50' : ''}>
                                    <div className="form-text mt-3">
                                        <b className="text-danger">*</b> DISALLOW FILE EDIT:<br/>
                                        Deaktivieren Sie den Plugin- und Theme-Datei-Editor in der Verwaltung.
                                    </div>
                                    <div className="form-text">
                                        <b className="text-danger">*</b> DISALLOW FILE MODS:<br/>
                                        Deaktivieren Sie Plugin- und Theme-Updates und Installationen vom Admin aus.
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Fragment>}

                {this.props.settings && this.props.settings.wp_config &&
                    <Fragment>
                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6 className={this.props.settings.wp_config.wp_config_disabled ? 'opacity-50' : ''}>
                                    <i className="bi bi-wordpress text-primary me-2"></i>
                                    WP-Config
                                </h6>
                                <hr/>
                                <fieldset disabled={this.props.settings.wp_config.wp_config_disabled}>
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.wp_config.wp_cache_active || false}
                                        onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'wp_cache_active', 'wp_config')}
                                        label="WP-Cache aktiv"
                                    />
                                    <hr/>
                                    <h6 className={this.props.settings.wp_config.wp_config_disabled ? 'opacity-50' : ''}>WP-Debug</h6>
                                    <hr/>
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.wp_config.show_fatal_error || false}
                                        onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'show_fatal_error', 'wp_config')}
                                        label="Fatal Error anzeigen (1)"
                                    />
                                    <hr/>
                                    <div className="d-flex flex-wrap">
                                        <Form.Check
                                            type="radio"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            name="debug_aktiv"
                                            checked={this.props.settings.wp_config.debug === 1 || false}
                                            onChange={(e) => this.props.updateWpOptionen(1, 'debug', 'wp_config')}
                                            label="WP-Debug aktiv"
                                        />
                                        <Form.Check
                                            type="radio"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            name="debug_aktiv"
                                            checked={this.props.settings.wp_config.debug === 2 || false}
                                            onChange={(e) => this.props.updateWpOptionen(2, 'debug', 'wp_config')}
                                            label="WP-Debug nicht aktiv"
                                        />
                                    </div>
                                    <hr/>
                                    <div className="d-flex flex-wrap">
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_config.wp_script_debug || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'wp_script_debug', 'wp_config')}
                                            label="WP-Script Debug"
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_config.wp_debug_display || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'wp_debug_display', 'wp_config')}
                                            label="WP-Debug Display"
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_config.wp_debug_log || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'wp_debug_log', 'wp_config')}
                                            label="WP-Debug Log"
                                        />
                                    </div>
                                    <hr/>
                                    <div className="d-flex flex-wrap">
                                        <Button
                                          //  disabled={!this.props.settings.wp_config.wp_debug_log}
                                            onClick={() => this.onGetDebugLog('add')}
                                            size="sm"
                                            variant={`outline-primary me-2`}>
                                            Log ansehen
                                        </Button>
                                        <Button
                                            onClick={() => this.onGetDebugLog('delete')}
                                            size="sm"
                                            variant="outline-danger me-2">
                                            Log löschen
                                        </Button>
                                    </div>
                                    {/*}   <hr/>
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.wp_config.mu_plugin_active || false}
                                        onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'mu_plugin_active', 'wp_config')}
                                        label="MU-Plugin aktivieren (2)"
                                    /> {*/}
                                </fieldset>
                            </CardBody>
                        </Card>

                        <Card className="shadow-sm my-3">
                            <CardBody>
                                <h6 className={this.props.settings.wp_config.wp_config_disabled ? 'opacity-50' : ''}>
                                    <i className="bi bi-wordpress text-primary me-2"></i>
                                    WP Post | Page Settings
                                </h6>
                                <hr/>
                                <fieldset disabled={this.props.settings.wp_config.wp_config_disabled}>
                                    <Row className="g-3">
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="Anzahl der Revisionen (2)"
                                            >
                                                <Form.Control
                                                    disabled={this.props.settings.wp_config.rev_wp_aktiv}
                                                    className={`no-blur`}
                                                    type="number"
                                                    value={this.props.settings.wp_config.revision_anzahl || ''}
                                                    onChange={(e) => this.props.updateWpOptionen(e.target.value, 'revision_anzahl', 'wp_config')}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="Revision Autosave Interval (sec)"
                                            >
                                                <Form.Control
                                                    disabled={this.props.settings.wp_config.rev_wp_aktiv}
                                                    className={`no-blur`}
                                                    type="number"
                                                    value={this.props.settings.wp_config.revision_interval || ''}
                                                    onChange={(e) => this.props.updateWpOptionen(e.target.value, 'revision_interval', 'wp_config')}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur my-1 me-4"
                                                id={uuidv4()}
                                                checked={this.props.settings.wp_config.rev_wp_aktiv || false}
                                                onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'rev_wp_aktiv', 'wp_config')}
                                                label="WordPress Settings benutzen"
                                            />
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <h6 className={this.props.settings.wp_config.wp_config_disabled ? 'opacity-50' : ''}>Papierkorb</h6>
                                    <hr/>
                                    <Row className="g-3">
                                        <Col xl={6} xs={12}>
                                            <FloatingLabel
                                                controlId={uuidv4()}
                                                label="Papierkorb leeren (angabe in Tage)"
                                            >
                                                <Form.Control
                                                    disabled={this.props.settings.wp_config.trash_wp_aktiv}
                                                    className={`no-blur`}
                                                    type="number"
                                                    value={this.props.settings.wp_config.trash_days || ''}
                                                    onChange={(e) => this.props.updateWpOptionen(e.target.value, 'trash_days', 'wp_config')}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Check
                                                type="switch"
                                                className="no-blur my-1 me-4"
                                                id={uuidv4()}
                                                checked={this.props.settings.wp_config.trash_wp_aktiv || false}
                                                onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'trash_wp_aktiv', 'wp_config')}
                                                label="WordPress Settings benutzen"
                                            />
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <h6 className={this.props.settings.wp_config.wp_config_disabled ? 'opacity-50' : ''}>Sicherheit</h6>
                                    <hr/>
                                    <div className="d-flex flex-wrap">
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_config.ssl_login_active || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'ssl_login_active', 'wp_config')}
                                            label="SSL-Login erzwingen"
                                        />
                                        <Form.Check
                                            type="switch"
                                            className="no-blur my-1 me-4"
                                            id={uuidv4()}
                                            checked={this.props.settings.wp_config.admin_ssl_login_active || false}
                                            onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'admin_ssl_login_active', 'wp_config')}
                                            label="SSL-Admin erzwingen"
                                        />
                                    </div>
                                    <hr/>
                                    <h6 className={this.props.settings.wp_config.wp_config_disabled ? 'opacity-50' : ''}>Datenbank</h6>
                                    <hr/>
                                    <Form.Check
                                        type="switch"
                                        className="no-blur my-1 me-4"
                                        id={uuidv4()}
                                        checked={this.props.settings.wp_config.db_repair || false}
                                        onChange={(e) => this.props.updateWpOptionen(e.target.checked, 'db_repair', 'wp_config')}
                                        label="Datenbank Reparieren | Optimieren (3)"
                                    />
                                </fieldset>
                                <hr/>
                                <div
                                    className={`mt-4 ${this.props.settings.wp_config.wp_config_disabled ? 'opacity-50 pe-none' : ''}`}>
                                    <div className="form-text mb-2">
                                        <b className="text-danger me-1">(1)</b> Mit WordPress 5.2 wurde der
                                        Wiederherstellungsmodus eingeführt, der eine Fehlermeldung anstelle, eines
                                        weißen Bildschirms anzeigt, wenn ein Plug-in einen fatalen Fehler verursacht.
                                        Leider werden die PHP-Fehlermeldungen den Benutzern nicht mehr angezeigt. Wenn
                                        Sie WP_DEBUG oder WP_DEBUG_DISPLAY aktivieren wollen, müssen Sie den
                                        Wiederherstellungsmodus deaktivieren, indem Sie true auf
                                        WP_DISABLE_FATAL_ERROR_HANDLER setzen:
                                    </div>
                                    {/*} <div className="form-text mb-2">
                                        <b className="text-danger me-1">(2)</b> Ein Must-Use-Plugin wird geladen, bevor
                                        normale Plugins und das Theme geladen werden. Bei aktivierung werden nur noch
                                        Fehler in die Log-Datei geschrieben. Warnungen oder Notizen werden ausgeblendet.
                                    </div> {*/}
                                    <div className="form-text mb-2">
                                        <b className="text-danger me-1">(2)</b> WordPress bietet in seiner
                                        Grundeinstellung viele Sicherungen bei der Erstellung Ihrer Inhalte. So kann man
                                        bei Fehlern recht komfortabel vorherige Versionen von Seiten und Beiträgen
                                        wieder aktivieren. Beim Aufbau einer Website bzw. bei der regelmäßigen Pflege
                                        wächst die Größe der Datenbank recht schnell an.
                                    </div>
                                    <div className="form-text">
                                        <b className="text-danger me-1">(3)</b> Mit dieser Option können Sie die
                                        Datenbank von WordPress reparieren und auch die Inhalte optimieren. Dies kann
                                        notwendig werden, wenn die Website langsamer wird oder sich unerklärliche
                                        404er-Fehler häufen. Nach dem Aktivieren des Codes können Sie
                                        <a target="_blank" className="mx-1 text-primary fw-semibold"
                                           href={`${hummeltRestObj.site_url}/wp-admin/maint/repair.php`}>
                                            {`${hummeltRestObj.site_url}/wp-admin/maint/repair.php`}
                                        </a>die Reparatur
                                        und/oder Optimierung durchführen.<br/> <b
                                        className="fw-semibold text-danger"> Nach
                                        der Optimierung sollten Sie diese Option
                                        aus Gründen der Sicherheit wieder deaktivieren</b> !
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Fragment>}

            </Fragment>
        )
    }
}