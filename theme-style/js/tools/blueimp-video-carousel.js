async function loadThemeCss(src, id) {
    return new Promise((resolve, reject) => {
        // Prüfen, ob das Skript bereits geladen wurde
        if (document.getElementById(id)) {
            //  console.log(`Skript mit ID "${id}" ist bereits geladen.`);
            resolve(`CSS mit ID "${id}" wurde bereits geladen.`);
            return;
        }

        // Neues CSS-Tag erstellen
        const link = document.createElement('link');
        link.href = src;
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.onload = () => resolve(`CSS ${src} wurde erfolgreich geladen.`);
        link.onerror = () => reject(new Error(`CSS ${src} konnte nicht geladen werden.`));
        document.head.appendChild(link);
    });
}

async function loadScript(src, id) {
    return new Promise((resolve, reject) => {
        // Prüfen, ob das Skript bereits geladen wurde
        if (document.getElementById(id)) {
            //  console.log(`Skript mit ID "${id}" ist bereits geladen.`);
            resolve(`Skript mit ID "${id}" wurde bereits geladen.`);
            return;
        }

        // Neues Skript-Tag erstellen
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.type = 'text/javascript';
        script.onload = () => resolve(`Skript ${src} wurde erfolgreich geladen.`);
        script.onerror = () => reject(new Error(`Skript ${src} konnte nicht geladen werden.`));
        //document.head.appendChild(script);
        document.body.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', initializeVideoCarouselIfNeeded);
let $ = jQuery;

async function initializeVideoCarouselIfNeeded() {
    if (document.querySelector('.wp-block-hupa-video-carousel-container')) {
        //console.log('Video Carousel gefunden, lade Skript...');
        try {
            await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/blueimp/blueimp-gallery.min.js`, 'theme-v3-blueimp-gallery');
            await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/blueimp/blueimp-gallery-vimeo.js`, 'theme-v3-blueimp-vimeo');
            await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/blueimp/blueimp-gallery-youtube.js`, 'theme-v3-blueimp-youtube');
            await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/blueimp/blueimp-helper.js`, 'theme-v3-blueimp-helper');
            theme_video();
            // console.log('Video Carousel Skript wurde geladen.');
        } catch (error) {
            console.error('Fehler beim Laden des Skripts:', error);
        }
    }
    if (document.querySelector('.hupa-lightbox')) {
        await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/blueimp/blueimp-gallery.min.js`, 'theme-v3-blueimp-gallery');
        // console.log('Gallery Skript wurde geladen.');
        blueimp_gallery()
    }
    if (document.querySelector('.gallery-lightbox')) {
        await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/blueimp/blueimp-gallery.min.js`, 'theme-v3-blueimp-gallery');
        blueimp_wordpress_gallery()
    }
    if (document.querySelector('.theme-slider') || document.querySelector('.thumbnail-slider')) {
        await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/splide.min.js`, 'theme-v3-splide-js');
    }
    if (document.querySelector('.theme-slider')) {
        theme_splide_gallery();
    }
    if (document.querySelector('.thumbnail-slider')) {
        theme_splide_thumbnail_gallery();
    }
    if (document.querySelector('.with-lightbox')) {
        await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/blueimp/blueimp-gallery.min.js`, 'theme-v3-blueimp-gallery');
    }
    if (document.querySelector('.masonry-grid')) {
        await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/imagesloaded.pkgd.min.js`, 'theme-v3-gallery-imagesloaded');
        await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/masonry.pkgd.min.js`, 'theme-v3-gallery-masonry');
    }
    if (document.querySelector('.gallery-animation')) {
        await loadThemeCss(`${hummeltPublicObj.theme_url}/theme-style/css/animate.css`, 'hummelt-theme-v3-animate-style');
        await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/wow.min.js`, 'hummelt-theme-v3-wow');
        await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/scrollspy.js`, 'hummelt-theme-v3-animate-scrollspy');
    }

    if (document.querySelectorAll('.theme-gallery-wrapper')) {
        theme_gallery_init();
    }

}

