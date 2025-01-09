import './editor.scss';
import './style.scss';

const {__} = wp.i18n;
const {Component, Fragment} = wp.element;
const {registerBlockType, PlainText} = wp.blocks;
import {
    InspectorControls,
    ColorPaletteControl
} from '@wordpress/block-editor';
import {
    TextControl,
    ToggleControl,
    PanelBody,
    Panel,
    RadioControl

} from '@wordpress/components';

registerBlockType('hupa-v3/theme-google-maps', {
    title: __('Google Maps'),
    icon: 'google',
    category: 'media',
    attributes: {
        selectedMap: {
            type: 'string',
        },
        cardWidth: {
            type: 'string',
        },
        cardHeight: {
            type: 'string',
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

        }

        render() {
            return (
                <div className="hupa-v3-theme-google-maps">
                    <Panel className="tools-form-panel">
                        <h5 className="hupa-tools-headline">Google Maps </h5>
                    </Panel>
                </div>
            );
        }
    },
    save() {
        return null;
    }
});
