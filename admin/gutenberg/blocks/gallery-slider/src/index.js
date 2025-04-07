// Import necessary dependencies
import './editor.scss';
import {Fragment} from "react";
import {BlockControls} from "@wordpress/block-editor";
import {ToolbarButton, ToolbarGroup} from "@wordpress/components";

const {registerBlockType} = wp.blocks;
const {InspectorControls, MediaPlaceholder, MediaUpload} = wp.blockEditor;
const {PanelBody, ToggleControl, SelectControl, RadioControl, RangeControl, TextControl, Button, Modal} = wp.components;
const {__} = wp.i18n;
const {useEffect, useState} = wp.element;


registerBlockType('hupa/gallery-slideshow-block', {
    title: 'Galerie Slider',
    icon: 'images-alt2',
    category: 'theme-v3-medien',
    description: "Slider von splideJs mit vielen Optionen.",
    attributes: {
        images: {
            type: 'array',
            default: [],
        },
        mediumImages: {
            type: 'array',
            default: [],
        },
        selectedSlider: {
            type: 'string',
            default: '',
        },
        sliderId: {
            type: 'string',
            default: '',
        },
        sliderHeight: {
            type: 'number',
            default: 200,
        },
        thumbHeight: {
            type: 'number',
            default: 150,
        },
        thumbFocus: {
            type: 'text',
            default: 'center',
        },
        objectPosition: {
            type: 'string',
            default: 'center',
        },
        objectFit: {
            type: 'string',
            default: 'cover',
        },
        imageSize: {
            type: 'string',
            default: 'large',
        },
        thumbSize: {
            type: 'string',
            default: 'medium',
        },
        showFocus: {
            type: 'boolean',
            default: false,
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
        openNewTab: {
            type: 'boolean',
            default: false,
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
        layout: {
            type: 'string',
            default: 'slideshow',
        },
    },


    edit({attributes, setAttributes}) {
        const {
            images,
            lightboxSingle,
            clickAction,
            mediumImages,
            ausgabeOption,
            enableTitle,
            thumbSize,
            imageSize,
            layout,
            sliderHeight,
            objectPosition,
            objectFit,
            thumbHeight,
            thumbFocus,
            sliderId,
            showFocus
        } = attributes;

        if (!sliderId) {
            const uniqueId = `${Math.random().toString(36).slice(2, 9)}`;
            setAttributes({sliderId: uniqueId});
        }

        const [options, setOptions] = useState([]);
        const [selectedOption, setSelectedOption] = useState(attributes.selectedSlider);

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
            setAttributes({
                mediumImages: newImages.map((image) => ({
                    id: image.id,
                    url: image?.sizes?.[thumbSize]?.url || image?.url || '',
                    alt: image.alt,
                    title: image.caption || ''
                })),
            });
        };

        const [imageUrl, setImageUrl] = useState('');
        const [openTab, setNewTab] = useState();
        const [editId, setEditId] = useState();
        const onGetOptionImage = (findId) => {
            const findImages = images.find(({id}) => id === findId);

            setImageUrl(findImages.link)
            setNewTab(findImages.tab)
            setEditId(findImages.id)
            setIsModalOpen(true)
        }

        const onSaveEditOption = () => {

            const updatedImages = images.map((image) => {
                if (image.id === editId) {
                    return {
                        ...image, // Erstelle eine Kopie des aktuellen Bild-Objekts
                        link: imageUrl,
                        tab: openTab,
                    };
                }
                return image; // Alle anderen Bilder unverändert zurückgeben
            });

            setAttributes({images: updatedImages}); // State mit der aktualisierten Kopie setzen
            setIsModalOpen(false);
        };

        const [isModalOpen, setIsModalOpen] = useState(false);


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
            let formData = {
                'method': 'get_theme_slider'
            }
            wp.apiFetch({
                path: hummeltRestEditorObj.gutenberg_rest_path + 'settings',
                method: 'POST',
                data: formData,
            }).then((data) => {
                if (data.status) {
                    setOptions(data.slider);
                }
            })
                .catch((error) => {
                    console.error('Fehler beim Laden der Optionen:', error);
                });
        }, []);

        const removeImage = (index) => {
            const newImages = images.filter((_, i) => i !== index);
            const smallImages = mediumImages.filter((_, i) => i !== index);
            setAttributes({images: newImages});
            setAttributes({mediumImages: smallImages});
        };


        return (
            <>
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
                <div className="slideshow-editor">
                    <InspectorControls>
                        <PanelBody title={__('Slider Settings', 'text-domain')}>
                            <SelectControl
                                label="Slider auswählen"
                                __nextHasNoMarginBottom={true}
                                value={selectedOption}
                                options={options}
                                onChange={(value) => {
                                    setSelectedOption(value);
                                    setAttributes({selectedSlider: value});
                                }}
                            />
                            <SelectControl
                                label={__('Image Size', 'text-domain')}
                                __nextHasNoMarginBottom={true}
                                value={imageSize}
                                options={[{
                                    label: __('Thumbnail', 'text-domain'),
                                    value: 'thumbnail',
                                }, {
                                    label: __('Medium', 'text-domain'),
                                    value: 'medium',
                                }, {
                                    label: __('Large', 'text-domain'),
                                    value: 'large',
                                }, {
                                    label: __('Full', 'text-domain'),
                                    value: 'full',
                                }]}
                                onChange={(size) => setAttributes({imageSize: size})}
                            />

                            <SelectControl
                                label={__('Object Fit', 'text-domain')}
                                __nextHasNoMarginBottom={true}
                                value={objectFit}
                                options={[{
                                    label: __('cover', 'text-domain'),
                                    value: 'cover',
                                }, {
                                    label: __('contain', 'text-domain'),
                                    value: 'contain',
                                }, {
                                    label: __('none', 'text-domain'),
                                    value: 'none',
                                }, {
                                    label: __('inherit', 'text-domain'),
                                    value: 'inherit',
                                }]}
                                onChange={(fit) => setAttributes({objectFit: fit})}
                            />

                            <TextControl
                                label='Object-Position'
                                value={objectPosition}
                                __nextHasNoMarginBottom={true}
                                type='text'
                                onChange={e => setAttributes({objectPosition: e})}
                            />
                            <hr/>
                            <ToggleControl
                                label={__('Focus aktiv', 'text-domain')}
                                __nextHasNoMarginBottom={true}
                                checked={showFocus}
                                onChange={() => setAttributes({showFocus: !showFocus})}
                            />
                            <TextControl
                                label='Focus'
                                disabled={!showFocus}
                                value={thumbFocus}
                                __nextHasNoMarginBottom={true}
                                type='text'
                                onChange={e => setAttributes({thumbFocus: e})}
                                help={`mögliche Werte: 0-9 | center | false`}
                            />

                            <hr/>
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
                            <hr/>

                            <RangeControl
                                label="Feste Höhe (px)"
                                value={sliderHeight}
                                __nextHasNoMarginBottom={true}
                                onChange={(value) => setAttributes({sliderHeight: value})}
                                min={0}
                                max={1000}
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

                            {/*} <ToggleControl
                            label={__('Enable Lightbox', 'text-domain')}
                            __nextHasNoMarginBottom={true}
                            checked={enableLightbox}
                            onChange={() => setAttributes({enableLightbox: !enableLightbox})}
                        /> {*/}
                            <div className={clickAction === 'lightbox' ? '' : 'd-none'}>
                                <ToggleControl
                                    label={__('Lightbox single', 'text-domain')}
                                    __nextHasNoMarginBottom={true}
                                    checked={lightboxSingle}
                                    onChange={() => setAttributes({lightboxSingle: !lightboxSingle})}
                                /></div>
                            <div style={{margin: '.5rem 0'}}></div>
                            <RadioControl
                                label={__('Layout', 'text-domain')}
                                selected={layout}
                                __nextHasNoMarginBottom={true}
                                options={[{
                                    label: __('Slideshow', 'text-domain'),
                                    value: 'slideshow',
                                }, {
                                    label: __('Gallery with Thumbnails', 'text-domain'),
                                    value: 'gallery',
                                }]}
                                onChange={(newLayout) => setAttributes({layout: newLayout})}
                            />

                            <div className={`${layout === 'slideshow' ? 'd-none' : ''}`}>
                                <SelectControl
                                    label={__('Thumbnail Size', 'text-domain')}
                                    __nextHasNoMarginBottom={true}
                                    value={thumbSize}
                                    options={[{
                                        label: __('Thumbnail', 'text-domain'),
                                        value: 'thumbnail',
                                    }, {
                                        label: __('Medium', 'text-domain'),
                                        value: 'medium',
                                    }, {
                                        label: __('Large', 'text-domain'),
                                        value: 'medium_large',
                                    }, {
                                        label: __('Full', 'text-domain'),
                                        value: 'full',
                                    }]}
                                    onChange={(size) => setAttributes({thumbSize: size})}
                                />
                                <RangeControl
                                    label="Thumbnail Höhe (Px)"
                                    value={thumbHeight}
                                    __nextHasNoMarginBottom={true}
                                    onChange={(value) => setAttributes({thumbHeight: value})}
                                    min={0}
                                    max={1000}
                                />

                            </div>
                        </PanelBody>
                    </InspectorControls>

                    {images.length > 0 ? (
                        <Fragment>
                            <ul className="sortable-list list-unstyled row g-3">
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
                                            style={{height: '150px', objectFit: 'cover'}}
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

                        </Fragment>
                    ) : (
                        <MediaPlaceholder
                            onSelect={onSelectImages}
                            allowedTypes={['image']}
                            multiple
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
                                    value={imageUrl}
                                    __nextHasNoMarginBottom={true}
                                    type='text'
                                    onChange={e => setImageUrl(e)}
                                />
                                <div style={{margin: '.5rem 0'}}></div>
                                <ToggleControl
                                    disabled={!imageUrl}
                                    label={__('in neuem Tab öffnen', 'text-domain')}
                                    __nextHasNoMarginBottom={true}
                                    checked={openTab || false}
                                    onChange={(value) => setNewTab(value)}
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
            </>
        );
    },

    save({attributes}) {
        const {
            images,
            mediumImages,
            clickAction,
            lightboxSingle,
            imageSize,
            ausgabeOption,
            enableTitle,
            layout,
            objectPosition,
            selectedSlider,
            sliderHeight,
            objectFit,
            thumbHeight,
            sliderId,
            thumbFocus,
            showFocus
        } = attributes;
        if (!selectedSlider || !images.length) {
            return (<></>);
        }
        if (layout === 'gallery') {
            return (
                <div data-focus-active={showFocus} data-lightbox-single={lightboxSingle} data-focus={thumbFocus}
                     data-slider={selectedSlider} className="thumbnail-slider">
                    <section id={`main-carousel-${sliderId}`}
                             className={`splide carousel-splide ${clickAction === 'lightbox' ? 'with-lightbox' : ''}`}
                             aria-label="Gallery">
                        <div className="splide__track">
                            <div style={{height: sliderHeight ? sliderHeight + 'px' : '100%'}} className="splide__list">
                                {images.map((image) => (
                                    <a target={image.tab ? '_blank' : '_self'}
                                       href={clickAction === 'lightbox' ? image.url : image.link !== '' ? image.link : ''}
                                       className={`splide__slide ${clickAction === 'lightbox' || clickAction === 'individuell' && image.link !== '' ? 'cursor-pointer' : 'pe-none'}`}
                                       key={image.id}
                                    >
                                        <img style={{
                                            objectPosition: objectPosition,
                                            objectFit: objectFit,
                                            height: sliderHeight ? sliderHeight + 'px' : '100%'
                                        }}
                                             data-splide-lazy={image.url}
                                             alt={image.alt}
                                             className={`size-${imageSize}`}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id={`main-carousel-thumbnails-${sliderId}`}
                             className={`thumbnails mt-2 splide`}
                             aria-label="Thumbnails">
                        <div className="splide__track">
                            <ul id={`thumbnails-${sliderId}`}
                                className={`splide__list`}>
                                {mediumImages.map((image) => (
                                    <li style={{height: '100%', maxHeight: thumbHeight + 'px'}}
                                        className="thumbnail thumbnail-splide splide__slide" key={image.id}>
                                        <img style={{
                                            objectPosition: objectPosition,
                                            objectFit: objectFit,
                                            height: thumbHeight + 'px'
                                        }}
                                             data-splide-lazy={image.url} alt={image.alt}/>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>
            );
        }

        return (
            <div data-focus-active={showFocus} data-lightbox-single={lightboxSingle} data-focus={thumbFocus}
                 data-slider={selectedSlider} className="theme-slider">
                <div id={`slider-${sliderId}`}
                     className={`slideshow splide ${clickAction === 'lightbox' ? 'with-lightbox' : ''}`}>
                    <div className="splide__track">
                        <div className={`splide__list ${images.length < 3 ? 'justify-content-center' : ''}`}>
                            {images.map((image) => (
                                <a target={image.tab ? '_blank' : '_self'}
                                   href={clickAction === 'lightbox' ? image.url : image.link !== '' ? image.link : ''}
                                   title={enableTitle ? image.title : ''}
                                   style={{height: '100%', maxHeight: sliderHeight ? sliderHeight + 'px' : '100%'}}
                                   className={`splide__slide ${clickAction === 'lightbox' || clickAction === 'individuell' && image.link !== '' ? 'cursor-pointer' : 'pe-none'}`}
                                   key={image.id}>
                                    <div className="slide-wrapper">
                                        <div className="slide-inner">
                                            <img style={{
                                                height: sliderHeight ? sliderHeight + 'px' : '100%',
                                                width: '100%',
                                                maxHeight: '100%',
                                                objectPosition: objectPosition,
                                                objectFit: objectFit
                                            }}
                                                 data-splide-lazy={image.url}
                                                 alt={image.alt}
                                                 className={`size-${imageSize}`}
                                            />
                                        </div>
                                        {ausgabeOption === 'caption' ?
                                            <div className="gallery-slider-item-caption pe-none text-reset text-decoration-none"> {image.title}</div>
                                            : ''}
                                    </div>
                                </a>

                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});
