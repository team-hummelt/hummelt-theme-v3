/*
 * Plugin Name: Google Maps Iframe Block
 * Description: Ein Gutenberg-Block, um einen Google Maps Iframe einzufügen, mit einstellbarer Höhe, Breite und URL.
 * Version: 1.5
 * Author: Jens
 */

import './editor.scss';
import icon from './icon.js';
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, TextareaControl, SelectControl } = wp.components;
const { Component, Fragment } = wp.element;
const {__} = wp.i18n;

const filterIframeUrl = (inputUrl) => {
    const regex = /^https:\/\/www\.google\.com\/maps\/embed\?pb=.+/;
    if (regex.test(inputUrl)) {
        return inputUrl;
    } else {
        return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2450.4133799679653!2d11.630649376907613!3d52.10860696660599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a5f5e71849d0db%3A0xdf90cecb1e65843b!2shummelt%20und%20partner%20%7C%20Werbeagentur%20GmbH!5e0!3m2!1sde!2sde!4v1734431038321!5m2!1sde!2sde';  // Fallback URL
    }
};

registerBlockType("hupa/google-maps-iframe", {
    title: "Google Maps Iframe",
    icon: icon,
    category: "media",
    attributes: {
        datenschutz: {
            type: 'string',
            default: '',
        },
        iframeUrl: {
            type: "string",
            default: '',
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
            this.props.setAttributes({ iframeUrl: filteredUrl });
        };

        onWidthChange = (width) => {
            this.props.setAttributes({ iframeWidth: width });
        };

        onHeightChange = (height) => {
            this.props.setAttributes({ iframeHeight: height });
        };

        onChangeDatenschutz = (datenschutz) => {
            this.props.setAttributes({ datenschutz: datenschutz });
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
            const { attributes: {datenschutz, iframeUrl, iframeWidth, iframeHeight } } = this.props;

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
                            <TextControl
                                label="Breite (px)"
                                value={iframeWidth}
                                __nextHasNoMarginBottom={true}
                                type="number"
                                onChange={this.onWidthChange}
                            />
                            <TextControl
                                label="Höhe (px)"
                                value={iframeHeight}
                                __nextHasNoMarginBottom={true}
                                type="number"
                                onChange={this.onHeightChange}
                            />
                        </PanelBody>
                    </InspectorControls>
                    <div className="google-maps-iframe-wrapper">
                        <iframe
                            src={iframeUrl}
                            width={iframeWidth}
                            height={iframeHeight}
                            className="google-maps-iframe"
                            allowFullScreen
                        ></iframe>
                    </div>
                </Fragment>
            );
        }
    },

    save: () => {
        return null;
    },
});
