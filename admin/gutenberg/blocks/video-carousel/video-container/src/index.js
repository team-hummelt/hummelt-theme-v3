import './editor.scss';

const {registerBlockType, createBlock} = wp.blocks;
import {InnerBlocks, useBlockProps, BlockControls, InspectorControls} from '@wordpress/block-editor';
const {ToolbarButton, ToolbarGroup, PanelBody, ToggleControl, TextControl} =  wp.components;

const {__} = wp.i18n;
import icon from './icon.js';
import Icon from "./icon.js";

registerBlockType('hupa/video-carousel-container', {
    title: __('Video Carousel', 'bootscore'),
    icon: icon,
    category: 'theme-v3-medien',
    description: "Flexibles Video Carousel für einzelne oder mehrere Videos – mit zahlreichen Anpassungsmöglichkeiten.",
    supports: {
        // Durch InnerBlocks sind andere Funktionen weitgehend bereits möglich
        align: false,
    },
    attributes: {
        itemId: {
            type: 'string',
            default: ''
        },
        startSlideshow: {
            type: 'boolean',
            default: false
        },
        continuous: {
            type: 'boolean',
            default: true
        },
        toggleControlsOnEnter: {
            type: 'boolean',
            default: true
        },
        toggleControlsOnSlideClick: {
            type: 'boolean',
            default: true
        },
        toggleSlideshowOnSpace: {
            type: 'boolean',
            default: true
        },
        emulateTouchEvents: {
            type: 'boolean',
            default: true
        },
        stopTouchEventsPropagation: {
            type: 'boolean',
            default: false
        },
        slideshowInterval: {
            type: 'number',
            default: 5000
        },
    },
    edit({attributes, setAttributes})  {
        const {
            itemId,
            startSlideshow,
            continuous,
            slideshowInterval,
            toggleControlsOnEnter,
            toggleControlsOnSlideClick,
            toggleSlideshowOnSpace,
            emulateTouchEvents,
            stopTouchEventsPropagation,
        } = attributes;

        if (!itemId) {
            const uniqueId = `item-${Math.random().toString(36).slice(2, 9)}`;
            setAttributes({itemId: uniqueId});
        }

        const blockProps = useBlockProps({
            className: 'video-carousel-container',
        });

        // Optional: Einen Button in der Toolbar, um neue Accordion Items hinzuzufügen
        const addItem = () => {
            const videoItemBlock = createBlock('hupa/video-carousel-item');
            wp.data.dispatch('core/block-editor').insertBlocks(videoItemBlock, undefined, itemId);
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={ __('Carousel Settings', 'bootscore') } initialOpen={true}>
                        <ToggleControl
                            label={ __('Autoplay', 'bootscore') }
                            checked={ startSlideshow }
                            onChange={ (newVal) => setAttributes({ startSlideshow: newVal }) }
                            __nextHasNoMarginBottom={true}
                        />
                        <ToggleControl
                            label={ __('Slideshow loop', 'bootscore') }
                            checked={ continuous }
                            onChange={ (newVal) => setAttributes({ continuous: newVal }) }
                            __nextHasNoMarginBottom={true}
                        />
                        <ToggleControl
                            label={ __('Umschalten der Steuerelemente beim Drücken der Eingabetaste', 'bootscore') }
                            checked={ toggleControlsOnEnter }
                            onChange={ (newVal) => setAttributes({ toggleControlsOnEnter: newVal }) }
                            __nextHasNoMarginBottom={true}
                        />
                        <ToggleControl
                            label={ __('Umschalten der Steuerelemente beim Anklicken der Folie', 'bootscore') }
                            checked={ toggleControlsOnSlideClick }
                            onChange={ (newVal) => setAttributes({ toggleControlsOnSlideClick: newVal }) }
                            __nextHasNoMarginBottom={true}
                        />
                        <ToggleControl
                            label={ __('Umschalten des automatischen Diashow-Intervalls beim Drücken der Leertaste', 'bootscore') }
                            checked={ toggleSlideshowOnSpace }
                            onChange={ (newVal) => setAttributes({ toggleSlideshowOnSpace: newVal }) }
                            __nextHasNoMarginBottom={true}
                        />
                        <ToggleControl
                            label={ __('Emulation von Berührungsereignissen auf Geräten mit Mauszeigern wie Desktop-Browsern', 'bootscore') }
                            checked={ emulateTouchEvents }
                            onChange={ (newVal) => setAttributes({ emulateTouchEvents: newVal }) }
                            __nextHasNoMarginBottom={true}
                        />
                        <ToggleControl
                            label={ __('Verhindert, dass Berührungsereignisse auf Vorgängerelemente der Galerie übergreifen', 'bootscore') }
                            checked={ stopTouchEventsPropagation }
                            onChange={ (newVal) => setAttributes({ stopTouchEventsPropagation: newVal }) }
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Slideshow Intervall', 'bootscore')}
                            value={slideshowInterval}
                            __nextHasNoMarginBottom={true}
                            type='number'
                            onChange={ (newVal) => setAttributes({ slideshowInterval: newVal }) }
                        />
                    </PanelBody>
                </InspectorControls>
                <BlockControls>
                    <ToolbarGroup>
                        <ToolbarButton
                            onClick={addItem}
                            icon="plus"
                            label={__('Video hinzufügen', 'bootscore')}
                        />
                    </ToolbarGroup>
                </BlockControls>
                <div {...blockProps}>
                    <div className="video-container-inner d-flex align-items-center">
                        <Icon/>
                        <h5>Video Carousel</h5>
                    </div>

                    <InnerBlocks
                        allowedBlocks={['hupa/video-carousel-item']}
                        template={[['hupa/video-carousel-item']]}
                        templateLock={false} // false ermöglicht Hinzufügen/Entfernen von Items
                    />
                </div>
            </>
        );
    },
    save({attributes}) {
        // Das Frontend-Rendering: Wir speichern nur den InnerBlocks-Content.
        // Die JavaScript-Logik (Toggle) kann separat eingebunden werden.
        const {
            itemId,
            startSlideshow,
            continuous,
            slideshowInterval,
            toggleControlsOnEnter,
            toggleControlsOnSlideClick,
            toggleSlideshowOnSpace,
            emulateTouchEvents,
            stopTouchEventsPropagation,
        } = attributes;

        return (
            <div className="video-carousel">
                <div
                    className="blueimp-gallery blueimp-gallery-carousel blueimp-gallery-svgasimg blueimp-gallery-smil blueimp-gallery-display blueimp-gallery-controls"
                    aria-label="video gallery"
                    aria-modal="false"
                    role="dialog"
                    data-auto-slide={startSlideshow}
                    data-continuous={continuous}
                    data-interval={slideshowInterval}
                    data-toggle-control-enter={toggleControlsOnEnter}
                    data-toggle-control-slide={toggleControlsOnSlideClick}
                    data-toggle-control-space={toggleSlideshowOnSpace}
                    data-emulate-touch={emulateTouchEvents}
                    data-stop-touch={stopTouchEventsPropagation}
                >
                    <div className="slides" aria-live="polite"></div>
                    <h3 className="title"></h3>
                    <p className="description"></p>
                    <a
                        className="prev"
                        aria-controls="blueimp-gallery"
                        aria-label="previous slide"
                        aria-keyshortcuts="ArrowLeft"
                    ></a>
                    <a
                        className="next"
                        aria-controls="blueimp-gallery"
                        aria-label="next slide"
                        aria-keyshortcuts="ArrowRight"
                    ></a>
                    <a
                        className="play-pause"
                        aria-controls="blueimp-gallery"
                        aria-label="play slideshow"
                        aria-keyshortcuts="Space"
                        aria-pressed="false"
                        role="button"
                    ></a>
                    <ol className="indicator"></ol>

                </div>
                <InnerBlocks.Content/>
            </div>
        );
    },
});