import * as React from "react";
import axios from "axios";

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Collapse from 'react-bootstrap/Collapse';
import {v5 as uuidv5} from 'uuid';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const v5NameSpace = '9636de48-e932-11ee-b37d-325096b39f47';
export default class AppIcons extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.formUpdTimeOut = '';
        this.state = {
            bsIcons: [],
            mdIcons: [],
            faIcons: [],
            colBs: true,
            colMd: false,
            colFa: false,
            modalShow: false,
        }
        this.getIcons = this.getIcons.bind(this);
        this.onSetModalShow = this.onSetModalShow.bind(this);
        this.onSetCallBackIcon = this.onSetCallBackIcon.bind(this);


        this.sendFetchApi = this.sendFetchApi.bind(this);

        this.findArrayElementById = this.findArrayElementById.bind(this);
        this.filterArrayElementById = this.filterArrayElementById.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.showModalIcons) {
            this.getIcons();
            this.props.onSetShowModalIcons(false)
        }
    }

    findArrayElementById(array, id) {
        return array.find((element) => {
            return element.id === id;
        })
    }

    filterArrayElementById(array, id) {
        return array.filter((element) => {
            return element.id !== id;
        })
    }

    getIcons() {
        let formData = {
            'method': 'get_icons'
        }
        this.sendFetchApi(formData)
    }


    onToggleCollapse(target) {
        let bs = false;
        let md = false;
        let fa = false;

        switch (target) {
            case 'bs':
                bs = true;
                break;
            case 'md':
                md = true;
                break;
            case 'fa':
                fa = true;
                break;
        }
        this.setState({
            colBs: bs,
            colMd: md,
            colFa: fa,
        })
    }

    onSetModalShow(state) {
        this.setState({
            modalShow: state
        })
    }

    onSetCallBackIcon(icon) {
        if(icon){
            this.props.onIconCallback(icon)
            this.setState({
                modalShow: false
            })
        }

    }
    sendFetchApi(formData, path = hummeltRestObj.dashboard_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_icons':
                    if (data.status) {
                        this.setState({
                            bsIcons: data.bs,
                            mdIcons: data.md,
                            faIcons: data.fa,
                            modalShow: true,
                        })
                    }
                    break;
            }
        }).catch(
            (error) => {
                if (error.code === 'rest_permission_error' || error.code === 'rest_failed') {
                    this.setState({
                        showApiError: true,
                        apiErrorMsg: error.message
                    })
                    console.log(error.message);
                }
            }
        );
    }

    render() {
        return (
            <Modal
                show={this.state.modalShow}
                onHide={() => this.onSetModalShow(false)}
                centered
                //dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                //scrollable={false}
                fullscreen
            >
                <Modal.Header className="bg-body-tertiary d-flex align-items-center py-3" closeButton>
                    <div className="d-flex flex-column">
                        <div className="mb-3 fs-5"> Icons</div>
                        <ButtonGroup className="flex-wrap" aria-label="Basic example">
                            <Button onClick={() => this.onToggleCollapse('bs')}
                                    variant={`outline-primary ${this.state.colBs ? 'active' : ''}`}>
                                Bootstrap-Icons
                            </Button>
                            <Button
                                disabled={!hummeltRestObj.rest_settings.material_icons_active}
                                onClick={() => this.onToggleCollapse('md')}
                                    variant={`${hummeltRestObj.rest_settings.material_icons_active ? 'outline-primary' : 'outline-secondary opacity-50 border-0 pe-none'} ${this.state.colMd ? 'active ' : ''}`}>
                                Material-Design
                            </Button>
                            <Button
                                disabled={!hummeltRestObj.rest_settings.fa_icons_active}
                                onClick={() => this.onToggleCollapse('fa')}
                                    variant={`${hummeltRestObj.rest_settings.fa_icons_active ? 'outline-primary' : 'outline-secondary border-0 opacity-50 pe-none'} ${this.state.colFa ? 'active ' : ''}`}>
                                Font Awesome
                            </Button>
                        </ButtonGroup>
                    </div>
                </Modal.Header>
                <Modal.Body>

                    <Collapse in={this.state.colBs}>
                        <div id={uuidv5('collapseBs', v5NameSpace)}>
                            <div id="icon-grid">
                                <div className="icon-wrapper">
                                    {this.state.bsIcons.map((i, index) => {
                                        return (
                                            <div onClick={() => this.onSetCallBackIcon(i.icon)}
                                                 title={i.title}
                                                 className="info-icon-item" key={index}>
                                                <i className={i.icon}></i>
                                                <small className="sm-icon">{i.icon}</small>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.colMd}>
                        <div id={uuidv5('collapseMd', v5NameSpace)}>
                            <div id="icon-grid">
                                <div className="icon-wrapper">
                                    {this.state.mdIcons.map((i, index) => {
                                        return (
                                            <div onClick={() => this.onSetCallBackIcon(i.icon)}
                                                 title={i.title}
                                                 className="info-icon-item" key={index}>
                                                <i className={i.icon}></i>
                                                <small className="sm-icon">{i.icon}</small>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.colFa}>
                        <div id={uuidv5('collapseFa', v5NameSpace)}>
                            <div id="icon-grid">
                                <div className="icon-wrapper">
                                    {this.state.faIcons.map((i, index) => {
                                        return (
                                            <div onClick={() => this.onSetCallBackIcon(i.icon)}
                                                 title={i.title}
                                                 className="info-icon-item" key={index}>
                                                <i className={i.icon}></i>
                                                <small className="sm-icon">{i.icon}</small>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => this.onSetModalShow(false)}
                        variant="secondary">
                        Schließen
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}