function blueimp_wordpress_gallery() {
    let gallery = document.querySelectorAll('.gallery-lightbox');
    let nodes = Array.prototype.slice.call(gallery, 0);

    nodes.forEach(function (node) {

        let containerRand;
        let images = node.querySelectorAll('.wp-block-image')
        let imageNote = Array.prototype.slice.call(images, 0);
        if (node.classList.contains('lightbox-single')) {
            imageNote.forEach(function (gal) {
                gal.classList.remove('hupa-lightbox')
                if (node.classList.contains('lightbox-single')) {
                    gal.classList.remove('lightbox-single')
                }

                let link = gal.querySelector('a');
                let links = gal.querySelectorAll('a');

                if (link) {
                    let rand = get_rand_id();
                    let layout = blueimp_single_layout(rand);
                    document.body.insertAdjacentHTML('beforeend', layout);
                    link.addEventListener("click", function (e) {
                        let options = {
                            container: '#single-' + rand,
                            index: 0,
                            event: e,
                            enableKeyboardNavigation: false,
                            emulateTouchEvents: false,
                            fullscreen: false,
                            displayTransition: false,
                            toggleControlsOnSlideClick: false,
                        }
                        blueimp.Gallery(links, options)
                        e.preventDefault();
                    })
                }

            })
        } else {
            let rand = get_rand_id();
            if (!containerRand) {
                let layout = blueimp_gallery_layout(rand);
                document.body.insertAdjacentHTML('beforeend', layout);
                containerRand = rand;
            }
            let linkNotes = [];
            imageNote.forEach(function (gal) {
                let img = gal.querySelector('img');
                let aHref = gal.querySelector('a')
                if (aHref) {
                    if (img.hasAttribute('title')) {
                        aHref.setAttribute('title', img.getAttribute('title'))
                    }
                    linkNotes.push(aHref)
                }
            })
            imageNote.forEach(function (gal) {
                let aHref = gal.querySelector('a')
                aHref.addEventListener("click", function (e) {
                    let target = e.target
                    let currentLink = target.src ? target.parentNode : target;
                    let gallery = document.getElementById('slider-' + containerRand);
                    if (gallery) {
                        let options = {
                            container: '#slider-' + containerRand,
                            index: currentLink,
                            event: e,
                            toggleControlsOnSlideClick: false,
                        }
                        blueimp.Gallery(linkNotes, options)
                    }
                    e.preventDefault();
                })
            })
        }
    })
}


function blueimp_gallery() {
    let lightbox = document.querySelectorAll('.hupa-lightbox');
    let nodes = Array.prototype.slice.call(lightbox, 0);
    let linkNotes = [];
    let containerRand;
    nodes.forEach(function (node) {
        let rand = get_rand_id();
        let links = node.querySelectorAll('a')
        let options = {};
        let link = node.querySelector('a')
        let img = node.querySelector('img')
        if (node.classList.contains('lightbox-single')) {
            let layout = blueimp_single_layout(rand);
            document.body.insertAdjacentHTML('beforeend', layout);
            if (link) {
                if (img && img.hasAttribute('title')) {
                    link.setAttribute('title', img.getAttribute('title'))
                }
                link.addEventListener("click", function (e) {
                    options = {
                        container: '#single-' + rand,
                        index: 0,
                        event: e,
                        enableKeyboardNavigation: false,
                        emulateTouchEvents: false,
                        fullscreen: false,
                        displayTransition: false,
                        toggleControlsOnSlideClick: false,
                    }
                    blueimp.Gallery(links, options)
                    e.preventDefault();
                })
            }
        } else {
            if (!containerRand && !document.querySelector('.slider-gallery')) {
                let layout = blueimp_gallery_layout(rand);
                document.body.insertAdjacentHTML('beforeend', layout);
                containerRand = rand;
            }
            if (link) {
                link.setAttribute('data-container', containerRand);
                if (img && img.hasAttribute('title')) {
                    link.setAttribute('title', img.getAttribute('title'))
                }
                //  link.classList.add('gallery-slider');
                linkNotes.push(link)
            }
        }
    })

    linkNotes.forEach(function (link) {
        link.addEventListener("click", function (e) {
            let target = e.target
            let currentLink = target.src ? target.parentNode : target;

            let container = link.getAttribute('data-container');
            let gallery = document.getElementById('slider-' + container);
            if (gallery) {
                let options = {
                    container: '#slider-' + container,
                    index: currentLink,
                    event: e,
                    toggleControlsOnSlideClick: false,
                }
                blueimp.Gallery(linkNotes, options)
            }
            e.preventDefault();
        })
    })
}

