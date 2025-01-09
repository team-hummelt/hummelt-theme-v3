import './editor.scss';
import {registerFormatType, toggleFormat, insertObject, insert, applyFormat} from "@wordpress/rich-text";
const {RichTextToolbarButton} = wp.blockEditor;
const { createElement, useState, Fragment } = wp.element;
const { BlockControls, RichText } = wp.blockEditor;
const { ToolbarButton, Modal, Button, Flex, FlexItem } = wp.components;
import Icon from "./Icon.js";
// Format registrieren
import parser from 'html-react-parser';
registerFormatType("custom/icon", {
    title: "Insert Icon",
    tagName: "i", // HTML-Tag für das Icon
    className: "custom-icon", // CSS-Klasse für das Icon
    edit({isActive, value, onChange}) {
        const [isOpen, setIsOpen] = useState(false);
        const [themeIcon, setIcons] = useState([]);
        const [loadedIcons, setLoadedIcons] = useState('bootstrap');



        const insertIcon = (iconClass) => {
            const newFormat = toggleFormat(value, {
                type: "custom/icon",
                attributes: {
                    class: iconClass,
                },
            });
            onChange({ ...newFormat });
            setIsOpen(false);
        };


        const insertIcond = (iconClass) => {

            const updatedContent = applyFormat(value, {
                type: "custom/icon",
                attributes: {
                    class: iconClass,
                },
            });

            // Aktualisiere den Block-Inhalt
            onChange({ ...updatedContent });

            // Modal schließen
            setIsOpen(false);

        };

        const handleModalClose = () => {
            // Optional: Erzwinge eine Aktualisierung des Inhalts nach Modal-Schließung
            console.log(value)
            onChange({ ...value });
            setIsOpen(false);
        };


        const getThemeIcons = (type) => {
            let formData = {
                'method': 'get_theme_icons',
                'handle': type
            }
            wp.apiFetch({
                path: hummeltRestEditorObj.gutenberg_rest_path + 'settings',
                method: 'POST',
                data: formData,
            }).then((data) => {
                if (data.status) {
                    setIcons(data.icons);
                    setIsOpen(true);
                    setLoadedIcons(data.handle)
                }
            })
                .catch((error) => {
                    console.error('Fehler beim Laden der Optionen:', error);
                });
        }

        return (
            <Fragment>
            <RichTextToolbarButton
                icon={Icon}
                title="Insert Icon"
                onClick={() => {getThemeIcons('bootstrap')}} // Modal öffnen

                isActive={isActive}
            />
                {isOpen && (
                    <Modal
                        title="Theme Icons"
                        className="xxl-modal"
                        onRequestClose={handleModalClose} // Modal schließen
                    >

                        <div className="paragraph-icons-modal">
                            <Flex
                                gap={2}
                                align="center"
                                justify="center"
                                className="icons-modal-button-group"
                            >
                                <FlexItem>
                                    <Button
                                        {...(loadedIcons === 'bootstrap' ? { isPrimary: true } : { isSecondary: true })}
                                        className={`${loadedIcons === 'bootstrap' ? 'pe-none' : ''}`}
                                        onClick={() => getThemeIcons('bootstrap')}
                                    >
                                        Bootstrap-Icons
                                    </Button>
                                </FlexItem>
                                {hummeltRestEditorObj.rest_settings.material_icons_active ?
                                <FlexItem>
                                    <Button
                                        {...(loadedIcons === 'material' ? { isPrimary: true } : { isSecondary: true })}
                                        className={`${loadedIcons === 'material' ? 'pe-none' : ''}`}
                                        onClick={() => getThemeIcons('material')}
                                    >
                                        Material-Design
                                    </Button>
                                </FlexItem> : ''}
                                {hummeltRestEditorObj.rest_settings.fa_icons_active ?
                                <FlexItem>
                                    <Button
                                        {...(loadedIcons === 'fa47' ? { isPrimary: true } : { isSecondary: true })}
                                        className={`${loadedIcons === 'fa47' ? 'pe-none' : ''}`}
                                        onClick={() => getThemeIcons('fa47')}
                                    >
                                        Font Awesome
                                    </Button>
                                </FlexItem> : ''}
                            </Flex>

                            {themeIcon.length ?
                                <Fragment>
                                    <div className="icon-wrapper">
                                        {themeIcon.map((icon, i) => {
                                            return (
                                                <div
                                                    onClick={() => insertIcon(icon.icon)}
                                                    title={icon.title} className="info-icon-item" key={i}>
                                                    <i className={icon.icon}></i>
                                                    <small className="sm-icon">{icon.icon}</small>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </Fragment> : 'keine Icons vorhanden'}

                        </div>
                    </Modal>
                )}

            </Fragment>
        )


    },
});
