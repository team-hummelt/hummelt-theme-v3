import './editor.scss';
import './style.scss';

const {registerBlockType} = wp.blocks;
import {InnerBlocks, useBlockProps, InspectorControls, RichText} from '@wordpress/block-editor';
import icon from './icon.js';
const {__} = wp.i18n;
const { Fragment } = wp.element;
const { PanelBody, ToggleControl, RangeControl } = wp.components;
registerBlockType('hupa/accordion-item', {
    title: __('Accordion Item', 'bootscore'),
    icon: icon,
    category: 'theme-v3-addons',
    parent: ['hupa/accordion'], // Erzwingt, dass dieser Block nur im Accordion benutzt wird
    supports: {
        reusable: false, // In der Regel kein eigenes Reusable hier benötigt
    },
    attributes: {
        itemId: {
            type: 'string',
            default: ''
        },
        title: {
            type: 'string',
            default: ''
        },
        isOpen: {
            type: 'boolean',
            default: false
        },
        scrollToItem: {
            type: 'boolean',
            default: false
        },       // Neu: Soll gescrollt werden?
        scrollOffset: {
            type: 'number',
            default: 0
        },     // Neu: Offset in px
    },
    edit({attributes, setAttributes})  {
        const {
            itemId,
            title,
            scrollToItem,
            scrollOffset,
            isOpen,
        } = attributes;

        if (!itemId) {
            const uniqueId = `item-${Math.random().toString(36).slice(2, 9)}`;
            setAttributes({itemId: uniqueId});
        }


        const blockProps = useBlockProps({
            className: 'hupa-accordion-item',
        });

        // Hier könnte man auch ein eigenes Template definieren, etwa:
        // template={[['core/heading', { placeholder: __('Accordion Title', 'myplugin') }], ['core/paragraph', { placeholder: __('Accordion content...', 'myplugin') }]]}
        // Wenn man maximale Freiheit will, einfach ohne Template, aber mit InnerBlocks
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={ __('Scrolling Options', 'bootscore') } initialOpen={true}>
                        <ToggleControl
                            label={ __('Scroll to this item on open', 'bootscore') }
                            checked={ scrollToItem }
                            onChange={ (newVal) => setAttributes({ scrollToItem: newVal }) }
                            __nextHasNoMarginBottom={true}
                        />
                        {scrollToItem && (
                            <RangeControl
                                label={ __('Scroll Offset (px)', 'bootscore') }
                                value={ scrollOffset }
                                onChange={(newOffset) => setAttributes({ scrollOffset: newOffset })}
                                __nextHasNoMarginBottom={true}
                                step={10}
                                min={0}
                                max={500}
                            />
                        )}
                    </PanelBody>
                    <PanelBody title={ __('Open State', 'bootscore') } initialOpen={true}>
                        <ToggleControl
                            label={ __('Item open by default', 'bootscore') }
                            checked={ isOpen }
                            __nextHasNoMarginBottom={true}
                            onChange={ (newVal) => setAttributes({ isOpen: newVal }) }
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <RichText
                        tagName="h5"
                        className="text-body"
                        value={ title }
                        onChange={(newTitle) => setAttributes({ title: newTitle })}
                        placeholder={ __('Accordion Title...', 'bootscore') }
                    />
                    <InnerBlocks />
                </div>
            </Fragment>
        );
    },
    save({attributes}) {
        const { itemId, title, scrollToItem, scrollOffset, isOpen } = attributes;
        return (
            <div
                className="accordion-item"
                data-scroll-to-item={ scrollToItem ? 'true' : 'false' }
                data-scroll-offset={ scrollOffset }
            >
                <h5 className="accordion-header" id={`heading-${itemId}`}>
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${itemId}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${itemId}`}
                    >
                        { title }
                    </button>
                </h5>
                <div id={`collapse-${itemId}`}
                     className={`accordion-collapse collapse${ isOpen ? ' show' : ''}`}
                     aria-labelledby={`heading-${itemId}`}>
                    <div className="accordion-body">
                        <InnerBlocks.Content />
                    </div>
                </div>
            </div>
        );
    },
});