function theme_video() {
    let container = document.querySelectorAll('.wp-block-hupa-video-carousel-container');
    let nodes = Array.prototype.slice.call(container, 0);

    nodes.forEach(function (node) {
        let items = node.querySelectorAll('.wp-block-hupa-video-carousel-item');
        let carousel = node.querySelector('.blueimp-gallery-carousel')

        let itemNodeArr = [];
        let itemCount = items.length;
        let itemNodes = Array.prototype.slice.call(items, 0);

        let startSlideshow = carousel.getAttribute('data-auto-slide');
        let continuous = carousel.getAttribute('data-continuous');
        let slideshowInterval = carousel.getAttribute('data-interval');
        let toggleControlsOnEnter = carousel.getAttribute('data-toggle-control-enter');
        let toggleControlsOnSlideClick = carousel.getAttribute('data-toggle-control-slide');
        let toggleSlideshowOnSpace = carousel.getAttribute('data-toggle-control-space');
        let emulateTouchEvents = carousel.getAttribute('data-emulate-touch');
        let stopTouchEventsPropagation = carousel.getAttribute('data-stop-touch');


        itemNodes.forEach(function (itemNode) {

            let videoObject = {};
            let itemId = itemNode.getAttribute('data-item-id');
            let externSrcType = itemNode.getAttribute('data-extern-source-type') || '';
            let sourceType = itemNode.getAttribute('data-source-type') || '';
            let externVideoId = itemNode.getAttribute('data-extern-video-id') || '';
            let externVideoUrl = itemNode.getAttribute('data-extern-video-url') || '';
            let exterCoverImageActive = itemNode.getAttribute('data-extern-cover-img-active');
            let externMimeType = itemNode.getAttribute('data-extern-mime') || '';
            let videoMuted = itemNode.getAttribute('data-muted');
            let videoControls = itemNode.getAttribute('data-controls');
            let videoStartTime = itemNode.getAttribute('data-start-time');
            let videoAutoPlay = itemNode.getAttribute('data-auto-play');
            let videoLoop = itemNode.getAttribute('data-video-loop')

            let coverMedia;
            if (itemNode.getAttribute('data-media')) {
                coverMedia = JSON.parse(itemNode.getAttribute('data-media'));
            }
            let videoMedia;
            if (itemNode.getAttribute('data-video')) {
                videoMedia = JSON.parse(itemNode.getAttribute('data-video'));
            }
            let title;
            let titleActive = itemNode.getAttribute('data-title-aktiv');
            if (titleActive === 'true') {
                title = videoMedia.title;
            } else {
                title = itemNode.getAttribute('data-custom-title');
            }
            videoObject.title = title;
            let coverUrl;
            if (coverMedia.url) {
                coverUrl = coverMedia.url;
            } else {
                coverUrl = `${hummeltPublicObj.theme_url}/admin/assets/images/video-placeholder.jpg`;
            }

            if (sourceType === 'extern') {
                switch (externSrcType) {
                    case 'youtube':
                        let autoplay;
                        let muted;
                        //href: 'https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&start=10'
                        if (videoAutoPlay === "true") {

                            autoplay = 1;
                        } else {
                            autoplay = 0;
                        }
                        if (videoMuted === "true") {
                            muted = 1;
                        } else {
                            muted = 0;
                        }

                        videoObject.video_type = 'youtube';
                        videoObject.youtube = externVideoId;
                        videoObject.type = 'text/html';
                        videoObject.href = `https://www.youtube.com/watch?v=${externVideoId}`;
                        if (exterCoverImageActive === 'true') {
                            videoObject.poster = `https://img.youtube.com/vi/${externVideoId}/maxresdefault.jpg`;
                        } else {
                            videoObject.poster = coverUrl;
                        }
                        break;
                    case 'vimeo':
                        videoObject.video_type = 'vimeo';
                        videoObject.vimeo = externVideoId;
                        videoObject.type = 'text/html';
                        videoObject.href = `https://vimeo.com/${externVideoId}`;
                        if (exterCoverImageActive === 'true') {
                            videoObject.poster = `https://secure-b.vimeocdn.com/ts/${externVideoId}.jpg`;
                        } else {
                            videoObject.poster = coverUrl;
                        }
                        break;
                    case 'url':
                        videoObject.video_type = 'url';
                        videoObject.type = externMimeType;
                        videoObject.href = externVideoUrl;
                        break;
                }
            } else {
                videoObject.type = videoMedia.mimeType;
                videoObject.poster = coverUrl;
                videoObject.href = videoMedia.url
                videoObject.video_type = 'media';
            }

            videoObject.muted = videoMuted;
            videoObject.controls = videoControls;
            videoObject.currentTime = parseInt(videoStartTime);
            videoObject.autoPlay = videoAutoPlay;
            videoObject.videoLoop = videoLoop;
            itemNodeArr.push(videoObject);
            document.getElementById(itemId).remove();


        })

        if (itemNodeArr) {
            blueimp.Gallery(
                itemNodeArr, {
                    container: carousel,
                    carousel: true,
                    videoPlaysInline: true,
                    videoCoverClass: 'video-cover toggle',
                    startSlideshow: startSlideshow === 'true',
                    slideshowInterval: parseInt(slideshowInterval),
                    toggleControlsOnEnter: (toggleControlsOnEnter === 'true'),
                    toggleControlsOnSlideClick: (toggleControlsOnSlideClick === 'true'),
                    toggleSlideshowOnSpace: (toggleSlideshowOnSpace === 'true'),
                    emulateTouchEvents: (emulateTouchEvents === 'true'),
                    stopTouchEventsPropagation: (stopTouchEventsPropagation === 'true'),

                    onslide: function (index, slide) {
                        if ((continuous === 'false') && (index + 1) === itemCount) {
                            this.pause()
                        }
                        const video = slide.querySelector('video');
                        let notPlay = ['youtube', 'vimeo'];
                        if (!notPlay.includes(itemNodeArr[index]['video_type'])) {
                            video.pause()
                            if (video) {
                                video.currentTime = itemNodeArr[index]['currentTime'] || 0;
                                video.muted = itemNodeArr[index].muted === 'true'  // Mute einstellen
                                if (itemNodeArr[index].controls) {
                                    video.setAttribute('controls', 'true'); // Controls aktivieren
                                } else {
                                    video.removeAttribute('controls'); // Controls deaktivieren
                                }
                            }
                            if (itemNodeArr[index]['autoPlay'] === 'true') {
                                video.play().catch((error) => {
                                    console.warn('Das erste Video konnte nicht automatisch abgespielt werden:', error);
                                });
                            }
                            video.loop = itemNodeArr[index]['videoLoop'] === 'true';
                        }

                        const iframe = slide.querySelector('iframe');
                        if (iframe) {
                            iframe.src += "&autoplay=1"; // Autoplay aktivieren
                        }
                    },
                    onslideend: function (index, slide) {
                        const iframe = slide.querySelector('iframe');
                        if (iframe) {
                            iframe.src = ""; // Video stoppen
                        }
                    }

                })
        }
    })
}

