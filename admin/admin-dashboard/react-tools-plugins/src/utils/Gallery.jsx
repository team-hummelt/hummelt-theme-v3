import React, {useEffect, useRef} from 'react';

import blueimpGallery from 'blueimp-gallery';
import 'blueimp-gallery/js/blueimp-gallery-indicator.js';
//import 'blueimp-gallery/js/blueimp-helper.js';
//import 'blueimp-gallery/js/blueimp-gallery-fullscreen.js';

const Gallery = ({images, activeId, callback}) => {
    const galleryContainerRef = useRef(null);

    const openGallery = (index) => {
        blueimpGallery(
            images.map((img) => ({
                href: img.src,
                title: img.title,
            })),
            {
                container: galleryContainerRef.current,
                /*startSlideshow: false,
                enableKeyboardNavigation: false,
                emulateTouchEvents: false,
                fullscreen: false,
                displayTransition: false,*/
                toggleControlsOnSlideClick: false,
                index,
                indicator: true,

            }
        );
    };

    return (
        <div>
            {/* Container für die Blueimp-Gallery */}
            <div id="blueimp-gallery" ref={galleryContainerRef} role="dialog"
                 className="blueimp-gallery blueimp-gallery-controls">
                <div className="slides"></div>
                <h3 className="title"></h3>
                <a className="prev"></a>
                <a className="next"></a>
                <a className="close"></a>
                <a className="play-pause"></a>
                <ol className="indicator"></ol>
            </div>

            {/* Miniaturbilder (Thumbnails) */}
            <div className="thumbnails row g-2">
                {images.map((img, index) => (
                    <div className="col-xl-2 col-lg-4 col-md-6 col-12">
                        <div className={`d-flex p-1 justify-content-center rounded border flex-wrap ${activeId === img.id ? 'border-danger' : ''}`}>
                            <img
                                key={index}
                                src={img.src}
                                alt={img.title}
                                className={`img-fluid rounded cursor-pointer`}
                                onClick={() => openGallery(index)}
                            />
                            <div onClick={() => callback(img.id)}
                                className="small fw-semibold text-truncate text-primary mt-1 cursor-pointer">
                                {img.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;