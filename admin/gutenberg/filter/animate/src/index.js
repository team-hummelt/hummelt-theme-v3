const {__} = wp.i18n;
const {PanelBody, PanelRow, ToggleControl, TextControl, SelectControl} = wp.components;
const {createHigherOrderComponent} = wp.compose;
const blockAnimationTypes = ['core/paragraph', 'core/image', 'core/heading', 'core/gallery', 'core/list', 'core/button', 'core/columns', 'core/group', 'core/column'];

/**
 * Animate Option Attributes
 * @param settings
 * @param name
 * @returns {*}
 */
function addAnimationWowAttribute(settings, name) {
    if (typeof settings.attributes !== 'undefined') {
        if (blockAnimationTypes.includes(name)) {
            settings.attributes = Object.assign(settings.attributes, {
                animationType: {
                    type: 'string',
                    default: ''
                },
                wowIteration: {
                    type: 'string',
                    default: '1'
                },
                wowDuration: {
                    type: 'string',
                    default: '0.5s'
                },
                wowDelay: {
                    type: 'string',
                    default: '0.1s'
                },
                wowOffset: {
                    type: 'string',
                    default: '5'
                },
                animationRepeat: {
                    type: 'boolean',
                    default: false
                },
                themeAnimationType : {
                    type: 'string',
                    default: ''
                },
                themeAnimationRepeat: {
                    type: 'boolean',
                    default: false
                },
                showTop: {
                    type: 'string',
                    default: '100'
                },
                showBottom: {
                    type: 'string',
                    default: '150'
                }
            });
        }
    }
    return settings;
}

/**
 * Animation Options Filter
 * @param extraProps
 * @param blockType
 * @param attributes
 * @returns {*}
 */
function animationWowApplyClass(extraProps, blockType, attributes) {
    if (blockAnimationTypes.includes(blockType.name)) {
        const {
            animationType,
            wowIteration,
            wowDuration,
            wowDelay,
            wowOffset,
            animationRepeat,
            themeAnimationType,
            themeAnimationRepeat,
            showTop,
            showBottom,
        } = attributes;

        // AnimationType Klassen
        if (typeof animationType !== 'undefined' && animationType) {
            extraProps.className = (extraProps.className || '') + ' theme-wow-animation';

            extraProps['data-type-animation'] = animationType;
            if (wowIteration) extraProps['data-wow-iteration'] = wowIteration;
            if (wowDuration) extraProps['data-wow-duration'] = wowDuration;
            if (wowDelay) extraProps['data-wow-delay'] = wowDelay;
            if (wowOffset) extraProps['data-wow-offset'] = wowOffset;
            if (animationRepeat) extraProps['data-animation-no-repeat'] = animationRepeat;
        }

        // Theme Animation Klassen
        if (typeof themeAnimationType !== 'undefined' && themeAnimationType) {
            extraProps.className = (extraProps.className || '') + ' ' + themeAnimationType;

            if (themeAnimationRepeat) {
                extraProps.className += ' notRepeat';
            }
            if (showTop) {
                extraProps['data-animation-top'] = showTop;
            }
            if (showBottom) {
                extraProps['data-animation-bottom'] = showBottom;
            }
        }
    }
    return extraProps;
}


/**
 * Inspector Controls
 */
