/*
 * Plugin Name: OpenStreetMap Iframe Block
 * Description: Ein Gutenberg-Block, um einen OpenStreetMap Iframe einzufügen, mit einstellbarer Höhe, Breite und URL.
 * Version: 1.0
 * Author: Jens
 */

import './editor.scss';
import icon from './icon.js';

const {registerBlockType} = wp.blocks;
const {InspectorControls} = wp.blockEditor;
const {PanelBody, TextControl, SelectControl, TextareaControl} = wp.components;
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;
const filterIframeUrl = (inputUrl) => {
    try {
        const decodedUrl = decodeURIComponent(inputUrl.replace(/&amp;/g, '&'));
        const regex = /^https:\/\/www\.openstreetmap\.org\/export\/embed\.html\?bbox=.+(&marker=\d+\.\d+,-?\d+\.\d+)?/;
        if (regex.test(decodedUrl)) {
            return decodedUrl;
        } else {
            return "https://www.openstreetmap.org/export/embed.html"; // Fallback URL
        }
    } catch (e) {
        console.error(e.message);
        return "https://www.openstreetmap.org/export/embed.html"; // Fallback URL
    }
};


registerBlockType("hupa/openstreetmap-iframe", {
    title: "OpenStreetMap Iframe",
    icon: icon,
    category: "media",
    attributes: {
        datenschutz: {
            type: 'string',
            default: '',
        },
        iframeUrl: {
            type: "string",
            default: "https://www.openstreetmap.org/export/embed.html",
        },
        largeUrl: {
            type: "string",
            default: "",
        },
        iframeWidth: {
            type: "number",
            default: 600,
        },
        iframeHeight: {
            type: "number",
            default: 450,
        },
    },

    edit: class extends Component {
        constructor(props) {
            super(...arguments);
            this.props = props;
            this.osmIframe = React.createRef();
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

        onUrlChange = (url) => {
            const filteredUrl = filterIframeUrl(url);
            this.props.setAttributes({iframeUrl: filteredUrl});
        };

        onLargeUrlChange = (largeUrl) => {
            this.props.setAttributes({largeUrl: largeUrl});
        };

        onWidthChange = (width) => {
            this.props.setAttributes({iframeWidth: width});
        };

        onHeightChange = (height) => {
            this.props.setAttributes({iframeHeight: height});
        };
        onChangeDatenschutz = (datenschutz) => {
            this.props.setAttributes({datenschutz: datenschutz});
        };

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
            const {attributes: {datenschutz, iframeUrl, iframeWidth, iframeHeight, largeUrl}} = this.props;

            return (
                <Fragment>
                    <InspectorControls>
                        <PanelBody title="Einstellungen">
                            <SelectControl
                                label={__('Select Datenschutz', 'bootscore')}
                                value={datenschutz}
                                options={this.state.datenschutzSelects}
                                __nextHasNoMarginBottom={true}
                                onChange={this.onChangeDatenschutz}
                            />
                            <TextareaControl
                                label="Iframe URL"
                                value={iframeUrl}
                                rows={8}
                                __nextHasNoMarginBottom={true}
                                onChange={this.onUrlChange}
                            />
                            <TextareaControl
                                label="Link große Karte"
                                value={largeUrl}
                                rows={3}
                                type="text"
                                __nextHasNoMarginBottom={true}
                                onChange={this.onLargeUrlChange}
                            />
                            <TextControl
                                label="Breite (px)"
                                value={iframeWidth}
                                type="number"
                                __nextHasNoMarginBottom={true}
                                onChange={this.onWidthChange}
                            />
                            <TextControl
                                label="Höhe (px)"
                                value={iframeHeight}
                                type="number"
                                __nextHasNoMarginBottom={true}
                                onChange={this.onHeightChange}
                            />
                        </PanelBody>
                    </InspectorControls>
                    <div className="openstreetmap-iframe-wrapper">
                        <div className="osm-iframe">
                        <div ref={this.osmIframe} className="iframe-osm-overlay"></div>
                        <iframe
                            src={iframeUrl}
                            width={iframeWidth}
                            height={iframeHeight}
                            className="openstreetmap-iframe"
                            allowFullScreen
                        ></iframe>
                        </div>
                    </div>
                </Fragment>
            );
        }
    },

    save: () => {
        return null;
    },
});
