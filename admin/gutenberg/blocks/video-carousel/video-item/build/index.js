(()=>{"use strict";const e=window.React,t=window.wp.data,{registerBlockType:a}=wp.blocks,{__}=wp.i18n,{Fragment:i}=wp.element,{PanelBody:o,ToggleControl:l,RadioControl:r,ResponsiveWrapper:n,Button:d,SelectControl:s,Flex:c,FlexItem:m,TextControl:u}=wp.components,{MediaUpload:p,MediaUploadCheck:v,InnerBlocks:g,useBlockProps:b,InspectorControls:h,RichText:E}=wp.blockEditor;a("hupa/video-carousel-item",{title:__("Video Item","bootscore"),icon:()=>(0,e.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"21",height:"21",fill:"currentColor",className:"bi bi-play",viewBox:"0 0 16 16"},(0,e.createElement)("path",{d:"M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"})),category:"theme-v3-medien",description:"Flexibles Video Carousel für einzelne oder mehrere Videos – mit zahlreichen Anpassungsmöglichkeiten.",parent:["hupa/video-carousel-container"],supports:{reusable:!1},attributes:{itemId:{type:"string",default:""},imageSize:{type:"string",default:"large"},videoMuted:{type:"bool",default:!1},videoAutoPlay:{type:"bool",default:!1},videoControls:{type:"bool",default:!0},videoLoop:{type:"bool",default:!1},videoStartTime:{type:"number",default:0},postId:{type:"number",default:0},externesCoverImgAktiv:{type:"bool",default:!1},mediaData:{type:"object",default:{}},mediaVideoData:{type:"object",default:{}},selectedExternSourceType:{type:"string",default:"link"},externLinkMimeType:{type:"string",default:""},externVideoId:{type:"string",default:""},externVideoUrl:{type:"string",default:""},selectedSourceType:{type:"string",default:"mediathek"},videoTitelAktiv:{type:"bool",default:!0},customVideoTitel:{type:"string",default:""}},edit({attributes:a,setAttributes:g}){const{itemId:E,externesCoverImgAktiv:y,videoMuted:x,videoAutoPlay:k,videoControls:C,videoLoop:_,videoStartTime:V,mediaData:T,imageSize:f,mediaVideoData:N,externLinkMimeType:w,selectedExternSourceType:M,externVideoId:I,externVideoUrl:S,selectedSourceType:B,videoTitelAktiv:z,customVideoTitel:L}=a;if(!E){const e=`item-${Math.random().toString(36).slice(2,9)}`;g({itemId:e})}const A=(0,t.select)("core/editor").getCurrentPostId();g({postId:A});const D=b({className:"hupa-video-carousel-item"}),H=({color:t})=>(0,e.createElement)("hr",{className:"hr-small-trenner"});return(0,e.createElement)(i,null,(0,e.createElement)(h,null,(0,e.createElement)(o,{title:__("Video Cover Image","bootscore"),initialOpen:!0},(0,e.createElement)("div",{className:"image-upload-wrapper editor-post-featured-image__container"},(0,e.createElement)("div",{className:"editor-controls"},T.id?(0,e.createElement)(i,null,(0,e.createElement)(n,{naturalWidth:T.width,naturalHeight:T.height},(0,e.createElement)("img",{style:{height:"160px",objectFit:"cover",width:"100%"},src:T.url,alt:"Video Cover"})),(0,e.createElement)(d,{isDestructive:!0,onClick:()=>{g({mediaData:{}})},className:"editor-controls"},"entfernen")):(0,e.createElement)(v,null,(0,e.createElement)(p,{onSelect:e=>{const t={id:e.id,url:e.sizes[f]?.url||e.url,alt:e.alt,width:e.width,height:e.height,mimeType:e.mime};g({mediaData:t})},allowedTypes:["image"],render:({open:t})=>(0,e.createElement)(d,{isPrimary:!0,onClick:t},"Cover hinzufügen")})),(0,e.createElement)("hr",{style:{margin:".5rem 0 1rem 0"}})),(0,e.createElement)(s,{label:"Image Size",value:f,disabled:!T.id,__nextHasNoMarginBottom:!0,options:[{label:"Thumbnail",value:"thumbnail"},{label:"Medium",value:"medium"},{label:"Large",value:"large"},{label:"Full",value:"full"}],onChange:e=>{return t=e,void(T.id&&wp.apiFetch({path:`/wp/v2/media/${T.id}`,method:"GET"}).then((e=>{if(e&&e.media_details){let a=e.media_details,i=e.source_url;switch(t){case"thumbnail":a.sizes&&a.sizes.thumbnail&&(i=a.sizes.thumbnail.source_url);break;case"medium":a.sizes&&a.sizes.medium&&(i=a.sizes.medium.source_url);break;case"large":a.sizes&&a.sizes.medium_large&&(i=a.sizes.medium_large.source_url);break;case"full":i=e.source_url}let o=T;o.url=i,g({mediaData:o,imageSize:t})}})));var t}}))),(0,e.createElement)(o,{title:__("Video Source","bootscore"),initialOpen:!0},(0,e.createElement)("div",{className:"video-upload-wrapper"},(0,e.createElement)(c,{gap:2,align:"center",justify:"center"},(0,e.createElement)(m,null,(0,e.createElement)(d,{className:"mediathek"===B?"btn-sidebar active":"btn-sidebar",onClick:()=>g({selectedSourceType:"mediathek"}),variant:"secondary",isLarge:!0},__("Mediathek","bootscore"))),(0,e.createElement)(m,null,(0,e.createElement)(d,{className:"extern"===B?"btn-sidebar active":"btn-sidebar",onClick:()=>g({selectedSourceType:"extern",videoTitelAktiv:!1}),variant:"secondary",isLarge:!0},__("Externer Anbieter","bootscore")))),(0,e.createElement)("div",{className:"body-group"},(0,e.createElement)(H,null),(0,e.createElement)(l,{label:__("Videotitel verwenden","bootscore"),disabled:"extern"===B,checked:z,__nextHasNoMarginBottom:!0,onChange:e=>g({videoTitelAktiv:e})})),(0,e.createElement)("div",{className:z?"block-none":"body-group"},(0,e.createElement)(u,{label:__("Video Titel","bootscore"),value:L,__nextHasNoMarginBottom:!0,type:"text",onChange:e=>g({customVideoTitel:e})}),(0,e.createElement)(H,null)),(0,e.createElement)("div",{className:"mediathek"===B?"block-none":""},(0,e.createElement)(r,{label:"Video Link Source",selected:M,__nextHasNoMarginBottom:!0,options:[{label:"Link",value:"link"},{label:"YouTube",value:"youtube"},{label:"Vimeo",value:"vimeo"}],onChange:e=>{g({selectedExternSourceType:e})}}),(0,e.createElement)("div",{className:["youtube","vimeo"].includes(M)?"":"block-none"},(0,e.createElement)(H,null),(0,e.createElement)(l,{label:__("Externes Cover Bild verwenden","bootscore"),checked:y,__nextHasNoMarginBottom:!0,onChange:e=>g({externesCoverImgAktiv:e})}),(0,e.createElement)(H,null),(0,e.createElement)(u,{label:__("Video ID","bootscore")+":",value:I,__nextHasNoMarginBottom:!0,type:"text",onChange:e=>g({externVideoId:e})})),(0,e.createElement)("div",{className:"link"===M?"":"block-none"},(0,e.createElement)(u,{label:__("Video URL","bootscore")+":",value:S,__nextHasNoMarginBottom:!0,type:"text",onChange:e=>g({externVideoUrl:e})}),(0,e.createElement)(u,{label:__("Video Mime Type","bootscore")+":",value:w,__nextHasNoMarginBottom:!0,type:"text",onChange:e=>g({externLinkMimeType:e})})))),(0,e.createElement)("div",{className:"editor-controls"},(0,e.createElement)("div",{className:"extern"===B?"block-none":""},(0,e.createElement)(v,null,(0,e.createElement)(p,{onSelect:e=>{let t;t=e.title?e.title:"kein Titel";const a={id:e.id,url:e.url,width:e.width,height:e.height,title:t,fileLength:e.fileLength,mimeType:e.mime,mediaIcon:e.icon};g({mediaVideoData:a})},allowedTypes:["video"],render:({open:t})=>(0,e.createElement)(d,{className:N?"editor-post-featured-image__preview":"editor-post-featured-image__toggle",onClick:t},!N.id&&__("Video","bootscore"),N.id&&(0,e.createElement)(i,null,(0,e.createElement)("div",{className:"videoBtnSelect"},(0,e.createElement)("img",{style:{height:"80px",width:"60px",padding:"10px"},alt:"Video Cover",src:N.mediaIcon}),(0,e.createElement)("p",null,N.title,(0,e.createElement)("br",null)," Länge: ",N.fileLength))))})),N.id&&(0,e.createElement)(v,null,(0,e.createElement)(d,{onClick:()=>g({mediaVideoData:{}}),isLink:!0,isDestructive:!0},__("Video entfernen","bootscore")))))),(0,e.createElement)(o,{title:__("Video Einstellungen","bootscore"),initialOpen:!0},(0,e.createElement)(H,null),(0,e.createElement)(l,{disabled:"extern"===B,label:__("Video muted","bootscore"),checked:x,__nextHasNoMarginBottom:!0,onChange:e=>(e=>{let t;t=!!e&&k,g({videoMuted:e,videoAutoPlay:t})})(e)}),(0,e.createElement)(l,{disabled:"extern"===B,label:__("Video loop","bootscore"),checked:_,__nextHasNoMarginBottom:!0,onChange:e=>g({videoLoop:e})}),(0,e.createElement)(l,{disabled:"extern"===B,label:__("Video controls","bootscore"),checked:C,__nextHasNoMarginBottom:!0,onChange:e=>g({videoControls:e})}),(0,e.createElement)(l,{disabled:"extern"===B,label:__("Video autoplay","bootscore"),checked:k,__nextHasNoMarginBottom:!0,onChange:e=>(e=>{let t;t=!!e||x,g({videoMuted:t,videoAutoPlay:e})})(e)}),(0,e.createElement)(H,null),(0,e.createElement)(u,{disabled:"extern"===B,label:__("Video Startzeit (sek)","bootscore")+":",value:parseInt(V),__nextHasNoMarginBottom:!0,min:0,type:"number",onChange:e=>g({videoStartTime:parseInt(e)})}))),(0,e.createElement)("div",{...D},(0,e.createElement)("div",{className:" video-item bg-white p-2"},(0,e.createElement)("div",{className:"video-cover"},T.id?(0,e.createElement)("img",{className:"img-fluid rounded",alt:"Video Carousel",src:`${T.url}`}):(0,e.createElement)("img",{className:"img-fluid rounded",alt:"Video Carousel",src:`${hummeltRestEditorObj.admin_url}assets/images/video-placeholder.jpg`})))))},save({attributes:t}){const{itemId:a,externesCoverImgAktiv:i,mediaData:o,videoMuted:l,videoControls:r,videoLoop:n,videoStartTime:d,videoAutoPlay:s,mediaVideoData:c,externLinkMimeType:m,selectedExternSourceType:u,externVideoId:p,externVideoUrl:v,selectedSourceType:g,videoTitelAktiv:b,customVideoTitel:h}=t;return(0,e.createElement)("div",{id:a,"data-title-aktiv":b,"data-item-id":a,"data-extern-cover-img-active":i,"data-media":JSON.stringify(o),"data-video":JSON.stringify(c),"data-extern-source-type":u,"data-extern-video-id":p,"data-extern-video-url":v,"data-source-type":g,"data-custom-title":h,"data-extern-mime":m,"data-muted":l,"data-controls":r,"data-video-loop":n,"data-start-time":parseInt(d),"data-auto-play":s})}})})();