import {useBlockProps, RichText, InnerBlocks} from '@wordpress/block-editor';

const Save = ({attributes}) => {
    const {
        backgroundImage,
        overlayColor,
        content,
        height,
        parallax_active,
        parallax_fixiert,
        parallax_type,
        parallax_speed,
        position_left,
        position_oben
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `custom-cover ${parallax_active ? 'jarallax' : parallax_fixiert ? 'cover-static' : ''} `,
        style: {
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundRepeat: 'no-repeat',
            height: `${height}px`,
            backgroundPosition: `${position_left}% ${position_oben}%`,
            backgroundAttachment: `${parallax_fixiert ? 'fixed' : ''}`
        },
        'data-speed': parallax_speed,
        'data-top': position_oben,
        'data-left': position_left,
        'data-type': parallax_type,
        'data-height': height

    });

    return (
        <div {...blockProps}>
            <div
                className="cover-overlay"
                style={{backgroundColor: overlayColor}}
            ></div>
            <div className="custom-cover-content">
                <RichText.Content
                    tagName="h5"
                    className="cover-content-headline"
                    value={content}
                />
                <div className="inner-block-cover">
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
};

export default Save;
