import './editor.scss';
import './style.scss';
import {select} from '@wordpress/data';

const {registerBlockType} = wp.blocks;
const {useBlockProps, InspectorControls, MediaUpload, RichText, MediaUploadCheck} = wp.blockEditor;
const {PanelBody, ToggleControl, SelectControl, RangeControl, Button} = wp.components;
const {Fragment, useEffect} = wp.element;

registerBlockType('hupa/bootstrap-carousel-block', {
    title: 'Bootstrap Carousel',
    icon: 'images-alt2',
    category: 'media',
    attributes: {
        isLoaded: {type: 'boolean', default: false},
        postId: {type: 'number'},
        carouselId: {type: 'string'},
        images: {type: 'array', default: []},
        captions: {type: 'array', default: []},
        headings: {type: 'array', default: []},
        autoSlide: {type: 'boolean', default: true},
        interval: {type: 'number', default: 5000},
        height: {type: 'number', default: 500},
        imageSize: {type: 'string', default: 'full'},
        pauseOnHover: {type: 'string', default: 'hover'},
        touch: {type: 'boolean', default: true},
    },

    edit({attributes, setAttributes}) {
        const {
            carouselId,
            images,
            captions,
            headings,
            autoSlide,
            interval,
            height,
            imageSize,
            pauseOnHover,
            touch,
        } = attributes;

        if (!carouselId) {
            const uniqueId = `carousel-${Math.random().toString(36).slice(2, 9)}`;
            setAttributes({carouselId: uniqueId});
        }

        useEffect(() => {
            const validateAttributes = () => {
                const validImages = images.filter((image) => image && image.id && image.url);
                const validCaptions = captions.slice(0, validImages.length);
                const validHeadings = headings.slice(0, validImages.length);

                setAttributes({
                    images: validImages,
                    captions: validCaptions,
                    headings: validHeadings,
                });
            };

            validateAttributes();
        }, []);

        const addImage = (media) => {
            if (!media || !media.id || !media.url) {
                console.error('Ungültiges Bild:', media);
                return;
            }

            const newImage = {
                id: media.id,
                url: media.sizes?.[imageSize]?.url || media.url,
                alt: media.alt || '',
            };

            setAttributes({
                images: [...images, newImage],
                captions: [...captions, ''],
                headings: [...headings, ''],
            });
        };

        const removeImage = (index) => {
            const updatedImages = images.filter((_, i) => i !== index);
            const updatedCaptions = captions.filter((_, i) => i !== index);
            const updatedHeadings = headings.filter((_, i) => i !== index);

            setAttributes({
                images: updatedImages,
                captions: updatedCaptions,
                headings: updatedHeadings,
            });

            // Falls es noch Elemente gibt, setze das erste Element aktiv
            if (updatedImages.length > 0) {
                const carouselInner = document.querySelector(`.carousel-inner`);
                const carouselIndicators = document.querySelector(`.carousel-indicators`);

                if (carouselInner && carouselIndicators) {
                    const items = carouselInner.querySelectorAll('.carousel-item');
                    const indicators = carouselIndicators.querySelectorAll('button');

                    items.forEach((item, idx) => {
                        if (idx === 0) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    indicators.forEach((indicator, idx) => {
                        if (idx === 0) {
                            indicator.classList.add('active');
                        } else {
                            indicator.classList.remove('active');
                        }
                    });
                }
            }

           // console.log('Nach dem Entfernen:', updatedImages, updatedCaptions, updatedHeadings);
        };

        const updateHeading = (index, value) => {
            const updatedHeadings = [...headings];
            updatedHeadings[index] = value;
            setAttributes({headings: updatedHeadings});
        };

        const updateCaption = (index, value) => {
            const updatedCaptions = [...captions];
            updatedCaptions[index] = value;
            setAttributes({captions: updatedCaptions});
        };

        const updateImageSize = (size) => {

            images.map((img, i) => {
                if(img.id) {
                    wp.apiFetch({
                        path: `/wp/v2/media/${img.id}`,
                        method: 'GET',
                    }).then(data => {
                        if (data && data.media_details) {
                            let md = data.media_details
                            let url = data.source_url;
                            switch (size) {
                                case 'thumbnail':
                                    if (md.sizes && md.sizes.thumbnail) {
                                        url = md.sizes.thumbnail.source_url
                                    }
                                    break;
                                case 'medium':
                                    if (md.sizes && md.sizes.medium) {
                                        url = md.sizes.medium.source_url
                                    }
                                    break;
                                case 'large':
                                    if (md.sizes && md.sizes.medium_large) {
                                        url = md.sizes.medium_large.source_url
                                    }
                                    break;
                                case 'full':
                                    url = data.source_url;
                                    break;
                                default:
                                    url = data.source_url;
                            }
                            img.url = url;
                            let item = {
                                url: url,
                                alt: data.alt || '',
                                id: data.id
                            }
                            images[i]['url'] = url;
                        }

                    })
                }
            })
            setAttributes({
                images: images,
                imageSize: size
            })
        }

        const blockProps = useBlockProps({
            className: 'custom-border-editor',
            style: {height: `${height + 130}px`},
        });

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Carousel Settings" initialOpen={true}>
                        <ToggleControl
                            label="Auto Slide"
                            __nextHasNoMarginBottom={true}
                            checked={autoSlide}
                            onChange={(value) => setAttributes({autoSlide: value})}
                        />
                        <ToggleControl
                            label="Enable Touch Swipe"
                            __nextHasNoMarginBottom={true}
                            checked={touch}
                            onChange={(value) => setAttributes({touch: value})}
                        />
                        <RangeControl
                            label="Slide Interval (ms)"
                            __nextHasNoMarginBottom={true}
                            value={interval}
                            onChange={(value) => setAttributes({interval: value})}
                            min={1000}
                            max={30000}
                            step={500}
                        />
                        <RangeControl
                            label="Carousel Height (px)"
                            __nextHasNoMarginBottom={true}
                            value={height}
                            onChange={(value) => setAttributes({height: value})}
                            min={200}
                            max={1000}
                            step={50}
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
                            onChange={(newSize) => updateImageSize(newSize)}
                        />
                        <SelectControl
                            label="Pause on Hover"
                            __nextHasNoMarginBottom={true}
                            value={pauseOnHover}
                            options={[
                                {label: 'Hover (default)', value: 'hover'},
                                {label: 'No Pause', value: 'false'},
                            ]}
                            onChange={(value) => setAttributes({pauseOnHover: value})}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className={`carousel slide`}
                         id={carouselId}
                         data-bs-ride={autoSlide ? 'carousel' : ''}
                         data-bs-interval={interval}
                         data-bs-pause={pauseOnHover}
                         data-bs-touch={touch}
                    >

                        <div className={`carousel-indicators ${images.length < 2 ? 'd-none' : ''}`}>
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    style={{backgroundColor: '#292727'}}
                                    data-bs-target={`#${carouselId}`}
                                    data-bs-slide-to={index}
                                    className={index === 0 ? 'active' : ''}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <div className="carousel-inner">
                            {images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.alt || ''}
                                        className="d-block w-100"
                                        style={{height: `${height}px`, objectFit: 'cover'}}
                                    />
                                    <div className="carousel-caption">
                                        <div className="caption-container">
                                            <RichText
                                                tagName="h5"
                                                placeholder="Enter heading here..."
                                                value={headings[index]}
                                                onChange={(value) => updateHeading(index, value)}
                                            />
                                            <RichText
                                                tagName="p"
                                                placeholder="Enter caption here..."
                                                value={captions[index]}
                                                onChange={(value) => updateCaption(index, value)}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        isDestructive
                                        onClick={() => removeImage(index)}
                                        className="editor-controls"
                                    >
                                        Entfernen
                                    </Button>
                                </div>
                            ))
                            }
                        </div>
                        {/* Controls */}
                        {images.length > 1 ? <Fragment>
                            <button style={{height: `${height}px`}} className="carousel-control-prev" type="button"
                                    data-bs-target={`#${carouselId}`}
                                    data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button style={{height: `${height}px`}} className="carousel-control-next" type="button"
                                    data-bs-target={`#${carouselId}`}
                                    data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </Fragment> : ''}
                    </div>

                    <div className="editor-controls">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={addImage}
                                allowedTypes={['image']}
                                render={({open}) => (
                                    <Button isPrimary onClick={open}>
                                        Bild hinzufügen
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>
                </div>
            </Fragment>
        );
    },

    save({attributes}) {
        const {
            carouselId,
            images,
            captions,
            headings,
            autoSlide,
            interval,
            height,
            pauseOnHover,
            touch,
            postId
        } = attributes;

        return (
            <div
                style={{height: `${height}px`}}
                className="position-relative">
                {/* Loader */}
                <div className="image-loader-dot-wrapper">
                    <div className="dot-spin"></div>
                </div>
                <div
                    className="carousel slide"
                    id={carouselId}
                    data-bs-ride={autoSlide ? 'carousel' : 'false'}
                    data-bs-interval={interval}
                    data-post-id={postId}
                    data-bs-pause={pauseOnHover}
                    data-bs-touch={touch}
                    style={{height: `${height}px`}}
                >
                    {/* Indicators */}
                    {images.length > 1 ?
                    <div
                        className="carousel-indicators">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target={`#${carouselId}`}
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>: ''}

                    {/* Carousel Items */}
                    <div className="carousel-inner">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                            >
                                <img
                                    src={image.url}
                                    alt={image.alt || ''}
                                    className="d-block w-100"
                                    style={{height: `${height}px`, objectFit: 'cover'}}
                                />
                                <div className="carousel-caption">
                                    <div className="caption-container">
                                        {headings[index] && (
                                            <RichText.Content tagName="h5" value={headings[index]}/>
                                        )}
                                        {captions[index] && (
                                            <RichText.Content tagName="p" value={captions[index]}/>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Controls */}
                    {images.length > 1 ? <Fragment>
                    <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`}
                            data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`}
                            data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button></Fragment> : ''}
                </div>
            </div>
        );
    },
});
