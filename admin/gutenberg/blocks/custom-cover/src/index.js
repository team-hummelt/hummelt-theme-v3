const { registerBlockType } = wp.blocks;
import './style.scss';
import './editor.scss';
import metadata from '../block.json';
import Edit from './edit.js';
import Save from './save.js';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
});
