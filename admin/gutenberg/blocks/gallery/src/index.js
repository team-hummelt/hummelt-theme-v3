import './editor.scss';

import {select} from '@wordpress/data';
import {ToolbarButton, ToolbarDropdownMenu} from "@wordpress/components";
import {MediaUploadCheck} from "@wordpress/block-editor/build/components/index.js";

const DEFAULT_BREAKPOINTS = {
    xxl: {columns: 6, gutter: 1},
    xl: {columns: 5, gutter: 1},
    lg: {columns: 4, gutter: 1},
    md: {columns: 3, gutter: 1},
    sm: {columns: 2, gutter: 1},
    xs: {columns: 2, gutter: 1},
};
const {registerBlockType} = wp.blocks;
const {InspectorControls, MediaPlaceholder, MediaReplaceFlow ,BlockControls , MediaUpload} = wp.blockEditor;
const {
    PanelBody,
    ToggleControl,
    SelectControl,
    RadioControl,
    RangeControl,
    TextControl,
    Button,
    Modal,
    Flex,
    FlexItem,
    ToolbarGroup,
    DropdownMenu,
    ResponsiveWrapper,

} = wp.components;
const {__} = wp.i18n;
const {useEffect, useState, Fragment, useRef} = wp.element;

registerBlockType('hupa/theme-gallery', {
    title: 'Theme Galerie',
    icon: 'images-alt2',
    category: 'theme-v3-medien',
    description: "Ein benutzerdefinierte Galerie mit Grid und Masonry-Grid.",
    attributes: {
        images: {
            type: 'array',
            default: [],
        },
        imageSize: {
            type: 'string',
            default: 'large',
        },
        imageWidth: {
            type: 'number',
            default: 260,
        },
        imageHeight: {
            type: 'number',
            default: 160,
        },
        galleryType: {
            type: 'string',
            default: 'gallery',
        },
        imageCrop: {
            type: 'boolean',
            default: true,
        },
        lazyLoad: {
            type: 'boolean',
            default: true,
        },
        lazyLoadAnimation: {
            type: 'boolean',
            default: false,
        },
        repeatAnimation: {
            type: 'boolean',
            default: false,
        },
        animationType: {
            type: 'string',
            default: '',
        },
        galleryId: {
            type: 'string',
            default: '',
        },
        enableLightbox: {
            type: 'boolean',
            default: false,
        },
        ausgabeOption: {
            type: 'string',
            default: '',
        },
        enableTitle: {
            type: 'boolean',
            default: true,
        },
        clickAction: {
            type: 'string',
            default: '',
        },
        imgLink: {
            type: 'string',
            default: '',
        },
        lightboxSingle: {
            type: 'boolean',
            default: false,
        },
        breakpoints: {
            type: 'object',
            default: {
                xxl: {columns: 6, gutter: 1},
                xl: {columns: 5, gutter: 1},
                lg: {columns: 4, gutter: 1},
                md: {columns: 3, gutter: 1},
                sm: {columns: 2, gutter: 1},
                xs: {columns: 2, gutter: 1},
            },
        }
    },

    edit({attributes, setAttributes}) {
        const {
            images,
            galleryId,
            galleryType,
            repeatAnimation,
            imageSize,
            imageCrop,
            lazyLoad,
            imageWidth,
            ausgabeOption,
            enableTitle,
            imageHeight,
            lazyLoadAnimation,
            lightboxSingle,
            animationType,
            clickAction,
            breakpoints,

        } = attributes;

        if (!galleryId) {
            const uniqueId = `gallery-${Math.random().toString(36).slice(2, 9)}`;
            setAttributes({galleryId: uniqueId});
        }

        const [isModalOpen, setIsModalOpen] = useState(false);

        const onSelectImages = (newImages) => {

            setAttributes({
                images: newImages.map((image) => ({
                    id: image.id,
                    link: '',
                    tab: false,
                    url: image?.sizes?.[imageSize]?.url || image?.url || '',
                    alt: image.alt,
                    title: image.caption || ''
                })),
            });
        };


        const onSetBreakpoints = (e, type, breakpoint) => {
            const updBreakpoints = {...attributes.breakpoints}; // Kopie des Breakpoints-Objekts
            updBreakpoints[breakpoint] = {
                ...updBreakpoints[breakpoint], // Kopie des spezifischen Breakpoints
                [type]: parseInt(e), // Aktualisiere den Wert
            };
            setAttributes({breakpoints: updBreakpoints}); // Setze das neue Objekt
        };

        const removeImage = (index) => {
            const newImages = images.filter((_, i) => i !== index);
            setAttributes({images: newImages});
        };

        /*useEffect(() => {
            if (images.length > 0) {
                const sortableElement = document.querySelector('.sortable-list');
                if (sortableElement) {
                    jQuery(sortableElement).sortable({
                        update: (event, ui) => {
                            const sortedIDs = jQuery(sortableElement)
                                .sortable('toArray', {attribute: 'data-id'})
                                .map((id) => parseInt(id, 10));

                            const reorderedImages = sortedIDs.map((id) =>
                                images.find((image) => image.id === id)
                            );
                            setAttributes({images: reorderedImages});
                        },
                    });
                }
            }
        }, [images]);*/
        useEffect(() => {
            if (images.length > 0) {
                document.querySelectorAll('.sortable-list').forEach((sortableElement) => {
                    jQuery(sortableElement).sortable({
                        update: (event, ui) => {
                            const sortedIDs = jQuery(sortableElement)
                                .sortable('toArray', {attribute: 'data-id'})
                                .map((id) => parseInt(id, 10));

                            const reorderedImages = sortedIDs.map((id) =>
                                images.find((image) => image.id === id)
                            );
                            setAttributes({images: reorderedImages});
                        },
                    });
                });
            }
        }, [images]);

        useEffect(() => {
            if (!breakpoints || Object.keys(breakpoints).length === 0) {
                setAttributes({breakpoints: DEFAULT_BREAKPOINTS});
            }
        }, [breakpoints, setAttributes]); // Trigger, wenn `breakpoints` oder `setAttributes` sich ändern


        const [editImage, setEditImage] = useState({
            imageUrl: '',
            openTab: false,
            editId: null,
        });

        const onGetOptionImage = (findId) => {
            const findImages = images.find(({id}) => id === findId);
            if (findImages) {
                setEditImage({
                    imageUrl: findImages.link || '',
                    openTab: findImages.tab,
                    editId: findImages.id,
                });
                setIsModalOpen(true);
            }
        };

        const onChangeOption = (e, type) => {
            const updImages = {...editImage};
            updImages[type] = e;
            setEditImage(updImages)
        }

        const onSaveEditOption = () => {
            const updatedImages = images.map((image) => {
                if (image.id === editImage.editId) {
                    return {
                        ...image, // Erstelle eine Kopie des aktuellen Bild-Objekts
                        link: editImage.imageUrl,
                        tab: editImage.openTab,
                    };
                }
                return image; // Alle anderen Bilder unverändert zurückgeben
            });

            setAttributes({images: updatedImages}); // State mit der aktualisierten Kopie setzen
            setIsModalOpen(false);
        }

        const openGalleryFrame = async () => {
            const attachments = await Promise.all(
                images.map((img) => {
                    const attachment = wp.media.attachment(img.id);
                    return attachment.fetch().then(() => attachment);
                })
            );

            const frame = wp.media({
                title: 'Galerie bearbeiten',
                frame: 'post',
                state: 'gallery-edit',
                library: wp.media.query({ type: 'image' }),
                multiple: true,
                button: {
                    text: 'Zur Galerie übernehmen',
                },
                editing: true,
                selection: new wp.media.model.Selection([]), // muss initial gesetzt sein
            });

            // Wichtig: Auswahl nach dem Öffnen setzen
            frame.on('open', () => {
                const state = frame.state('gallery-edit');

                // Nur wenn State korrekt geladen ist
                if (state && state.get('selection')) {
                    state.get('selection').reset(attachments); // <- entscheidend
                }
            });

            frame.on('update', (selection) => {
                const selectedImages = selection.models.map((attachment) => {
                    const image = attachment.toJSON();
                    return {
                        id: image.id,
                        link: '',
                        tab: false,
                        url: image?.sizes?.large?.url || image.url,
                        alt: image.alt || '',
                        title: image.caption || '',
                    };
                });

                setAttributes({ images: selectedImages });
            });

            frame.open();
        };

        const GalleryReplaceMenu = ({ images, setAttributes, imageSize }) => {
            return (
                <BlockControls>
                    <ToolbarGroup>
                        <MediaUploadCheck>
                            <MediaUpload
                                allowedTypes={['image']}
                                multiple
                                gallery
                                value={images.map((img) => img.id)}
                                onSelect={(newImages) => {
                                    const updatedImages = newImages.map((image) => ({
                                        id: image.id,
                                        link: '',
                                        tab: false,
                                        url: image?.sizes?.[imageSize]?.url || image.url,
                                        alt: image.alt || '',
                                        title: image.caption || '',
                                    }));
                                    setAttributes({ images: updatedImages });
                                }}
                                render={({ open }) => (
                                    <ToolbarDropdownMenu
                                        icon="update"
                                        label={__('Ersetzen', 'text-domain')}
                                        controls={[
                                            {
                                                title: __('Mediathek öffnen', 'text-domain'),
                                                icon: 'format-gallery',
                                                onClick: open,
                                            },
                                            {
                                                title: __('Hochladen', 'text-domain'),
                                                icon: 'upload',
                                                onClick: open,
                                            },
                                            {
                                                title: __('Zurücksetzen', 'text-domain'),
                                                icon: 'image-rotate',
                                                onClick: () => setAttributes({ images: [] }),
                                            },
                                        ]}
                                    />
                                )}
                            />
                        </MediaUploadCheck>
                    </ToolbarGroup>
                </BlockControls>
            );
        };



        return (
            <Fragment>
                <BlockControls>
                    <ToolbarGroup>
                        <MediaUpload
                            onSelect={(newImages) => {
                                const updatedImages = newImages.map((image) => ({
                                    id: image.id,
                                    link: '',
                                    tab: false,
                                    url: image?.sizes?.[imageSize]?.url || image.url,
                                    alt: image.alt || '',
                                    title: image.caption || '',
                                }));
                                setAttributes({ images: updatedImages });
                            }}
                            allowedTypes={['image']}
                            multiple
                            gallery
                            value={images.map((img) => img.id)}
                            render={({ open }) => (
                                <ToolbarButton
                                    icon="images-alt2"
                                    text="Galerie bearbeiten"
                                    label="Galerie bearbeiten"
                                    onClick={open}
                                />
                            )}
                        />
                    </ToolbarGroup>
                </BlockControls>
                <InspectorControls>
                    <div className="gallery-sidebar">
                        <PanelBody title={__('Galerie Settings', 'text-domain')}>
                            <SelectControl
                                label="Galerie Typ"
                                __nextHasNoMarginBottom={true}
                                value={galleryType}
                                options={[
                                    {label: 'Galerie Grid', value: 'gallery'},
                                    {label: 'Masonry Grid', value: 'masonry'},
                                ]}
                                onChange={(e) => setAttributes({galleryType: e})}
                            />
                            <SelectControl
                                label="Image Size"
                                __nextHasNoMarginBottom={true}
                                value={imageSize}
                                options={[
                                    {label: 'Thumbnail', value: 'thumbnail'},
                                    {label: 'Medium', value: 'medium'},
                                    {label: 'Large', value: 'large'},
                                    {label: 'Full', value: 'full'},
                                ]}
                                onChange={(e) => setAttributes({imageSize: e})}
                            />
                            <ToggleControl
                                label="Image Crop"
                                //disabled={galleryType === 'gallery'}
                                __nextHasNoMarginBottom={true}
                                checked={imageCrop}
                                onChange={(value) => setAttributes({imageCrop: value})}
                            />
                            {/*} <ToggleControl
                                label="Lazy load"
                                __nextHasNoMarginBottom={true}
                                disabled={true}
                                checked={lazyLoad}
                                onChange={(value) => setAttributes({lazyLoad: value})}
                            /> {*/}
                            <ToggleControl
                                label="Lazy load animation"
                                __nextHasNoMarginBottom={true}
                                checked={lazyLoadAnimation}
                                onChange={(value) => setAttributes({lazyLoadAnimation: value})}
                            />
                            <ToggleControl
                                label="Animation wiederholen"
                                __nextHasNoMarginBottom={true}
                                disabled={!lazyLoadAnimation}
                                checked={repeatAnimation}
                                onChange={(value) => setAttributes({repeatAnimation: value})}
                            />


                            <RadioControl
                                label={__('Ausgabe Option', 'text-domain')}
                                selected={ausgabeOption}
                                __nextHasNoMarginBottom={true}
                                options={[{
                                    label: __('keine Aktion', 'text-domain'),
                                    value: '',
                                }, {
                                    label: __('Caption anzeigen', 'text-domain'),
                                    value: 'caption',
                                }
                                ]}
                                onChange={(action) => setAttributes({ausgabeOption: action})}
                            />

                            <ToggleControl
                                label="Titel anzeigen"
                                //disabled={galleryType === 'gallery'}
                                __nextHasNoMarginBottom={true}
                                checked={enableTitle}
                                onChange={(value) => setAttributes({enableTitle: value})}
                            />

                            {/*}  <RangeControl
                                label="Image Width (px)"
                                __nextHasNoMarginBottom={true}
                               // disabled={galleryType === 'masonry'}
                                value={imageWidth}
                                onChange={(value) => setAttributes({imageWidth: value})}
                                min={50}
                                max={500}
                                step={10}
                            /> {*/}
                            <RangeControl
                                label="Image Height (px)"
                                __nextHasNoMarginBottom={true}
                                value={imageHeight}
                                disabled={!imageCrop && galleryType !== 'gallery'}
                                onChange={(value) => setAttributes({imageHeight: value})}
                                min={50}
                                max={500}
                                step={10}
                            />
                            <p className={`fw-normal panel-headline animate__animated animate__${animationType}`}>
                                {__('Animate options', 'bootscore')}
                            </p>
                            <SelectControl
                                label={__('Select animation', 'bootscore')}
                                value={animationType}
                                disabled={!lazyLoadAnimation}
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
                                    {label: '---- BackIn', value: '', className: 'SelectSeparator', disabled: true},
                                    {label: 'backInDown', value: 'backInDown'},
                                    {label: 'backInLeft', value: 'backInLeft'},
                                    {label: 'backInRight', value: 'backInRight'},
                                    {label: 'backInUp', value: 'backInUp'},
                                    {label: '---- Bounce', value: '', className: 'SelectSeparator', disabled: true},
                                    {label: 'bounceIn', value: 'bounceIn'},
                                    {label: 'bounceInDown', value: 'bounceInDown'},
                                    {label: 'bounceInLeft', value: 'bounceInLeft'},
                                    {label: 'bounceInRight', value: 'bounceInRight'},
                                    {label: 'bounceInUp', value: 'bounceInUp'},
                                    {label: '---- Fade', value: '', className: 'SelectSeparator', disabled: true},
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
                                    {label: '---- Flip', value: '', className: 'SelectSeparator', disabled: true},
                                    {label: 'flip', value: 'flip'},
                                    {label: 'flipInX', value: 'flipInX'},
                                    {label: 'flipInY', value: 'flipInY'},
                                    {label: 'flipOutX', value: 'flipOutX'},
                                    {label: 'flipOutY', value: 'flipOutY'},
                                    {
                                        label: '---- Light Speed',
                                        value: '',
                                        className: 'SelectSeparator',
                                        disabled: true
                                    },
                                    {label: 'lightSpeedInRight', value: 'lightSpeedInRight'},
                                    {label: 'lightSpeedInLeft', value: 'lightSpeedInLeft'},
                                    {label: 'lightSpeedOutRight', value: 'lightSpeedOutRight'},
                                    {label: 'lightSpeedOutLeft', value: 'lightSpeedOutLeft'},
                                    {label: '---- Rotate', value: '', className: 'SelectSeparator', disabled: true},
                                    {label: 'rotateIn', value: 'rotateIn'},
                                    {label: 'rotateInDownLeft', value: 'rotateInDownLeft'},
                                    {label: 'rotateInDownRight', value: 'rotateInDownRight'},
                                    {label: 'rotateInUpLeft', value: 'rotateInUpLeft'},
                                    {label: 'rotateInUpRight', value: 'rotateInUpRight'},
                                    {label: '---- Zoom', value: '', className: 'SelectSeparator', disabled: true},
                                    {label: 'zoomIn', value: 'zoomIn'},
                                    {label: 'zoomInDown', value: 'zoomInDown'},
                                    {label: 'zoomInLeft', value: 'zoomInLeft'},
                                    {label: 'zoomInRight', value: 'zoomInRight'},
                                    {label: 'zoomInUp', value: 'zoomInUp'},
                                    {label: '---- Slide', value: '', className: 'SelectSeparator', disabled: true},
                                    {label: 'slideInDown', value: 'slideInDown'},
                                    {label: 'slideInLeft', value: 'slideInLeft'},
                                    {label: 'slideInRight', value: 'slideInRight'},
                                    {label: 'slideInUp', value: 'slideInUp'}
                                ]}
                                onChange={(e) => setAttributes({animationType: e})}
                            />

                            <RadioControl
                                label={__('Aktion beim klicken', 'text-domain')}
                                selected={clickAction}
                                __nextHasNoMarginBottom={true}
                                options={[{
                                    label: __('keine Aktion', 'text-domain'),
                                    value: '',
                                }, {
                                    label: __('Lightbox', 'text-domain'),
                                    value: 'lightbox',
                                }, {
                                    label: __('Individuell', 'text-domain'),
                                    value: 'individuell',
                                }
                                ]}
                                onChange={(action) => setAttributes({clickAction: action})}
                            />

                            <div className={clickAction === 'lightbox' ? '' : 'd-none'}>
                                <ToggleControl
                                    label={__('Lightbox single', 'text-domain')}
                                    __nextHasNoMarginBottom={true}
                                    checked={lightboxSingle}
                                    onChange={() => setAttributes({lightboxSingle: !lightboxSingle})}
                                /></div>
                        </PanelBody>
                        <PanelBody
                            initialOpen={false}
                            title={__('Breakpoints', 'text-domain')}>
                            <div className="breakpoint-headline">
                                Breakpoint XXL 1400px
                            </div>
                            <Flex
                                gap={2}
                                align="center"
                                justify="center"
                            >
                                <FlexItem>
                                    <TextControl
                                        label='Columns'
                                        value={breakpoints.xxl.columns}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={6}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'columns', 'xxl')}
                                    />
                                </FlexItem>
                                <FlexItem>
                                    <TextControl
                                        label='Gutter'
                                        value={breakpoints.xxl.gutter}
                                        __nextHasNoMarginBottom={true}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'gutter', 'xxl')}
                                    />
                                </FlexItem>
                            </Flex>
                            <div className="breakpoint-headline">
                                Breakpoint XL 1200px
                            </div>
                            <Flex
                                gap={2}
                                align="center"
                                justify="center"
                            >
                                <FlexItem>
                                    <TextControl
                                        label='Columns'
                                        value={breakpoints.xl.columns}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={6}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'columns', 'xl')}
                                    />
                                </FlexItem>
                                <FlexItem>
                                    <TextControl
                                        label='Gutter'
                                        value={breakpoints.xl.gutter}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={5}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'gutter', 'xl')}
                                    />
                                </FlexItem>
                            </Flex>
                            <div className="breakpoint-headline">
                                Breakpoint LG 992px
                            </div>
                            <Flex
                                gap={2}
                                align="center"
                                justify="center"
                            >
                                <FlexItem>
                                    <TextControl
                                        label='Columns'
                                        value={breakpoints.lg.columns}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={6}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'columns', 'lg')}
                                    />
                                </FlexItem>
                                <FlexItem>
                                    <TextControl
                                        label='Gutter'
                                        value={breakpoints.lg.gutter}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={5}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'gutter', 'lg')}
                                    />
                                </FlexItem>
                            </Flex>
                            <div className="breakpoint-headline">
                                Breakpoint MD 768px
                            </div>
                            <Flex
                                gap={2}
                                align="center"
                                justify="center"
                            >
                                <FlexItem>
                                    <TextControl
                                        label='Columns'
                                        value={breakpoints.md.columns}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={6}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'columns', 'md')}
                                    />
                                </FlexItem>
                                <FlexItem>
                                    <TextControl
                                        label='Gutter'
                                        value={breakpoints.md.gutter}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={5}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'gutter', 'md')}
                                    />
                                </FlexItem>
                            </Flex>
                            <div className="breakpoint-headline">
                                Breakpoint SM 576px
                            </div>
                            <Flex
                                gap={2}
                                align="center"
                                justify="center"
                            >
                                <FlexItem>
                                    <TextControl
                                        label='Columns'
                                        value={breakpoints.sm.columns}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={6}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'columns', 'sm')}
                                    />
                                </FlexItem>
                                <FlexItem>
                                    <TextControl
                                        label='Gutter'
                                        value={breakpoints.sm.gutter}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={5}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'gutter', 'sm')}
                                    />
                                </FlexItem>
                            </Flex>
                            <div className="breakpoint-headline">
                                Breakpoint XS 450px
                            </div>
                            <Flex
                                gap={2}
                                align="center"
                                justify="center"
                            >
                                <FlexItem>
                                    <TextControl
                                        label='Columns'
                                        value={breakpoints.xs.columns}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={6}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'columns', 'xs')}
                                    />
                                </FlexItem>
                                <FlexItem>
                                    <TextControl
                                        label='Gutter'
                                        value={breakpoints.xs.gutter}
                                        __nextHasNoMarginBottom={true}
                                        min={1}
                                        max={5}
                                        type='number'
                                        onChange={e => onSetBreakpoints(e, 'gutter', 'xs')}
                                    />
                                </FlexItem>
                            </Flex>

                        </PanelBody>
                    </div>
                </InspectorControls>

                <div className="gallery-editor">
                    <div style={{margin: '0 .5rem .5rem'}}>
                        Theme Galerie
                    </div>

                    {images.length > 0 ? (<Fragment>
                        <ul className="sortable-list list-unstyled row g-2">
                            {images.map((image, index) => (
                                <li
                                    key={image.id}
                                    className="sortable-item col-auto"
                                    data-id={image.id}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="img-fluid rounded border"
                                        style={{height: '150px', width: '205px', objectFit: 'cover'}}
                                    />
                                    <div>
                                        <button
                                            className="btn btn-link text-decoration-none text-danger btn-sm mt-1"
                                            onClick={() => removeImage(index)}
                                        >
                                            löschen
                                        </button>
                                        {clickAction === 'individuell' ?
                                            <button
                                                className="btn btn-link text-primary text-decoration-none btn-sm mt-1"
                                                onClick={() => onGetOptionImage(image.id)}
                                            >
                                                Optionen
                                            </button> : ''}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {/* Button zum Hinzufügen neuer Bilder */}
                    </Fragment>) : (
                        <GalleryReplaceMenu
                            images={images}
                            setAttributes={setAttributes}
                            imageSize={imageSize}
                        />
                    )}
                    {isModalOpen && (
                        <Modal
                            title="Bildoptionen"
                            onRequestClose={() => setIsModalOpen(false)}
                        >
                            <div>
                                <TextControl
                                    label='Link-Url'
                                    value={editImage.imageUrl}
                                    __nextHasNoMarginBottom={true}
                                    type='text'
                                    onChange={e => onChangeOption(e, 'imageUrl')}
                                />
                                <div style={{margin: '.5rem 0'}}></div>
                                <ToggleControl
                                    label={__('in neuem Tab öffnen', 'text-domain')}
                                    __nextHasNoMarginBottom={true}
                                    checked={editImage.openTab}
                                    onChange={e => onChangeOption(e, 'openTab')}
                                />
                            </div>

                            <Button
                                isPrimary
                                onClick={onSaveEditOption}
                                style={{marginTop: '18px'}}
                            >
                                Speichern
                            </Button>
                        </Modal>
                    )}
                </div>
            </Fragment>
        );
    },
    save({attributes}) {
        const {
            images,
            galleryId,
            galleryType,
            repeatAnimation,
            imageCrop,
            imageWidth,
            ausgabeOption,
            enableTitle,
            imageHeight,
            lazyLoadAnimation,
            lightboxSingle,
            animationType,
            clickAction,
            breakpoints,

        } = attributes;
        if (!images.length) {
            return (
                <div className="fw-semibold">
                    <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                    keine Galerie gefunden...
                </div>
            )
        }


        return (
            <div id={galleryId}
                 className={`theme-gallery-wrapper ${clickAction === 'lightbox' ? 'with-lightbox' : ''} ${galleryType === 'masonry' ? 'masonry-grid' : ''} ${lazyLoadAnimation ? 'gallery-animation' : ''}`}
                 data-animation-active={lazyLoadAnimation}
                 data-animation-type={animationType}
                 data-animation-repeat={repeatAnimation}
                 data-lightbox-single={lightboxSingle}
            >
                <div
                    className={`row theme-gallery row-cols-${breakpoints.xs.columns} g-${breakpoints.xs.gutter} row-cols-xxl-${breakpoints.xxl.columns} g-xxl-${breakpoints.xxl.gutter} row-cols-xl-${breakpoints.xl.columns} g-xl-${breakpoints.xl.gutter} row-cols-lg-${breakpoints.lg.columns} g-lg-${breakpoints.lg.gutter} row-cols-md-${breakpoints.md.columns} g-md-${breakpoints.md.gutter} row-cols-sm-${breakpoints.sm.columns} g-sm-${breakpoints.sm.gutter}`}>
                    {images.map((image, index) => {
                        return (
                            <div className={`col grid-item text-center `} key={index}>
                                <div className="d-inline-block image-wrapper w-100">
                                    <a title={enableTitle ? image.title : ''} target={image.tab ? '_blank' : '_self'}
                                       href={clickAction === 'lightbox' ? image.url : image.link !== '' ? image.link : ''}
                                       className={`${clickAction === 'lightbox' || clickAction === 'individuell' && image.link !== '' ? 'cursor-pointer' : 'pe-none'}`}>
                                        <img
                                            className={`img-fluid rounded lazy-image ${lazyLoadAnimation ? '' : 'no-animate'}`}
                                            style={{
                                                height: galleryType === 'masonry' && !imageCrop ? '100%' : imageHeight + 'px',
                                                maxHeight: '100%',
                                                //width:  imageWidth + 'px',
                                                width: '100%',
                                                objectFit: 'cover'
                                            }}
                                            data-src={image.url}
                                            alt={image.alt ? image.alt : image.title}
                                            title={ausgabeOption === 'caption' ? image.title : ''}
                                            loading={"lazy"}
                                        />
                                    </a>
                                    {ausgabeOption === 'caption' ?
                                        <div className="gallery-item-caption"> {image.title}</div>
                                        : ''}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    },
});
