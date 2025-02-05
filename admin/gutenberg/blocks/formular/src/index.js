/*
 * Plugin Name: Theme V3 Formular Block
 * Description: Ein Gutenberg-Block, um einen Google Maps Iframe einzufügen, mit einstellbarer Höhe, Breite und URL.
 * Version: 1.5
 * Author: Jens
 */

import './editor.scss';
import icon from './icon.js';

const {registerBlockType} = wp.blocks;
const {InspectorControls} = wp.blockEditor;
const {PanelBody, TextControl, TextareaControl, SelectControl} = wp.components;
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;

registerBlockType("hupa/theme-formular", {
    title: "Formular",
    icon: icon,
    category: 'theme-v3-addons',
    description: "Formular mit SMTP und unzähligen Anpassungsmöglichkeiten.",
    attributes: {
        formular: {
            type: 'string',
            value: ''
        },
    },

    edit: class extends Component {
        constructor(props) {
            super(...arguments);
            this.props = props;
            this.state = {
                formSelects: [],
            }
        }

        componentDidMount() {
            let formData = {
                'method': 'get_theme_forms'
            }
            this.sendFetchApi(formData)
        }

        onFormsChange = (formular) => {

            this.props.setAttributes({formular: formular});
        };

        sendFetchApi(formData, path = hummeltRestEditorObj.gutenberg_rest_path + 'settings') {
            wp.apiFetch({
                path: path,
                method: 'POST',
                data: formData,
            }).then(data => {
                switch (data.type) {
                    case 'get_theme_forms':
                        if (data.status) {
                            this.setState({
                                formSelects: data.form_selects,
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
            const {attributes: {formular}} = this.props;
            return (
                <Fragment>
                    <InspectorControls>
                        <PanelBody title="Einstellungen">
                            <SelectControl
                                label={__('Select Formular', 'bootscore')}
                                value={formular}
                                options={this.state.formSelects}
                                __nextHasNoMarginBottom={true}
                                onChange={this.onFormsChange}
                            />

                        </PanelBody>
                    </InspectorControls>
                    <div className="theme-formular-wrapper">
                        <div className="theme-form-inner">
                            <h5>Theme Formular</h5>
                            <hr/>
                            <SelectControl
                                className="form-custom-select"
                                label={__('Select Formular', 'bootscore')}
                                value={formular}
                                options={this.state.formSelects}
                                __nextHasNoMarginBottom={true}
                                onChange={this.onFormsChange}
                            />
                        </div>
                    </div>
                </Fragment>
            );
        }
    },

    save() {
        return null;
    },
});