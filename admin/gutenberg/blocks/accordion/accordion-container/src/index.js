import './editor.scss';
import './style.scss';
const {registerBlockType, createBlock} = wp.blocks;
import { InnerBlocks, useBlockProps, BlockControls } from '@wordpress/block-editor';
import {ToolbarButton, ToolbarGroup } from '@wordpress/components';
const {__} = wp.i18n;
import icon from './icon.js';

registerBlockType('hupa/accordion', {
    title: __('Accordion', 'bootscore'),
    icon: icon,
    category: 'theme-v3-addons',
    supports: {
        // Durch InnerBlocks sind andere Funktionen weitgehend bereits möglich
        align: false,
    },
    edit: ({ clientId }) => {
        const blockProps = useBlockProps({
            className: 'hupa-accordion-container',
        });

        // Optional: Einen Button in der Toolbar, um neue Accordion Items hinzuzufügen
        const addItem = () => {
            const accordionItemBlock = createBlock('hupa/accordion-item');
            wp.data.dispatch('core/block-editor').insertBlocks(accordionItemBlock, undefined, clientId);
        };

        return (
            <>
                <BlockControls>
                    <ToolbarGroup>
                        <ToolbarButton
                            onClick={ addItem }
                            icon="plus"
                            label={ __('Add Accordion Item', 'bootscore') }
                        />
                    </ToolbarGroup>
                </BlockControls>
                <div { ...blockProps }>
                    <InnerBlocks
                        allowedBlocks={['hupa/accordion-item']}
                        template={[['hupa/accordion-item']]}
                        templateLock={false} // false ermöglicht Hinzufügen/Entfernen von Items
                    />
                </div>
            </>
        );
    },
    save: () => {
        // Das Frontend-Rendering: Wir speichern nur den InnerBlocks-Content.
        // Die JavaScript-Logik (Toggle) kann separat eingebunden werden.
        return (
            <div className="accordion">
                <InnerBlocks.Content />
            </div>
        );
    },
});