function theme_splide_gallery() {
    let container = document.querySelectorAll('.theme-slider');
    let nodes = Array.prototype.slice.call(container, 0);
    nodes.forEach(function (node) {
        let options = get_splideJs_options(node.getAttribute('data-slider'))
        if (options) {
            let target = node.querySelector('.slideshow');
            let containerRand;
            if (options.pagination) {
                node.style.paddingBottom = '1.5em';
            }
            let focus = node.getAttribute('data-focus') || '0';
            let lightBoxSingle = node.getAttribute('data-lightbox-single');
            lightBoxSingle = lightBoxSingle === 'true';
            let focusActive = node.getAttribute('data-focus-active');
            focusActive = focusActive === 'true';

            splideJsInit(target, options, focus, focusActive)
            if (target.classList.contains('with-lightbox')) {
                let rand = get_rand_id();
                let layout;
                let element;
                if (!containerRand) {
                    if (lightBoxSingle) {
                        layout = blueimp_single_layout(rand);
                    } else {
                        layout = blueimp_gallery_layout(rand, false);
                    }
                    document.body.insertAdjacentHTML('beforeend', layout);
                    containerRand = rand;
                }
                if (lightBoxSingle) {
                    element = `single-${containerRand}`
                } else {
                    element = `slider-${containerRand}`
                }
                let linkNotes = target.querySelectorAll('a');

                let link = target.src ? target.parentNode : target;
                linkNotes.forEach(function (image) {
                    image.addEventListener("click", function (e) {

                        let eventTarget = e.target

                        let gallery = document.getElementById(element);
                        if (gallery) {
                            let options;
                            if (lightBoxSingle) {
                                options = {
                                    container: '#single-' + containerRand,
                                    index: this,
                                    event: e,
                                    enableKeyboardNavigation: false,
                                    emulateTouchEvents: false,
                                    fullscreen: false,
                                    displayTransition: false,
                                    toggleControlsOnSlideClick: false,
                                }
                                blueimp.Gallery([image], options)
                            } else {
                                options = {
                                    container: '#slider-' + containerRand,
                                    index: this,
                                    event: e,
                                    toggleControlsOnSlideClick: false,
                                }
                                blueimp.Gallery(linkNotes, options)
                            }
                        }
                        e.preventDefault();
                    })
                })
            }
        }
    })
}

