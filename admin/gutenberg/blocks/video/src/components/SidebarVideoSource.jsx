import {Flex, FlexItem, RadioControl, TextControl, ToggleControl} from "@wordpress/components";

const {MediaUpload, MediaUploadCheck} = wp.blockEditor;
const {Component} = wp.element;
const {withDispatch, withSelect, select} = wp.data;
const {__} = wp.i18n;
const {compose} = wp.compose;
const {Button} = wp.components;

export class SidebarVideoSource extends Component {
    constructor(props) {
        super(...arguments);
        this.props = props;
        this.state = {
            videoMedia: []
        }
        this.onChangExternVideoId = this.onChangExternVideoId.bind(this);
        this.onChangeSelectedExternVideoSource = this.onChangeSelectedExternVideoSource.bind(this);
        this.onChangExternVideoUrl = this.onChangExternVideoUrl.bind(this);
        this.onChangeVideoSource = this.onChangeVideoSource.bind(this);
        this.onSelectVideoMedia = this.onSelectVideoMedia.bind(this);
        this.onRemoveVideoMedia = this.onRemoveVideoMedia.bind(this);
        this.getVideoMediaData = this.getVideoMediaData.bind(this);
        this.getVideoStateMedia = this.getVideoStateMedia.bind(this);
        this.onSetCurrentPostId = this.onSetCurrentPostId.bind(this);
        this.onChangeExternImgAktiv = this.onChangeExternImgAktiv.bind(this);
        this.onChangeVideoTitelAktiv = this.onChangeVideoTitelAktiv.bind(this);
        this.onChangeCustomVideoTitel = this.onChangeCustomVideoTitel.bind(this);
    }

    onSelectVideoMedia(media) {
        this.setState({
            videoMedia: media,
        });
        let title;
        media.title ? title = media.title : title = 'kein Titel';
        let mediaData = {
            'id': media.id,
            'url': media.url,
            'width': media.width,
            'height': media.height,
            'title': title,
            'fileLength': media.fileLength,
            'mimeType': media.mime,
            'mediaIcon': media.icon,
        }
        this.props.OnUpdateMediaVideoData(
            this.props.mediaVideoData = JSON.stringify(mediaData)
        );
    }

    onRemoveVideoMedia() {
        let mediaData = {
            'id': '',
            'url': '',
            'width': '',
            'height': '',
            'title': '',
            'fileLength': '',
            'mimeType': '',
            'mediaIcon': ''
        }
        this.props.OnUpdateMediaVideoData(
            this.props.mediaVideoData = JSON.stringify(mediaData)
        );
    }

    getVideoMediaData() {
        return JSON.parse(this.props.mediaVideoData);
    }

    getVideoStateMedia() {
        return this.state.videoMedia;
    }

    onChangeSelectedExternVideoSource(source) {
        const typeArr = ["youtube", "vimeo"];

        if (typeArr.includes(this.props.selectedExternSourceType)) {
            this.props.OnUpdateExternVideoId(
                this.props.externVideoId = ''
            );
        }

        this.props.OnUpdateSelectedExternSourceType(
            this.props.selectedExternSourceType = source
        );
    }

    onChangExternVideoId(id) {
        this.props.OnUpdateExternVideoId(
            this.props.externVideoId = id
        );
    }

    onChangExternVideoUrl(url) {
        this.props.OnUpdateExternVideoUrl(
            this.props.externVideoUrl = url
        );
    }

    onChangeVideoSource(source) {
        this.props.OnUpdateSourceType(
            this.props.selectedSourceType = source
        );
    }

    onSetCurrentPostId() {
        const postId = select("core/editor").getCurrentPostId();
        this.props.OnUpdatePostId(
            this.props.postId = postId
        );
    }

    onChangeExternImgAktiv(aktiv) {
        this.props.OnUpdateExternesCoverImgAktiv(
            this.props.externesCoverImgAktiv = aktiv
        );
    }

    onChangeVideoTitelAktiv(videoTitelAktiv) {
        this.props.OnUpdateVideoTitelAktiv(
            this.props.videoTitelAktiv = videoTitelAktiv
        );
    }

    onChangeCustomVideoTitel(customVideoTitel) {
        this.props.OnUpdateCustomVideoTitel(
            this.props.customVideoTitel = customVideoTitel
        );
    }

