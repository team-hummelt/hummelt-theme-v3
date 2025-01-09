/*
 * Plugin Name: Single Video Block
 * Description: Ein Gutenberg-Block, um einen OpenStreetMap Iframe einzufügen, mit einstellbarer Höhe, Breite und URL.
 * Version: 1.0
 * Author: Jens
 */

import './editor.scss';
import icon from './components/utils/icon.js';
import Icon from "./components/utils/icon.js";
import {SidebarCoverImage} from "./components/SidebarCoverImage.jsx";
import {SidebarVideoSource} from "./components/SidebarVideoSource.jsx";
const {registerBlockType} = wp.blocks;
const {InspectorControls} = wp.blockEditor;
const {PanelBody, TextControl, SelectControl, TextareaControl} = wp.components;
const {Component, Fragment, createRef} = wp.element;
const {__} = wp.i18n;

registerBlockType("hupa/video-single-block", {
    title: "Video",
    icon: icon,
    className: 'hupa-video-single-block',
    category: "media",
    attributes: {
        postId: {
            type: 'number',
            default: 0
        },
        externesCoverImgAktiv: {
            type: 'bool',
            default: false
        },
        selectedCategory: {
            type: 'string',
            default: '',
        },
        mediaData: {
            type: 'string',
            default: '{"id":0,"url":"","width":"","height":"","mimeType":""}'
        },
        mediaSource: {
            type: 'string',
            default: '{"id":0,"url":"","width":"","height":"","mimeType":"","type":""}'
        },
        mediaVideoData: {
            type: 'string',
            default: '{"id":0,"url":"","width":"","height":"","title":"","fileLength":"","mimeType":"","mediaIcon":""}'
        },
        selectedExternSourceType: {
            type: 'string',
            default: 'link'
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
        },
    },

    edit: class extends Component {
        constructor(props) {
            super(...arguments);
            this.props = props;
            this.osmIframe = createRef();
            this.state = {

            }
            this.updateSelectedCategory = this.updateSelectedCategory.bind(this);
            this.OnUpdateMediaData = this.OnUpdateMediaData.bind(this);
            this.OnUpdateSelectedExternSourceType = this.OnUpdateSelectedExternSourceType.bind(this);
            this.OnUpdateExternVideoId = this.OnUpdateExternVideoId.bind(this);
            this.OnUpdateExternVideoUrl = this.OnUpdateExternVideoUrl.bind(this);
            this.OnUpdateSourceType = this.OnUpdateSourceType.bind(this);
            this.OnUpdateMediaVideoData = this.OnUpdateMediaVideoData.bind(this);
            this.OnUpdatePostId = this.OnUpdatePostId.bind(this);
            this.OnUpdateExternesCoverImgAktiv = this.OnUpdateExternesCoverImgAktiv.bind(this);
            this.OnUpdateVideoTitelAktiv = this.OnUpdateVideoTitelAktiv.bind(this);
            this.OnUpdateCustomVideoTitel = this.OnUpdateCustomVideoTitel.bind(this);
        }

        OnUpdateMediaData(mediaData) {
            this.props.setAttributes({mediaData});
        }
        updateSelectedCategory(selectedCategory) {
            this.props.setAttributes({selectedCategory});
        }
        OnUpdateSelectedExternSourceType(selectedExternSourceType) {
            this.props.setAttributes({selectedExternSourceType});
        }

        OnUpdateExternVideoId(externVideoId) {
            this.props.setAttributes({externVideoId});
        }

        OnUpdateExternVideoUrl(externVideoUrl) {
            this.props.setAttributes({externVideoUrl});
        }

        OnUpdateSourceType(selectedSourceType) {
            this.props.setAttributes({selectedSourceType});
        }

        OnUpdateMediaVideoData(mediaVideoData) {
            this.props.setAttributes({mediaVideoData});
        }

        OnUpdatePostId(postId) {
            this.props.setAttributes({postId});
        }

        OnUpdateExternesCoverImgAktiv(externesCoverImgAktiv) {
            this.props.setAttributes({externesCoverImgAktiv});
        }

        OnUpdateVideoTitelAktiv(videoTitelAktiv) {
            this.props.setAttributes({videoTitelAktiv});
        }

        OnUpdateCustomVideoTitel(customVideoTitel) {
            this.props.setAttributes({customVideoTitel});
        }
        render() {
           // const {attributes: {datenschutz, iframeUrl, iframeWidth, iframeHeight, largeUrl}} = this.props;

            return (
                <Fragment>
                    <InspectorControls>
                        <PanelBody className="video-cover" title="Video Cover Image">
                            <SidebarCoverImage
                                mediaData={this.props.attributes.mediaData}
                                OnUpdateMediaData={this.OnUpdateMediaData}
                            />
                        </PanelBody>
                        <PanelBody
                            title={__('Video Source', 'bootscore')}
                            initialOpen={true}
                            className={'video-theme-block-panel-body'}
                        >
                        <SidebarVideoSource
                            postId={this.props.attributes.postId}
                            OnUpdatePostId={this.OnUpdatePostId}

                            selectedExternSourceType={this.props.attributes.selectedExternSourceType}
                            OnUpdateSelectedExternSourceType={this.OnUpdateSelectedExternSourceType}

                            externVideoId={this.props.attributes.externVideoId}
                            OnUpdateExternVideoId={this.OnUpdateExternVideoId}

                            externVideoUrl={this.props.attributes.externVideoUrl}
                            OnUpdateExternVideoUrl={this.OnUpdateExternVideoUrl}

                            //Select Button
                            selectedSourceType={this.props.attributes.selectedSourceType}
                            OnUpdateSourceType={this.OnUpdateSourceType}

                            mediaVideoData={this.props.attributes.mediaVideoData}
                            OnUpdateMediaVideoData={this.OnUpdateMediaVideoData}

                            //externes Cover Image aktiv
                            externesCoverImgAktiv={this.props.attributes.externesCoverImgAktiv}
                            OnUpdateExternesCoverImgAktiv={this.OnUpdateExternesCoverImgAktiv}

                            //Video Titel
                            videoTitelAktiv={this.props.attributes.videoTitelAktiv}
                            OnUpdateVideoTitelAktiv={this.OnUpdateVideoTitelAktiv}

                            customVideoTitel={this.props.attributes.customVideoTitel}
                            OnUpdateCustomVideoTitel={this.OnUpdateCustomVideoTitel}
                        />
                        </PanelBody>

                    </InspectorControls>
                    <div className="video-single-wrapper">
                        <div className="video-form-inner">
                            <Icon/>
                            <h5>Single Video</h5>
                        </div>
                    </div>
                </Fragment>
            );
        }
    },

    save: () => {
        return null;
    },
});