function theme_splide_thumbnail_gallery() {
    let container = document.querySelectorAll('.thumbnail-slider');
    let nodes = Array.prototype.slice.call(container, 0);
    nodes.forEach(function (node) {
        let containerRand;
        let options = get_splideJs_options(node.getAttribute('data-slider'));
        let focus = node.getAttribute('data-focus');
        let lightBoxSingle = node.getAttribute('data-lightbox-single');
        lightBoxSingle = lightBoxSingle === 'true';
        let focusActive = node.getAttribute('data-focus-active');
        focusActive = focusActive === 'true';
        let splide = node.querySelector('.thumbnails');
        let carousel = node.querySelector('.carousel-splide');
        if (splide && carousel && options) {
            splideThumbnailJsInit(splide, carousel, options, focus, focusActive)
            if (carousel.classList.contains('with-lightbox')) {
                let rand = get_rand_id();
                let layout;
                let element;
                if (!containerRand) {
                    if (lightBoxSingle) {
                        layout = blueimp_single_layout(rand);

                    } else {
                        layout = blueimp_gallery_layout(rand);
                    }

                    document.body.insertAdjacentHTML('beforeend', layout);
                    containerRand = rand;
                }
                if (lightBoxSingle) {
                    element = `single-${containerRand}`
                } else {
                    element = `slider-${containerRand}`
                }
                let linkNotes = carousel.querySelectorAll('a');
                linkNotes.forEach(function (image) {
                    image.addEventListener("click", function (e) {
                        let target = e.target
                        let gallery = document.getElementById(element);
                        let options;
                        if (gallery) {
                            if (lightBoxSingle) {
                                options = {
                                    container: '#single-' + containerRand,
                                    index: this,
                                    event: e,
                                    enableKeyboardNavigation: false,
                                    emulateTouchEvents: false,
                                    fullscreen: false,
                                    displayTransition: false,
                                    toggleControlsOnSlideClick: false,
                                }
                                blueimp.Gallery([image], options)
                            } else {
                                options = {
                                    container: '#slider-' + containerRand,
                                    index: this,
                                    event: e,
                                    toggleControlsOnSlideClick: false,
                                }
                                blueimp.Gallery(linkNotes, options)
                            }
                        }
                        e.preventDefault();
                    })
                })
            }
        }
    })
}

function get_splideJs_options(id) {
    let sliderOptions = hummeltPublicObj.theme_slider;
    for (let i = 0; i < sliderOptions.length; i++) {
        if (sliderOptions[i]['id'] === id) {
            return sliderOptions[i];
        }
    }
    return false;
}

function splideJsInit(target, splideData, focus, focusActive) {

    let options = {
        type: splideData.type,
        perPage: parseInt(splideData.perPage),
        perMove: parseInt(splideData.perMove),
        pagination: splideData.pagination,
        fixedWidth: parseInt(splideData.fixedWidth),
        fixedHeight: parseInt(splideData.fixedHeight),
        //autoWidth: true,
        // autoHeight: false,
        //focus: focus,
        padding: splideData.padding, //{left: '1rem', right: '1rem'},
        arrows: splideData.arrows,
        cover: splideData.cover,
        lazyLoad: splideData.lazyLoad,
        gap: splideData.gap,
        height: splideData.height,
        width: splideData.width,
        heightRatio: 0.5,
        preloadPages: splideData.preloadPages,
        rewind: splideData.rewind,
        pauseOnHover: splideData.pauseOnHover,
        trimSpace: splideData.trimSpace,
        interval: splideData.interval,
        speed: splideData.speed,
        rewindSpeed: splideData.rewindSpeed,
        flickPower: splideData.flickPower,
        autoplay: splideData.autoplay,
        keyboard: splideData.keyboard,
        pauseOnFocus: splideData.pauseOnFocus,
        drag: splideData.drag,
        breakpoints: splideData.breakpoints
    }

    if (focusActive) {
        options.focus = focus
    }

    let splide = new Splide(target, options);
    splide.mount();
}

