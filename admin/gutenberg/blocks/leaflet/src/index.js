import './editor.scss';
import './style.scss';

const {__} = wp.i18n;
const {Component, Fragment} = wp.element;
const {registerBlockType, PlainText} = wp.blocks;
const {Panel, TextControl, ToggleControl, PanelBody, SelectControl, RadioControl} = wp.components;
import icon from './icon.js';
import {
    InspectorControls,
} from '@wordpress/block-editor';

registerBlockType('hupa-v3/theme-leaflet-maps', {
    title: __('OpenStreetMap leaflet'),
    icon: icon,
    category: 'media',
    attributes: {
        selectedLeaflet: {
            type: 'string',
        },
        selectedDatenschutz: {
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
        clusterRadius: {
            type: 'number',
            default: 20
        },
        cardZoom: {
            type: 'number',
            default: 14
        },
        minZoom: {
            type: 'number',
            default: 8
        },
        maxZoom: {
            type: 'number',
            default: 18
        },
        showMinimap: {
            type: 'boolean',
            default: true
        },
        minimapWidth: {
            type: 'number',
            default: 150
        },
        minimapHeight: {
            type: 'number',
            default: 150
        },
        minimapMinZoom: {
            type: 'number',
            default: 5
        },
        minimapMaxZoom: {
            type: 'number',
            default: 15
        },
    },
    keywords: [
        __(' Gutenberg TOOLS BY Jens Wiecker'),
        __('Gutenberg Leaflet Maps'),
    ],
    edit: class extends Component {
        constructor(props) {
            super(...arguments);
            this.props = props;
            this.state = {
                datenschutzSelects: [],
                leafletSelects: []
            }

        }

        componentDidMount() {
            let formData = {
                'method': 'get_leaflet_items'
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
                    case 'get_leaflet_items':
                        if (data.status) {
                            this.setState({
                                datenschutzSelects: data.datenschutz_selects,
                                leafletSelects: data.leaflet_selects
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
                         className="hupa-v3-theme-leaflet-maps">
                        <div className="map-placeholder-bg">
                            <div className="leaflet-headline">
                                <i className="bi bi-pin-map-fill me-2"></i>
                                OpenStreetMap <small>(leaflet)</small>
                            </div>
                        </div>
                        <img style={{width: this.props.attributes.cardWidth, height: this.props.attributes.cardHeight}}
                             className="placeholder-card" alt="leaflet"
                             src={`${hummeltRestEditorObj.admin_url}assets/images/blind-karte.svg`}/>
                    </div>
                    <InspectorControls>
                        <PanelBody
                            title={__('OpenStreetMaps Settings', 'bootscore')}
                            initialOpen={false}
                            className="hupa-v3-theme-leaflet-maps-panel"
                        >
                            <SelectControl
                                label={__('Select Leaflet', 'bootscore')}
                                value={this.props.attributes.selectedLeaflet}
                                options={this.state.leafletSelects}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({selectedLeaflet: e})}
                            />
                            <SelectControl
                                label={__('Select Datenschutz', 'bootscore')}
                                value={this.props.attributes.selectedDatenschutz}
                                options={this.state.datenschutzSelects}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({selectedDatenschutz: e})}
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
                        <PanelBody
                            title={__('Cluster | Zoom', 'bootscore')}
                            initialOpen={false}
                            className="hupa-v3-theme-leaflet-maps-panel"
                        >
                            <TextControl
                                label="Cluster Radius"
                                value={this.props.attributes.clusterRadius}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({clusterRadius: e})}
                                type="number"
                            />
                            <TextControl
                                label="zoom"
                                value={this.props.attributes.cardZoom}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({cardZoom: e})}
                                type="number"
                            />
                            <TextControl
                                label="min. zoom"
                                value={this.props.attributes.minZoom}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({minZoom: e})}
                                type="number"
                            />
                            <TextControl
                                label="max. Zoom"
                                value={this.props.attributes.maxZoom}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({maxZoom: e})}
                                type="number"
                            />
                        </PanelBody>
                        <PanelBody
                            title={__('Minimap', 'bootscore')}
                            initialOpen={false}
                            className="hupa-v3-theme-leaflet-maps-panel"
                        >
                            <ToggleControl
                                label="Minimap aktiv"
                                __nextHasNoMarginBottom={true}
                                checked={this.props.attributes.showMinimap}
                                onChange={(e) => this.props.setAttributes({showMinimap: e})}
                            />
                            <TextControl
                                label="Minimap Breite"
                                value={this.props.attributes.minimapWidth}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({minimapWidth: e})}
                                type="number"
                            />
                            <TextControl
                                label="Minimap Höhe"
                                value={this.props.attributes.minimapHeight}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({minimapHeight: e})}
                                type="number"
                            />
                            <TextControl
                                label="Minimap zoom"
                                value={this.props.attributes.minimapMinZoom}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({minimapMinZoom: e})}
                                type="number"
                            />
                            <TextControl
                                label="Minimap max. zoom"
                                value={this.props.attributes.minimapMaxZoom}
                                __nextHasNoMarginBottom={true}
                                onChange={(e) => this.props.setAttributes({minimapMaxZoom: e})}
                                type="number"
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
