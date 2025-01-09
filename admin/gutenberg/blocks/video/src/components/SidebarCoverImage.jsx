const {MediaUpload, MediaUploadCheck} = wp.blockEditor;
const {Component} = wp.element;
const {withDispatch, withSelect, select} = wp.data;
const {__} = wp.i18n;
const {compose} = wp.compose;
const {Button, ResponsiveWrapper} = wp.components;

export class SidebarCoverImage extends Component {
    constructor(props) {
        super(...arguments);
        this.props = props;
        this.state = {
            media: []
        }

        this.onSelectMedia = this.onSelectMedia.bind(this);
        this.getMediaData = this.getMediaData.bind(this);
        this.getStateMedia = this.getStateMedia.bind(this);
        this.onRemoveMedia = this.onRemoveMedia.bind(this);
    }

    onSelectMedia(media) {
        this.setState({
            media: media,
        });
        let mediaData = {
            'id': media.id,
            'url': media.url,
            'width': media.width,
            'height': media.height,
            'mimeType': media.mime
        }
        this.props.OnUpdateMediaData(
            this.props.mediaData = JSON.stringify(mediaData)
        );
    }

    onRemoveMedia() {
        let mediaData = {
            'id': '',
            'url': '',
            'width': '',
            'height': '',
            'mimeType': '',
        }
        this.props.OnUpdateMediaData(
            this.props.mediaData = JSON.stringify(mediaData)
        );
    }

    getMediaData() {
        return JSON.parse(this.props.mediaData);
    }

    getStateMedia() {
        return this.state.media;
    }

    render() {
        const data = this.getMediaData();
        const state = this.getStateMedia()

        return (
            <div className="image-upload-wrapper editor-post-featured-image__container">
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={this.onSelectMedia}
                        allowedTypes={['image']}
                        render={({open}) => (
                            <Button
                                className={data.id == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
                                onClick={open}
                            >
                                {data.id == 0 && __('Video-Cover Bild', 'bootscore')}
                                {state.media != undefined &&
                                    <ResponsiveWrapper
                                        naturalWidth={state.media.width}
                                        naturalHeight={state.media.height}
                                    >
                                        <img src={state.media.url} alt="Video Cover"/>
                                    </ResponsiveWrapper>
                                }
                                {data.id ?
                                    <ResponsiveWrapper
                                        naturalWidth={data.width}
                                        naturalHeight={data.height}
                                    >
                                        <img alt="Video Cover" src={data.url}/>
                                    </ResponsiveWrapper>
                                    : ''}
                            </Button>
                        )}
                    />
                </MediaUploadCheck>

                {data.id ?
                    <div className="replace-wrapper">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={this.onSelectMedia}
                                value={data.id}
                                allowedTypes={['image']}
                                __nextHasNoMarginBottom={true}
                                render={({open}) => (
                                    <Button
                                        className="btn-sidebar"
                                        onClick={open}
                                        variant="secondary"
                                        isLarge>{__('Bild ersetzen', 'bootscore')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>
                    : ''}
                {data.id != 0 &&
                    <div className="remove-wrapper">
                        <MediaUploadCheck>
                            <Button
                                onClick={this.onRemoveMedia}
                                isLink
                                __nextHasNoMarginBottom={true}
                                isDestructive>{__('Cover Bild entfernen', 'bootscore')}
                            </Button>
                        </MediaUploadCheck>
                    </div>
                }
            </div>
        )
    }
}


