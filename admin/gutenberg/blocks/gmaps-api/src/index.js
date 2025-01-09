import './editor.scss';


const {__} = wp.i18n;
const {Component, Fragment} = wp.element;
const {registerBlockType, PlainText} = wp.blocks;
const {Panel, TextControl, ToggleControl, PanelBody, SelectControl, RadioControl} = wp.components;
import icon from './icon.js';
import {
    InspectorControls,
} from '@wordpress/block-editor';

registerBlockType('hupa-v3/gmaps-api', {
    title: __('Google Maps API'),
    icon: icon,
    category: 'media',
    attributes: {
        selectedApi: {
            type: 'string',
        },
        datenschutz: {
            type: 'string',
        },
        cardWidth: {
            type: 'string',
            default: '600px'
        },
        cardHeight: {
            type: 'string',
            default: '450px'
        },
        cardZoom: {
            type: 'number',
            default: 15
        },

    },
    keywords: [
        __(' Gutenberg TOOLS BY Jens Wiecker'),
        __('Gutenberg Google Maps'),
    ],
    edit: class extends Component {
        constructor(props) {
            super(...arguments);
            this.props = props;
            this.state = {
                datenschutzSelects: [],
            }

        }

        componentDidMount() {
            let formData = {
                'method': 'get_maps_items'
            }
            this.sendFetchApi(formData)
        }

        sendFetchApi(formData, path = hummeltRestEditorObj.gutenberg_rest_path + 'settings') {
            wp.apiFetch({
                path: path,
                method: 'POST',
                data: formData,
            }).then(data => {
                switch (data.type) {
                    case 'get_maps_items':
                        if (data.status) {
                            this.setState({
                                datenschutzSelects: data.datenschutz_selects,
                            })
                        }
                        break;
                }
            }).catch(
                (error) => {
                    if (error.code === 'rest_permission_error' || error.code === 'rest_failed') {
                        console.log(error.message);
                    }
                }
            );
        }

        render() {

            return (
                <>
                    <div style={{width: this.props.attributes.cardWidth, height: this.props.attributes.cardHeight}}
                         className="hupa-v3-gmaps-api">
                        <div className="map-placeholder-bg">
                            <div className="gmaps-api-headline">
                                <i className="bi bi-pin-map me-2"></i>
                                Google Maps <small>(API)</small>
                            </div>
                        </div>
                        <img style={{width: this.props.attributes.cardWidth, height: this.props.attributes.cardHeight}}
                             className="placeholder-card" alt="leaflet"
                             src={`${hummeltRestEditorObj.admin_url}assets/images/blind-karte.svg`}/>
                    </div>
                    <InspectorControls>
                        <PanelBody
                            title={__('Google Maps API Settings', 'bootscore')}
                            initialOpen={true}
                            className="hupa-v3-gmaps-api-panel"
                        >
                            <SelectControl
                                label={__('Select Datenschutz', 'bootscore')}
                                value={this.props.attributes.datenschutz}
                                options={this.state.datenschutzSelects}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({datenschutz: e})}
                            />
                            <TextControl
                                label="zoom"
                                value={this.props.attributes.cardZoom}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({cardZoom: e})}
                                type="number"
                            />
                            <TextControl
                                label="Karten Breite"
                                value={this.props.attributes.cardWidth}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({cardWidth: e})}
                                type="text"
                            />
                            <TextControl
                                label="Karten Höhe"
                                value={this.props.attributes.cardHeight}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({cardHeight: e})}
                                type="text"
                            />
                        </PanelBody>
                    </InspectorControls>
                </>
            );
        }
    },
    save() {
        return null;
    }
});
