import './editor.scss';

const {registerBlockType} = wp.blocks;
import icon from './icon.js';
import {select} from '@wordpress/data';

const {__} = wp.i18n;
const {Fragment} = wp.element;
const {
    PanelBody,
    ToggleControl,
    RadioControl,
    ResponsiveWrapper,
    Button,
    SelectControl,
    Flex,
    FlexItem,
    TextControl
} = wp.components;
const {MediaUpload, MediaUploadCheck, InnerBlocks, useBlockProps, InspectorControls, RichText} = wp.blockEditor;
registerBlockType('hupa/video-carousel-item', {
    title: __('Video Item', 'bootscore'),
    icon: icon,
    category: 'media',
    parent: ['hupa/video-carousel-container'], // Erzwingt, dass dieser Block nur im Accordion benutzt wird
    supports: {
        reusable: false, // In der Regel kein eigenes Reusable hier benötigt
    },
    attributes: {
        itemId: {
            type: 'string',
            default: ''
        },
        imageSize: {
            type: 'string',
            default: 'large'
        },
        videoMuted: {
            type: 'bool',
            default: false
        },
        videoAutoPlay: {
            type: 'bool',
            default: false
        },
        videoControls: {
            type: 'bool',
            default: true
        },
        videoStartTime: {
            type: 'number',
            default: 0
        },
        postId: {
            type: 'number',
            default: 0
        },
        externesCoverImgAktiv: {
            type: 'bool',
            default: false
        },
        mediaData: {
            type: 'object',
            default: {}
        },
        mediaVideoData: {
            type: 'object',
            default: {}
        },
        selectedExternSourceType: {
            type: 'string',
            default: 'link'
        },
        externLinkMimeType: {
            type: 'string',
            default: '',
        },
        externVideoId: {
            type: 'string',
            default: '',
        },
        externVideoUrl: {
            type: 'string',
            default: '',
        },
        selectedSourceType: {
            type: 'string',
            default: 'mediathek'
        },
        videoTitelAktiv: {
            type: 'bool',
            default: true
        },
        customVideoTitel: {
            type: 'string',
            default: '',
        },   // Neu: Offset in px
    },
    edit({attributes, setAttributes}) {
        const {
            itemId,
            externesCoverImgAktiv,
            videoMuted,
            videoAutoPlay,
            videoControls,
            videoStartTime,
            mediaData,
            imageSize,
            mediaVideoData,
            externLinkMimeType,
            selectedExternSourceType,
            externVideoId,
            externVideoUrl,
            selectedSourceType,
            videoTitelAktiv,
            customVideoTitel,
        } = attributes;

        if (!itemId) {
            const uniqueId = `item-${Math.random().toString(36).slice(2, 9)}`;
            setAttributes({itemId: uniqueId});
        }

        const postId = select('core/editor').getCurrentPostId();
        setAttributes({postId: postId});

        const blockProps = useBlockProps({
            className: 'hupa-video-carousel-item',
        });


        const addImage = (media) => {
            const newImage = {
                id: media.id,
                url: media.sizes[imageSize]?.url || media.url,
                alt: media.alt,
                width: media.width,
                height: media.height,
                mimeType: media.mime
            };
            setAttributes({mediaData: newImage});
        };

        const addVideo = (media) => {
            let title;
            media.title ? title = media.title : title = 'kein Titel';
            const newVideo = {
                id: media.id,
                url: media.url,
                width: media.width,
                height: media.height,
                title: title,
                fileLength: media.fileLength,
                mimeType: media.mime,
                mediaIcon: media.icon,
            }
            setAttributes({mediaVideoData: newVideo});
        }

        const setAutoPlay = (e) => {
            let muted;
            if(e) {
                muted = true;
            } else  {
                muted = videoMuted
            }
            setAttributes({
                videoMuted: muted,
                videoAutoPlay: e
            })
        }

        const setMuted = (e) => {
            let play;
            if(!e) {
                play = false;
            } else {
                play = videoAutoPlay
            }
            setAttributes({
                videoMuted: e,
                videoAutoPlay: play
            })
        }

        const setNewSize = (size) => {
            if (mediaData.id) {
                wp.apiFetch({
                    path: `/wp/v2/media/${mediaData.id}`,
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
                        }
                        let upd = mediaData;
                        upd.url = url;
                        setAttributes({
                            mediaData: upd,
                            imageSize: size
                        });
                    }
                })
            }
        }

        const removeImage = () => {
            setAttributes({
                mediaData: {},
            });
        };

        const typeArr = ["youtube", "vimeo"];
        const SmallLine = ({color}) => (
            <hr
                className="hr-small-trenner"
            />
        );

        // Hier könnte man auch ein eigenes Template definieren, etwa:
        // template={[['core/heading', { placeholder: __('Accordion Title', 'myplugin') }], ['core/paragraph', { placeholder: __('Accordion content...', 'myplugin') }]]}
        // Wenn man maximale Freiheit will, einfach ohne Template, aber mit InnerBlocks
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={__('Video Cover Image', 'bootscore')} initialOpen={true}>
                        <div className="image-upload-wrapper editor-post-featured-image__container">

                            <div className="editor-controls">
                                {mediaData.id ?
                                    <Fragment>
                                        <ResponsiveWrapper
                                            naturalWidth={mediaData.width}
                                            naturalHeight={mediaData.height}
                                        >
                                            <img style={{height: '160px', objectFit: 'cover', width: '100%'}}
                                                 src={mediaData.url} alt="Video Cover"/>
                                        </ResponsiveWrapper>
                                        <Button
                                            isDestructive
                                            onClick={removeImage}
                                            className="editor-controls"
                                        >
                                            entfernen
                                        </Button>
                                    </Fragment>
                                    :
                                    <MediaUploadCheck>
                                        <MediaUpload
                                            onSelect={addImage}
                                            allowedTypes={['image']}
                                            render={({open}) => (
                                                <Button isPrimary onClick={open}>
                                                    Cover hinzufügen
                                                </Button>
                                            )}
                                        />
                                    </MediaUploadCheck>
                                }
                                <hr style={{margin: '.5rem 0 1rem 0'}}/>
                            </div>

                            <SelectControl
                                label="Image Size"
                                value={imageSize}
                                disabled={!mediaData.id}
                                __nextHasNoMarginBottom={true}
                                options={[
                                    {label: 'Thumbnail', value: 'thumbnail'},
                                    {label: 'Medium', value: 'medium'},
                                    {label: 'Large', value: 'large'},
                                    {label: 'Full', value: 'full'},
                                ]}
                                onChange={(newSize) => setNewSize(newSize)}
                            />
                        </div>
                    </PanelBody>
                    <PanelBody title={__('Video Source', 'bootscore')} initialOpen={true}>
                        <div className="video-upload-wrapper">
                            <Flex
                                gap={2}
                                align="center"
                                justify="center"
                            >
                                <FlexItem>
                                    <Button
                                        className={selectedSourceType === 'mediathek' ? 'btn-sidebar active' : 'btn-sidebar'}
                                        onClick={() => setAttributes({selectedSourceType: 'mediathek'})}
                                        variant="secondary"
                                        isLarge>{__('Mediathek', 'bootscore')}
                                    </Button>
                                </FlexItem>
                                <FlexItem>
                                    <Button
                                        className={selectedSourceType === 'extern' ? 'btn-sidebar active' : 'btn-sidebar'}
                                        onClick={() => setAttributes({selectedSourceType: 'extern', videoTitelAktiv: false})}
                                        variant="secondary"
                                        isLarge>{__('Externer Anbieter', 'bootscore')}
                                    </Button>
                                </FlexItem>
                            </Flex>
                            <div className="body-group">
                                <SmallLine/>
                                <ToggleControl
                                    label={__('Videotitel verwenden', 'bootscore')}
                                    disabled={selectedSourceType === 'extern'}
                                    checked={videoTitelAktiv}
                                    __nextHasNoMarginBottom={true}
                                    onChange={e => setAttributes({videoTitelAktiv: e})}
                                />
                            </div>
                            <div className={videoTitelAktiv ? 'block-none' : 'body-group'}>
                                <TextControl
                                    label={__('Video Titel', 'bootscore')}
                                    value={customVideoTitel}
                                    __nextHasNoMarginBottom={true}
                                    type='text'
                                    onChange={e => setAttributes({customVideoTitel: e})}
                                />
                                <SmallLine/>
                            </div>

                            <div className={selectedSourceType === 'mediathek' ? 'block-none' : ''}>
                                <RadioControl
                                    label="Video Link Source"
                                    selected={selectedExternSourceType}
                                    __nextHasNoMarginBottom={true}
                                    options={[
                                        {label: 'Link', value: 'link'},
                                        {label: 'YouTube', value: 'youtube'},
                                        {label: 'Vimeo', value: 'vimeo'},
                                    ]}
                                    onChange={(option) => {
                                        setAttributes({selectedExternSourceType: option})
                                    }}
                                />
                                <div className={typeArr.includes(selectedExternSourceType) ? '' : 'block-none'}>
                                    <SmallLine/>
                                    <ToggleControl
                                        label={__('Externes Cover Bild verwenden', 'bootscore')}
                                        checked={externesCoverImgAktiv}
                                        __nextHasNoMarginBottom={true}
                                        onChange={e => setAttributes({externesCoverImgAktiv: e})}
                                    />
                                    <SmallLine/>
                                    <TextControl
                                        label={__('Video ID', 'bootscore') + ':'}
                                        value={externVideoId}
                                        __nextHasNoMarginBottom={true}
                                        type='text'
                                        onChange={e => setAttributes({externVideoId: e})}
                                    />
                                </div>
                                <div className={selectedExternSourceType === 'link' ? '' : 'block-none'}>
                                    <TextControl
                                        label={__('Video URL', 'bootscore') + ':'}
                                        value={externVideoUrl}
                                        __nextHasNoMarginBottom={true}
                                        type='text'
                                        onChange={e => setAttributes({externVideoUrl: e})}
                                    />
                                    <TextControl
                                        label={__('Video Mime Type', 'bootscore') + ':'}
                                        value={externLinkMimeType}
                                        __nextHasNoMarginBottom={true}
                                        type='text'
                                        onChange={e => setAttributes({externLinkMimeType: e})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="editor-controls">
                            <div className={selectedSourceType === 'extern' ? 'block-none' : ''}>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={addVideo}
                                        allowedTypes={['video']}
                                        render={({open}) => (
                                            <Button
                                                className={!mediaVideoData ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
                                                onClick={open}
                                            >
                                                {!mediaVideoData.id && __('Video', 'bootscore')}
                                                {mediaVideoData.id && <Fragment>
                                                    <div className="videoBtnSelect">
                                                        <img style={{height: "80px", width: "60px", padding: "10px"}}
                                                             alt="Video Cover" src={mediaVideoData.mediaIcon}/>
                                                        <p>{mediaVideoData.title}<br/> Länge: {mediaVideoData.fileLength}
                                                        </p>
                                                    </div>
                                                </Fragment>}
                                            </Button>
                                        )}
                                    />
                                </MediaUploadCheck>

                                {mediaVideoData.id &&
                                    <MediaUploadCheck>
                                        <Button
                                            onClick={() => setAttributes({mediaVideoData: {}})}
                                            isLink
                                            isDestructive>{__('Video entfernen', 'bootscore')}
                                        </Button>
                                    </MediaUploadCheck>
                                }
                            </div>
                        </div>
                    </PanelBody>
                    <PanelBody title={__('Video Einstellungen', 'bootscore')} initialOpen={true}>
                        <SmallLine/>
                        <ToggleControl
                            disabled={selectedSourceType === 'extern'}
                            label={__('Video muted', 'bootscore')}
                            checked={videoMuted}
                            __nextHasNoMarginBottom={true}
                            onChange={e => setMuted(e)}
                        />
                        <ToggleControl
                            disabled={selectedSourceType === 'extern'}
                            label={__('Video controls', 'bootscore')}
                            checked={videoControls}
                            __nextHasNoMarginBottom={true}
                            onChange={e => setAttributes({videoControls: e})}
                        />
                        <ToggleControl
                            disabled={selectedSourceType === 'extern'}
                            label={__('Video autoplay', 'bootscore')}
                            checked={videoAutoPlay}
                            __nextHasNoMarginBottom={true}
                            onChange={e => setAutoPlay(e)}
                        />
                        <SmallLine/>
                        <TextControl
                            disabled={selectedSourceType === 'extern'}
                            label={__('Video Startzeit (sek)', 'bootscore') + ':'}
                            value={parseInt(videoStartTime)}
                            __nextHasNoMarginBottom={true}
                            min={0}
                            type='number'
                            onChange={e => setAttributes({videoStartTime: parseInt(e)})}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <div className=" video-item bg-white p-2">
                        <div className="video-cover">
                            {mediaData.id ?
                                <img className="img-fluid rounded" alt="Video Carousel" src={`${mediaData.url}`}/>
                                :
                                <img className="img-fluid rounded" alt="Video Carousel"
                                     src={`${hummeltRestEditorObj.admin_url}assets/images/video-placeholder.jpg`}/>
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    },
    save({attributes}) {
        const {
            itemId,
            externesCoverImgAktiv,
            mediaData,
            videoMuted,
            videoControls,
            videoStartTime,
            videoAutoPlay,
            mediaVideoData,
            externLinkMimeType,
            selectedExternSourceType,
            externVideoId,
            externVideoUrl,
            selectedSourceType,
            videoTitelAktiv,
            customVideoTitel,
        } = attributes;

        return (
            <div id={itemId}
                 data-title-aktiv={videoTitelAktiv}
                 data-item-id={itemId}
                 data-extern-cover-img-active={externesCoverImgAktiv}
                 data-media={JSON.stringify(mediaData)}
                 data-video={JSON.stringify(mediaVideoData)}
                 data-extern-source-type={selectedExternSourceType}
                 data-extern-video-id={externVideoId}
                 data-extern-video-url={externVideoUrl}
                 data-source-type={selectedSourceType}
                 data-custom-title={customVideoTitel}
                 data-extern-mime={externLinkMimeType}
                 data-muted={videoMuted}
                 data-controls={videoControls}
                 data-start-time={parseInt(videoStartTime)}
                 data-auto-play={videoAutoPlay}
            >
            </div>
        );
    },
});