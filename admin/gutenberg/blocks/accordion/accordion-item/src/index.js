import './editor.scss';
import './style.scss';
import { v4 as uuidv4 } from "uuid";
const { registerBlockType } = wp.blocks;
import { InnerBlocks, useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import icon from './icon.js';
const { __ } = wp.i18n;
const { Fragment, useEffect, useState } = wp.element;
const { PanelBody, ToggleControl, RangeControl } = wp.components;

registerBlockType('hupa/accordion-item', {
    title: __('Accordion Item', 'bootscore'),
    icon: icon,
    category: 'theme-v3-addons',
    parent: ['hupa/accordion'],
    supports: {
        reusable: false,
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
        },
        scrollOffset: {
            type: 'number',
            default: 0
        },
    },
    edit({ attributes, setAttributes }) {
        const {
            itemId,
            title,
            scrollToItem,
            scrollOffset,
            isOpen,
        } = attributes;

        // Einzigartige ID nur setzen, wenn sie noch nicht existiert
        useEffect(() => {
            if (!itemId) {
                setAttributes({ itemId: uuidv4() });
            }
        }, []);

        // Lokaler Zustand, um den Status unabhängig von anderen Blocks zu steuern
        const [localIsOpen, setLocalIsOpen] = useState(isOpen);

        const toggleAccordion = () => {
            setLocalIsOpen(!localIsOpen);
            setAttributes({ isOpen: !localIsOpen }); // Synchronisieren mit Gutenberg
        };

        const blockProps = useBlockProps({
            className: 'hupa-accordion-item',
        });

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={__('Scrolling Options', 'bootscore')} initialOpen={true}>
                        <ToggleControl
                            label={__('Scroll to this item on open', 'bootscore')}
                            checked={scrollToItem}
                            onChange={(newVal) => setAttributes({ scrollToItem: newVal })}
                            __nextHasNoMarginBottom={true}
                        />
                        {scrollToItem && (
                            <RangeControl
                                label={__('Scroll Offset (px)', 'bootscore')}
                                value={scrollOffset}
                                onChange={(newOffset) => setAttributes({ scrollOffset: newOffset })}
                                __nextHasNoMarginBottom={true}
                                step={10}
                                min={0}
                                max={500}
                            />
                        )}
                    </PanelBody>
                    <PanelBody title={__('Open State', 'bootscore')} initialOpen={true}>
                        <ToggleControl
                            label={__('Item open by default', 'bootscore')}
                            checked={localIsOpen}
                            __nextHasNoMarginBottom={true}
                            onChange={toggleAccordion}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <RichText
                        tagName="h5"
                        className="text-body"
                        value={title}
                        onChange={(newTitle) => setAttributes({ title: newTitle })}
                        placeholder={__('Accordion Title...', 'bootscore')}
                    />
                    <InnerBlocks />
                </div>
            </Fragment>
        );
    },
    save({ attributes }) {
        const { itemId, title, scrollToItem, scrollOffset, isOpen } = attributes;
        return (
            <div
                className="accordion-item"
                data-scroll-to-item={scrollToItem ? 'true' : 'false'}
                data-scroll-offset={scrollOffset}
            >
                <h5 className="accordion-header" id={`heading-${itemId}`}>
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${itemId}`}
                        aria-expanded={isOpen}
                        aria-controls={`collapse-${itemId}`}
                    >
                        {title}
                    </button>
                </h5>
                <div id={`collapse-${itemId}`}
                     className={`accordion-collapse collapse${isOpen ? ' show' : ''}`}
                     aria-labelledby={`heading-${itemId}`}>
                    <div className="accordion-body">
                        <InnerBlocks.Content />
                    </div>
                </div>
            </div>
        );
    },
});