    render() {

        const data = this.getVideoMediaData();
        const state = this.getVideoStateMedia();
        const typeArr = ["youtube", "vimeo"];
        const SmallLine = ({color}) => (
            <hr
                className="hr-small-trenner"
            />
        );

        this.onSetCurrentPostId();

        return (
            <div className="video-upload-wrapper">
                <Flex
                    gap={2}
                    align="center"
                    justify="center"
                >
                    <FlexItem>
                        <Button
                            className={this.props.selectedSourceType === 'mediathek' ? 'btn-sidebar active' : 'btn-sidebar'}
                            onClick={e => this.onChangeVideoSource('mediathek')}
                            variant="secondary"
                            isLarge>{__('Mediathek', 'bootscore')}
                        </Button>
                    </FlexItem>
                    <FlexItem>
                        <Button
                            className={this.props.selectedSourceType === 'extern' ? 'btn-sidebar active' : 'btn-sidebar'}
                            onClick={e => this.onChangeVideoSource('extern')}
                            variant="secondary"
                            isLarge>{__('Externer Anbieter', 'bootscore')}
                        </Button>
                    </FlexItem>
                </Flex>
                    <div className="body-group">
                        <SmallLine/>
                        <ToggleControl
                            label={__('Videotitel verwenden', 'bootscore')}
                            checked={this.props.videoTitelAktiv}
                            __nextHasNoMarginBottom={true}
                            onChange={this.onChangeVideoTitelAktiv}
                        />
                    </div>

                    <div className={this.props.videoTitelAktiv ? 'block-none' : 'body-group'}>
                        <TextControl
                            label={__('Video Titel', 'bootscore')}
                            value={this.props.customVideoTitel}
                            __nextHasNoMarginBottom={true}
                            type='text'
                            onChange={this.onChangeCustomVideoTitel}
                        />
                        <SmallLine/>
                    </div>

                <div id="externSourceWrapper"
                     className={this.props.selectedSourceType === 'mediathek' ? 'block-none' : ''}>
                    <RadioControl
                        label="Video Link Source"
                        selected={this.props.selectedExternSourceType}
                        __nextHasNoMarginBottom={true}
                        options={[
                            {label: 'Link', value: 'link'},
                            {label: 'YouTube', value: 'youtube'},
                            {label: 'Vimeo', value: 'vimeo'},
                        ]}
                        onChange={(option) => {
                            this.onChangeSelectedExternVideoSource(option)
                        }}
                    />

                    <div id="inputVideoId"
                         className={typeArr.includes(this.props.selectedExternSourceType) ? '' : 'block-none'}>
                        <SmallLine/>
                        <ToggleControl
                            label={__('Externes Cover Bild verwenden', 'bootscore')}
                            checked={this.props.externesCoverImgAktiv}
                            __nextHasNoMarginBottom={true}
                            onChange={this.onChangeExternImgAktiv}
                        />
                        <SmallLine/>
                        <TextControl
                            label={__('Video ID', 'bootscore') + ':'}
                            value={this.props.externVideoId}
                            __nextHasNoMarginBottom={true}
                            type='text'
                            onChange={this.onChangExternVideoId}
                        />
                    </div>
                    <div className={this.props.selectedExternSourceType === 'link' ? '' : 'block-none'}>
                        <TextControl
                            label={__('Video URL', 'bootscore') + ':'}
                            value={this.props.externVideoUrl}
                            __nextHasNoMarginBottom={true}
                            type='text'
                            onChange={this.onChangExternVideoUrl}
                        />
                    </div>
                </div>

                <div id="videoMediathek" className={this.props.selectedSourceType === 'extern' ? 'block-none' : ''}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={this.onSelectVideoMedia}
                            allowedTypes={['video']}
                            render={({open}) => (
                                <Button
                                    className={data.id == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
                                    onClick={open}
                                >
                                    {data.id == 0 && __('Video', 'bootscore')}
                                    {state.media != undefined &&
                                        <div className="videoBtnSelect">
                                            <img style={{height: "80px", width: "60px", padding: "10px"}}
                                                 alt="Video Cover" src={state.icon}/>
                                            <p>{state.title}<br/> Länge: {state.fileLength}</p>
                                        </div>
                                    }
                                    {data.id ?
                                        <div className="videoBtnSelect">
                                            <img style={{height: "80px", width: "60px", padding: "10px"}}
                                                 alt="Video Cover" src={data.mediaIcon}/>
                                            <p>{data.title}<br/> Länge: {data.fileLength}</p>
                                        </div>
                                        : ''}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    {data.id ?
                        <div className="replace-wrapper">
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={this.onSelectVideoMedia}
                                    value={data.id}
                                    allowedTypes={['video']}
                                    render={({open}) => (
                                        <Button
                                            className="btn-sidebar"
                                            onClick={open}
                                            variant="secondary"
                                            isLarge>{__('Video ersetzen', 'bootscore')}
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
                                    onClick={this.onRemoveVideoMedia}
                                    isLink
                                    isDestructive>{__('Video entfernen', 'bootscore')}
                                </Button>
                            </MediaUploadCheck>
                        </div>
                    }
                </div>
            </div>
        )
    }
}