const hupaAnimateControls = createHigherOrderComponent((BlockEdit) => {

    return (props) => {
        const {Fragment} = wp.element;
        const {SelectControl} = wp.components;
        const {InspectorAdvancedControls} = wp.blockEditor;
        const {attributes, setAttributes, isSelected} = props;

        const setSelectedOption = value => {
            const panelHeadline = document.querySelector('.panel-headline');
            const animateBox = document.querySelectorAll('.animate__animated');
            const aniEvent = Array.prototype.slice.call(animateBox, 0);
            aniEvent.forEach(function (aniEvent) {
                if(aniEvent.classList[3]){
                    aniEvent.classList.remove(aniEvent.classList[3]);
                }
            });
            panelHeadline.classList.add('animate__'+value);
            setAttributes({animationType: value})
        };

        return (
            <Fragment>
                <BlockEdit {...props} />
                {isSelected && (blockAnimationTypes.includes(props.name)) &&
                    <InspectorAdvancedControls>
                        <PanelBody
                            title={__('Animation (animate)', 'bootscore')}
                            initialOpen={false}
                            __nextHasNoMarginBottom={true}
                            className="editor-styles-wrapper sidebar-advanced-controls"
                        >
                            <p className="fw-normal panel-headline animate__animated">
                               {__('Animate options', 'bootscore')}
                            </p>
                            <SelectControl
                                label={__('Select animation', 'bootscore')}
                                value={attributes.animationType}
                                __nextHasNoMarginBottom={true}
                                options={[
                                    {label: __('select', 'bootscore') + '...', value: ''},
                                    {label: 'bounce', value: 'bounce'},
                                    {label: 'flash', value: 'flash'},
                                    {label: 'pulse', value: 'pulse'},
                                    {label: 'rubberBand', value: 'rubberBand'},
                                    {label: 'shakeX', value: 'shakeX'},
                                    {label: 'headShake', value: 'headShake'},
                                    {label: 'swing', value: 'swing'},
                                    {label: 'tada', value: 'tada'},
                                    {label: 'wobble', value: 'wobble'},
                                    {label: 'jello', value: 'jello'},
                                    {label: 'heartBeat', value: 'heartBeat'},
                                    {label: '---- BackIn', value: '', className: 'SelectSeparator', disabled:true},
                                    {label: 'backInDown', value: 'backInDown'},
                                    {label: 'backInLeft', value: 'backInLeft'},
                                    {label: 'backInRight', value: 'backInRight'},
                                    {label: 'backInUp', value: 'backInUp'},
                                    {label: '---- Bounce', value: '', className: 'SelectSeparator', disabled:true},
                                    {label: 'bounceIn', value: 'bounceIn'},
                                    {label: 'bounceInDown', value: 'bounceInDown'},
                                    {label: 'bounceInLeft', value: 'bounceInLeft'},
                                    {label: 'bounceInRight', value: 'bounceInRight'},
                                    {label: 'bounceInUp', value: 'bounceInUp'},
                                    {label: '---- Fade', value: '', className: 'SelectSeparator', disabled:true},
                                    {label: 'fadeIn', value: 'fadeIn'},
                                    {label: 'fadeInDown', value: 'fadeInDown'},
                                    {label: 'fadeInDownBig', value: 'fadeInDownBig'},
                                    {label: 'fadeInLeft', value: 'fadeInLeft'},
                                    {label: 'fadeInLeftBig', value: 'fadeInLeftBig'},
                                    {label: 'fadeInRight', value: 'fadeInRight'},
                                    {label: 'fadeInRightBig', value: 'fadeInRightBig'},
                                    {label: 'fadeInUp', value: 'fadeInUp'},
                                    {label: 'fadeInUpBig', value: 'fadeInUpBig'},
                                    {label: 'fadeInTopLeft', value: 'fadeInTopLeft'},
                                    {label: 'fadeInTopRight', value: 'fadeInTopRight'},
                                    {label: 'fadeInBottomLeft', value: 'fadeInBottomLeft'},
                                    {label: 'fadeInBottomRight', value: 'fadeInBottomRight'},
                                    {label: '---- Flip', value: '', className: 'SelectSeparator', disabled:true},
                                    {label: 'flip', value: 'flip'},
                                    {label: 'flipInX', value: 'flipInX'},
                                    {label: 'flipInY', value: 'flipInY'},
                                    {label: 'flipOutX', value: 'flipOutX'},
                                    {label: 'flipOutY', value: 'flipOutY'},
                                    {label: '---- Light Speed', value: '', className: 'SelectSeparator', disabled:true},
                                    {label: 'lightSpeedInRight', value: 'lightSpeedInRight'},
                                    {label: 'lightSpeedInLeft', value: 'lightSpeedInLeft'},
                                    {label: 'lightSpeedOutRight', value: 'lightSpeedOutRight'},
                                    {label: 'lightSpeedOutLeft', value: 'lightSpeedOutLeft'},
                                    {label: '---- Rotate', value: '', className: 'SelectSeparator', disabled:true},
                                    {label: 'rotateIn', value: 'rotateIn'},
                                    {label: 'rotateInDownLeft', value: 'rotateInDownLeft'},
                                    {label: 'rotateInDownRight', value: 'rotateInDownRight'},
                                    {label: 'rotateInUpLeft', value: 'rotateInUpLeft'},
                                    {label: 'rotateInUpRight', value: 'rotateInUpRight'},
                                    {label: '---- Zoom', value: '', className: 'SelectSeparator', disabled:true},
                                    {label: 'zoomIn', value: 'zoomIn'},
                                    {label: 'zoomInDown', value: 'zoomInDown'},
                                    {label: 'zoomInLeft', value: 'zoomInLeft'},
                                    {label: 'zoomInRight', value: 'zoomInRight'},
                                    {label: 'zoomInUp', value: 'zoomInUp'},
                                    {label: '---- Slide', value: '', className: 'SelectSeparator', disabled:true},
                                    {label: 'slideInDown', value: 'slideInDown'},
                                    {label: 'slideInLeft', value: 'slideInLeft'},
                                    {label: 'slideInRight', value: 'slideInRight'},
                                    {label: 'slideInUp', value: 'slideInUp'}
                                ]}
                                onChange={newValue => setSelectedOption(newValue)}
                            />
                            <TextControl
                                label={__('Wiederholungen', 'bootscore')}
                                labelPosition="top"
                                value={attributes.wowIteration}
                                type="text"
                                __nextHasNoMarginBottom={true}
                                help="Anzahl der Wiederholungen der Animation. (infinite für unendlich)"
                                onChange={(newValue) => setAttributes({wowIteration: newValue.toString()})}
                            />
                            <TextControl
                                label={__('Dauer der Animation', 'bootscore')}
                                labelPosition="top"
                                value={attributes.wowDuration}
                                type="text"
                                __nextHasNoMarginBottom={true}
                                help="Ändern Sie die Dauer der Animation. (z.B. 2s)"
                                onChange={(newValue) => setAttributes({wowDuration: newValue.toString()})}
                            />
                            <TextControl
                                label={__('Verzögerung', 'bootscore')}
                                labelPosition="top"
                                value={attributes.wowDelay}
                                type="text"
                                __nextHasNoMarginBottom={true}
                                help="Verzögerung vor Beginn der Animation. (z.B. 3s)"
                                onChange={(newValue) => setAttributes({wowDelay: newValue.toString()})}
                            />
                            <TextControl
                                label={__('Start der Animation', 'bootscore')}
                                labelPosition="top"
                                value={attributes.wowOffset}
                                type="number"
                                __nextHasNoMarginBottom={true}
                                help="Abstand zum Start der Animation (bezogen auf den unteren Rand des Browsers)."
                                onChange={(newValue) => setAttributes({wowOffset: newValue.toString()})}
                            />
                            <ToggleControl
                                label={__('keine Wiederholung', 'bootscore')}
                                checked={!!attributes.animationRepeat}
                                __nextHasNoMarginBottom={true}
                                help="Wenn aktiv, wird nach dem Scrollen die Animation nicht wiederholt."
                                onChange={(newAlign) => setAttributes({animationRepeat: !attributes.animationRepeat})}
                            />
                        </PanelBody>
                        <PanelBody
                            title={__('Theme Animation ', 'bootscore')}
                            initialOpen={false}
                            className="editor-styles-wrapper- sidebar-advanced-controls-"
                        >
                            <p className="fw-normal panel-headline">
                                {__('Theme Fade animate options', 'bootscore')}
                            </p>
                            <SelectControl
                                label={__('Select animation', 'bootscore')}
                                value={attributes.themeAnimationType}
                                __nextHasNoMarginBottom={true}
                                options={[
                                    {label: __('select', 'bootscore') + '...', value: ''},
                                    {label: __('Fade-Scroll', 'bootscore'), value: 'fadeScroll'},
                                    {label: __('Move-Left', 'bootscore'), value: 'moveLeft'},
                                    {label: __('Move-Right', 'bootscore'), value: 'moveRight'},
                                    {label: __('Move-Top', 'bootscore'), value: 'moveTop'},
                                    {label: __('Move-Bottom', 'bootscore'), value: 'moveBottom'},
                                ]}
                                onChange={(newValue) => setAttributes({themeAnimationType: newValue})}
                            />
                            <TextControl
                                label={__('Start der Animation', 'bootscore')}
                                labelPosition="top"
                                value={attributes.showTop}
                                type="number"
                                __nextHasNoMarginBottom={true}
                                help="Abstand zum Start der Animation (bezogen auf den oberen Rand des Browsers)."
                                onChange={(newValue) => setAttributes({showTop: newValue.toString()})}
                            />
                            <TextControl
                                label={__('Ende der Animation', 'bootscore')}
                                labelPosition="top"
                                value={attributes.showBottom}
                                type="number"
                                __nextHasNoMarginBottom={true}
                                help="Abstand zum Start der Animation (bezogen auf den unteren Rand des Browsers)."
                                onChange={(newValue) => setAttributes({showBottom: newValue.toString()})}
                            />
                            <ToggleControl
                                label={__('keine Wiederholung', 'bootscore')}
                                checked={!!attributes.themeAnimationRepeat}
                                __nextHasNoMarginBottom={true}
                                help="Wenn aktiv, wird nach dem Scrollen die Animation nicht wiederholt."
                                onChange={(newAlign) => setAttributes({themeAnimationRepeat: !attributes.themeAnimationRepeat})}
                            />
                        </PanelBody>
                    </InspectorAdvancedControls>
                }
            </Fragment>
        );
    };
}, 'hupaAnimateControls');

/**
 *  Animate Filter Option
 *
 */
wp.hooks.addFilter(
    'blocks.registerBlockType',
    'hupa/hupa-animation-wow-attribute',
    addAnimationWowAttribute
);

wp.hooks.addFilter(
    'blocks.getSaveContent.extraProps',
    'hupa/animation-wow-class',
    animationWowApplyClass
);

wp.hooks.addFilter(
    'editor.BlockEdit',
    'hupa/animation-wow-control',
    hupaAnimateControls
);


