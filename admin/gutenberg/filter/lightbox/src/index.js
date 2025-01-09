import './editor.scss';
const {__} = wp.i18n;
const {PanelBody, PanelRow, ToggleControl, TextControl, SelectControl} = wp.components;
const {createHigherOrderComponent} = wp.compose;
const blockLightBoxTypes = ['core/gallery', 'core/image'];
const { select } = wp.data;
/**
 * Lightbox Options Attributes
 *
 * @param settings
 * @param name
 * @returns {*}
 */
function addLightAttribute(settings, name) {
    if (typeof settings.attributes !== 'undefined') {
        if (blockLightBoxTypes.includes(name)) {
            settings.attributes = Object.assign(settings.attributes, {
                lightBoxAktiv: {
                    type: 'boolean',
                    default: false
                },
                lightBoxSingle: {
                    type: 'boolean',
                    default: false
                }
            });
        }
    }
    return settings;
}


/**
 * LIGHTBOX Options Filter
 * @param extraProps
 * @param blockType
 * @param attributes
 * @returns {*}
 */
function lightBoxApplyClass(extraProps, blockType, attributes) {

    if (blockLightBoxTypes.includes(blockType.name)) {
        const {lightBoxAktiv, lightBoxSingle} = attributes;
        if (typeof lightBoxAktiv !== 'undefined' && lightBoxAktiv) {
            if (blockType.name === 'core/gallery') {
                extraProps.className = extraProps.className + ' gallery-lightbox';
            }

            if (blockType.name === 'core/image') {
                extraProps.className = extraProps.className + ' hupa-lightbox';

            }
            if (typeof lightBoxAktiv !== 'undefined' && lightBoxSingle) {
                extraProps.className = extraProps.className + ' lightbox-single';
            }
        }
    }
    return extraProps;
}
/**
 * Inspector Controls
 */
const hupaLightboxAdvancedControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {Fragment} = wp.element;
        const {SelectControl} = wp.components;
        const {InspectorAdvancedControls, InspectorControls } = wp.blockEditor;
        const {attributes, setAttributes, isSelected} = props;

        return (
            <Fragment>
                <BlockEdit {...props} />
                {isSelected && (blockLightBoxTypes.includes(props.name)) &&
                    <InspectorControls>

                        <PanelBody
                            className="editor-styles-wrapper- sidebar-advanced-controls-"
                        >
                            <p className="fw-normal">
                                {__('Theme Lightbox options', 'bootscore')}
                            </p>

                            <ToggleControl
                                label={__('Lightbox active', 'bootscore')}
                                checked={!!attributes.lightBoxAktiv}
                                __nextHasNoMarginBottom={true}
                                onChange={(newAlign) => setAttributes({lightBoxAktiv: !attributes.lightBoxAktiv})}
                            />
                            <ToggleControl
                                label={__('Lightbox single', 'bootscore')}
                                checked={!!attributes.lightBoxSingle}
                                __nextHasNoMarginBottom={true}
                                onChange={(newAlign) => setAttributes({lightBoxSingle: !attributes.lightBoxSingle})}
                            />
                        </PanelBody>
                    </InspectorControls>
                }
            </Fragment>
        );
    };
});

/**
 *  Lightbox Filter Option
 *
 */
wp.hooks.addFilter(
    'blocks.registerBlockType',
    'hupa/hupa-lightbox-attribute',
    addLightAttribute
);

wp.hooks.addFilter(
    'blocks.getSaveContent.extraProps',
    'hupa/theme-light-class',
    lightBoxApplyClass
);

wp.hooks.addFilter(
    'editor.BlockEdit',
    'hupa/lightbox-advanced-control',
    hupaLightboxAdvancedControls
);