function splideThumbnailJsInit(target, carousel, splideData, focus, focusActive) {

    let options = {
        type: splideData.type,
        perPage: parseInt(splideData.perPage),
        perMove: parseInt(splideData.perMove),
        pagination: splideData.pagination,
        fixedWidth: parseInt(splideData.fixedWidth),
        fixedHeight: parseInt(splideData.fixedHeight),
        isNavigation: true,
        autoWidth: false,
        autoHeight: false,
        padding: splideData.padding, //{left: '1rem', right: '1rem'},
        arrows: splideData.arrows,
        cover: splideData.cover,
        lazyLoad: splideData.lazyLoad,
        gap: splideData.gap,
        //focus: focus,
        height: splideData.height,
        width: splideData.width,
        //   heightRatio: 0.5,
        preloadPages: splideData.preloadPages,
        rewind: splideData.rewind,
        pauseOnHover: splideData.pauseOnHover,
        trimSpace: splideData.trimSpace,
        // omitEnd: true,
        interval: splideData.interval,
        speed: splideData.speed,
        rewindSpeed: splideData.rewindSpeed,
        flickPower: splideData.flickPower,
        autoplay: splideData.autoplay,
        keyboard: splideData.keyboard,
        pauseOnFocus: splideData.pauseOnFocus,
        drag: splideData.drag,
        breakpoints: splideData.breakpoints
    }
    if (focusActive) {
        options.focus = focus;
    }
    let thumbnail = new Splide(target, options);
    let main = new Splide(carousel, {
        type: 'fade',
        lazyLoad: 'nearby',
        rewind: true,
        pagination: false,
        arrows: false,
        heightRatio: 0.5,
    });
    main.sync(thumbnail);
    main.mount();

    thumbnail.mount()
}

function theme_gallery_init() {
    let themeGallery = document.querySelectorAll('.theme-gallery-wrapper');
    if (themeGallery.length !== 0) {

        let nodes = Array.prototype.slice.call(themeGallery, 0);
        nodes.forEach(function (node) {
            let options = {
                lightboxActive: node.classList.contains('with-lightbox'),
                lightBoxSingle: node.getAttribute('data-lightbox-single') === 'true',
                masonryActive: node.classList.contains('masonry-grid'),
                animationActive: node.getAttribute('data-animation-active') === 'true',
                animationType: node.getAttribute('data-animation-type'),
                animationRepeat: node.getAttribute('data-animation-repeat') === 'true'
            }
            let gridTargets = node.querySelectorAll('.grid-item');
             galleryLightBoxAnimation(options, gridTargets, node);


            const imageObserver = new IntersectionObserver((entries, imgObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target
                        if (options.masonryActive) {
                            imgLoaded(gridTargets)
                        }
                        newImageSrc(lazyImage).then()

                        imgObserver.unobserve(lazyImage);
                    }
                })
            });

            const imgArr = node.querySelectorAll('img.lazy-image');
            if (imgArr.length !== 0) {
                imgArr.forEach((img) => {
                    imageObserver.observe(img);
                });
            }
        })
    }
}

async function newImageSrc(image) {
    image.src = image.dataset.src;
    await new Promise((resolve) => {
        image.onload = resolve;
    });
    image.classList.remove("lazy-image");
    image.classList.add('image-loaded')
}


function imgLoaded(entry) {
    let builderSelectorGrid = document.querySelectorAll(".theme-gallery");
    if (builderSelectorGrid) {
        let msnry;
        let gridNodes = Array.prototype.slice.call(builderSelectorGrid, 0);
        gridNodes.forEach(function (gridNodes) {
            imagesLoaded(gridNodes, function () {
                gridNodes.querySelector('.grid-item').classList.remove('img-load-wait')
                msnry = new Masonry(gridNodes, {
                    itemSelector: '.grid-item',
                    percentPosition: true
                });
            });
        });
        //serve = false;

    }
}

