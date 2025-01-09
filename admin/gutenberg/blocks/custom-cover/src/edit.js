import {
    useBlockProps,
    RichText,
    InnerBlocks,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck
} from '@wordpress/block-editor';

const {PanelBody, ColorPicker, RangeControl, Button, SelectControl, Flex, FlexItem, ToggleControl, TextControl} = wp.components;
const {Fragment} = wp.element;

const Edit = ({attributes, setAttributes}) => {
    const {
        backgroundImage,
        imageId,
        overlayColor,
        content,
        height,
        imageSize,
        parallax_active,
        parallax_fixiert,
        parallax_type,
        parallax_speed,
        position_left,
        position_oben
    } = attributes;

    const blockProps = useBlockProps({
        className: 'custom-cover-block',
        style: {
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            height: `${height}px`,
            backgroundPosition: `${position_left}% ${position_oben}%`
        },
    });

    const handleImageSizeChange = (newSize, media) => {
        // Sicherstellen, dass `media.sizes` existiert und die gewünschte Größe verfügbar ist
        const selectedImageSize =
            media?.sizes?.[newSize]?.url || media?.url || ''; // Fallback auf die Standard-URL oder einen leeren String
        setAttributes({imageSize: newSize, backgroundImage: selectedImageSize});
    };

    const setNewSize = (size) => {
        if (imageId) {
            wp.apiFetch({
                path: `/wp/v2/media/${imageId}`,
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
                    setAttributes({
                        backgroundImage: url,
                        imageSize: size
                    });
                }
            })
        }
    }

    const handleImageSelect = (media) => {
        // Beim Bildauswahl sicherstellen, dass `imageSize` berücksichtigt wird

        const selectedImageSize =
            media?.sizes?.[imageSize]?.url || media?.url || ''; // Fallback auf die Standard-URL oder einen leeren String
        setAttributes({backgroundImage: selectedImageSize, imageId: media.id});
    };

    const handleFixiert = (e) => {
        let parallax = parallax_active;
        if(e) {
            parallax = false;
        }
        setAttributes({
            parallax_fixiert: e,
            parallax_active: parallax
        })
    }

    const setParallax = (e) => {
        let fixiert = parallax_fixiert;
        if(e){
            fixiert = false;
        }
        setAttributes({
            parallax_fixiert: fixiert,
            parallax_active: e
        })
    }


    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title="Einstellungen">
                    <div className="cover-upload-button">
                        <MediaUpload
                            onSelect={handleImageSelect}
                            allowedTypes={['image']}
                            render={({open}) => (
                                <Button isPrimary onClick={open}>
                                    Hintergrundbild auswählen
                                </Button>
                            )}
                        />
                    </div>
                    <SelectControl
                        label="Bildgröße auswählen"
                        value={imageSize}
                        __nextHasNoMarginBottom={true}
                        options={[
                            {label: 'Thumbnail', value: 'thumbnail'},
                            {label: 'Medium', value: 'medium'},
                            {label: 'Large', value: 'large'},
                            {label: 'Full Size', value: 'full'},
                        ]}
                        onChange={(newSize) => setNewSize(newSize)}
                    />
                    <ColorPicker
                        color={overlayColor}
                        __nextHasNoMarginBottom={true}
                        onChangeComplete={(color) => {
                            const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
                            setAttributes({overlayColor: rgbaColor});
                        }}
                        disableAlpha={false}
                    />
                    <RangeControl
                        label="Höhe (px)"
                        value={height}
                        __nextHasNoMarginBottom={true}
                        onChange={(value) => setAttributes({height: value})}
                        min={100}
                        max={1000}
                    />
                    <TextControl
                        label='Position links'
                        value={position_left}
                        __nextHasNoMarginBottom={true}
                        type='number'
                        min={0}
                        max={100}
                        step={1}
                        onChange={e => setAttributes({position_left: e})}
                    />
                    <TextControl
                        label='Position oben'
                        value={position_oben}
                        __nextHasNoMarginBottom={true}
                        type='number'
                        min={0}
                        max={100}
                        step={1}
                        onChange={e => setAttributes({position_oben: e})}
                    />
                </PanelBody>
                <PanelBody initialOpen={false}
                    title="Parallax">
                    <div style={{margin: '1rem 0'}}>
                    <Flex
                        gap={3}
                        align="center"
                        justify="start"
                    >
                        <FlexItem>
                            <ToggleControl
                                label="Parallax"
                                __nextHasNoMarginBottom={true}
                                checked={parallax_active}
                                onChange={(e) => setParallax(e)}
                            />
                        </FlexItem>
                        <FlexItem>
                            <ToggleControl
                                label="Fixiert"
                                __nextHasNoMarginBottom={true}
                                checked={parallax_fixiert}
                                onChange={(e) => handleFixiert(e)}
                            />
                        </FlexItem>
                    </Flex>
                    </div>
                    <SelectControl
                        label="Parallax Type"
                        value={parallax_type}
                        disabled={!parallax_active}
                        __nextHasNoMarginBottom={true}
                        options={[
                            {label: 'scroll', value: 'scroll'},
                            {label: 'scale', value: 'scale'},
                            {label: 'opacity', value: 'opacity'},
                            {label: 'scroll-opacity', value: 'scroll-opacity'},
                            {label: 'scale-opacity', value: 'scale-opacity'},
                        ]}
                        onChange={(type) => setAttributes({parallax_type: type})}
                    />
                    <TextControl
                        label='Geschwindigkeit'
                        value={parallax_speed}
                        disabled={!parallax_active}
                        __nextHasNoMarginBottom={true}
                        type='number'
                        min={-1.0}
                        max={2.0}
                        step={0.1}
                        onChange={e => setAttributes({parallax_speed: e})}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div
                    className="cover-overlay"
                    style={{
                        backgroundColor: overlayColor
                }}
                ></div>
                <RichText
                    tagName="h5"
                    className="cover-content"
                    value={content}
                    onChange={(value) => setAttributes({content: value})}
                    placeholder="Füge hier eine Überschrift ein..."
                />
                <div className="inner-block-cover">
                    <InnerBlocks/>
                </div>
            </div>
        </Fragment>
    );
};

export default Edit;