function galleryLightBoxAnimation(options, targets, galleryNode) {
    let containerRand;
    let lightboxElement;
    let linkNotes = galleryNode.querySelectorAll('a');
    if (options.lightboxActive) {
        let rand = get_rand_id();
        let layout;


        if (!containerRand) {
            if (options.lightBoxSingle) {
                layout = blueimp_single_layout(rand);

            } else {
                layout = blueimp_gallery_layout(rand);
            }
            document.body.insertAdjacentHTML('beforeend', layout);
            containerRand = rand;

        }
        if (options.lightBoxSingle) {
            lightboxElement = `single-${containerRand}`
        } else {
            lightboxElement = `slider-${containerRand}`
        }
    }

    targets.forEach(function (node) {
        if (options.animationActive) {
            node.classList.add('wow');
            node.classList.add('animate__animated')
            node.classList.add('animate__' + options.animationType)
        }

        if (options.lightboxActive) {
            node.querySelector('a').addEventListener("click", function (e) {
                let gallery = document.getElementById(lightboxElement);
                let lightboxOptions;
                let image = node.querySelector('a');
                if (gallery) {
                    if (options.lightBoxSingle) {
                        lightboxOptions = {
                            container: '#single-' + containerRand,
                            index: this,
                            event: e,
                            enableKeyboardNavigation: false,
                            emulateTouchEvents: false,
                            fullscreen: false,
                            displayTransition: false,
                            toggleControlsOnSlideClick: false,
                        }
                        blueimp.Gallery([image], lightboxOptions)
                    } else {
                        lightboxOptions = {
                            container: '#slider-' + containerRand,
                            index: this,
                            event: e,
                            toggleControlsOnSlideClick: false,
                        }
                        blueimp.Gallery(linkNotes, lightboxOptions)
                    }
                }
                e.preventDefault();
            })
        }

    })

    if (options.animationActive) {
        WOW.prototype.addBox = function (element) {
            this.boxes.push(element);
        };
        let appWow = new WOW(
            {
                boxClass: 'wow',
                animateClass: 'animate__animated',
                offset: 0,
                callback: function (box) {

                },
                mobile: true,
                live: true
            }
        )

        appWow.init();

        $('.wow').on('scrollSpy:exit', function (e) {
            if (!options.animationRepeat) {
                return false;
            }
            $(this).css({
                'visibility': 'hidden',
                'animation-name': 'none'
            }).removeClass('animate__animated');
            appWow.addBox(this);
        }).scrollSpy();
    }
}

function blueimp_gallery_layout(id, showOl = true) {
    return `<div id="slider-${id}" class="slider-gallery blueimp-gallery blueimp-gallery-controls"
  aria-label="image gallery"
  aria-modal="true"
  role="dialog"
>
  <div class="slides" aria-live="polite"></div>
  <h3 class="title text-light fw-normal fs-4"></h3>
  <a
    class="prev"
    aria-controls="blueimp-gallery"
    aria-label="previous slide"
    aria-keyshortcuts="ArrowLeft"
  ></a>
  <a
    class="next"
    aria-controls="blueimp-gallery"
    aria-label="next slide"
    aria-keyshortcuts="ArrowRight"
  ></a>
  <a
    class="close"
    aria-controls="blueimp-gallery"
    aria-label="close"
    aria-keyshortcuts="Escape"
  ></a>
  <a
    class="play-pause"
    aria-controls="blueimp-gallery"
    aria-label="play slideshow"
    aria-keyshortcuts="Space"
    aria-pressed="false"
    role="button"
  ></a>
  <ol class="indicator ${!showOl ? 'd-none' : ''}"></ol>
</div>`;
}

function blueimp_single_layout(id) {
    return `<div id="single-${id}" 
 class="blueimp-gallery blueimp-gallery-controls"
 aria-label="image gallery"
 aria-modal="true"
 role="dialog">
<div class="slides" aria-live="polite"></div>
<h3 class="title text-light fw-normal fs-4"></h3>
<a class="close"
   aria-controls="blueimp-gallery"
   aria-label="close"
   aria-keyshortcuts="Escape">
</a>
</div>`;
}

function get_rand_id() {
    return Math.random().toString(36).slice(4, 12);
}

