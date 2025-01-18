/*--------------------------------------------------------------
Theme JS
--------------------------------------------------------------*/

jQuery(function ($) {

    const carousels = document.querySelectorAll('.carousel');
    if (carousels) {
        carousels.forEach((carousel) => {
            const images = carousel.querySelectorAll('img');
            const loader = carousel.previousElementSibling;
            let loadedImages = 0;
            images.forEach((image) => {
                image.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        // Alle Bilder sind geladen, entferne den Loader
                        loader.style.display = 'none';
                        carousel.style.display = 'block';
                    }
                });

                // Falls das Bild bereits aus dem Cache geladen ist
                if (image.complete) {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        loader.style.display = 'none';
                        carousel.style.display = 'block';
                    }
                }
            });

        });
    }

    document.addEventListener('shown.bs.collapse', (event) => {
        const accordionItem = event.target.closest('.accordion-item');
        if (accordionItem && accordionItem.dataset.scrollToItem === 'true') {
            const offset = parseInt(accordionItem.dataset.scrollOffset, 10) || 0;
            const rect = accordionItem.getBoundingClientRect();
            const scrollTop = scrollY + rect.top - offset;

            window.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        }
    });

    // Close offcanvas on click a, keep .dropdown-menu open (see https://github.com/bootscore/bootscore/discussions/347)
    $('.offcanvas a:not(.dropdown-toggle, .remove_from_cart_button)').on('click', function () {
        $('.offcanvas').offcanvas('hide');
    });

    // Searchform focus
    $('#collapse-search').on('shown.bs.collapse', function () {
        $('.top-nav-search input:first-of-type').trigger('focus');
    });

    // Close collapse if click outside searchform
    $(document).on('click', function (event) {
        if ($(event.target).closest('#collapse-search').length === 0) {
            $('#collapse-search').collapse('hide');
        }
    });

    // Dropdown menu animation
    $('.dropdown').on('show.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().addClass('dropdown-menu-slide');
    });

    // Scroll to top Button
    $(window).on('scroll', function () {
        let scroll = $(window).scrollTop();
        if (scroll > 400) {
            $('.top-button').addClass('visible');
        } else {
            $('.top-button').removeClass('visible');
        }
    });

    let lastStateScroll = null; // Merkt sich den letzten Zustand (kleiner/größer als Schwelle)
    const thresholdScroll = 400; // Die Schwelle für den Scrollwert
    const toleranceScroll = 30; // Schwellenzone von ±10 Pixel
    let navbarRoot = $('.navbar-root');
    $(window).on('scroll', function () {
        let windowWidth = $(window).width();
        let scroll = $(window).scrollTop();
        if (windowWidth > parseInt(hummeltPublicObj.logo.logo_breakpoint)) {
            let navImg = $('.navbar-menu-image');
            let bgNav = $('.bg-navbar');

            if (scroll > thresholdScroll + toleranceScroll && lastStateScroll !== 'small') {
                // Zustand wechseln: Bild kleiner machen
                navImg.stop().css({
                    width: `${hummeltPublicObj.logo.logo_size_scroll}px`
                });
                bgNav.addClass('header-scroll')
                bgNav.stop().css({
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem'
                });
                lastStateScroll = 'small';
            } else if (scroll < thresholdScroll - toleranceScroll && lastStateScroll !== 'large') {
                // Zustand wechseln: Bild größer machen
                navImg.stop().css({
                    width: `${hummeltPublicObj.logo.logo_size}px`
                });
                bgNav.removeClass('header-scroll')
                bgNav.stop().css({
                    paddingTop: '1rem',
                    paddingBottom: '1rem'
                });
                lastStateScroll = 'large';
            }
        }
    });

    function updateImageSizeBasedOnWidth() {
        let windowWidth = $(window).width(); // Aktuelle Fensterbreite
        let navImg = $('.navbar-menu-image');
        let bgNav = $('.bg-navbar');

        // Schwellenwerte und Toleranz
        const threshold = parseInt(hummeltPublicObj.logo.logo_breakpoint);
        const tolerance = 20;

        if (windowWidth > threshold + tolerance) {
            // Breite größer als Schwelle
            navImg.stop().css({
                width: `${hummeltPublicObj.logo.logo_size}px`
            });
            bgNav.removeClass('resize-small')
            bgNav.stop().css({
                paddingTop: '1rem',
                paddingBottom: '1rem'
            });
        } else if (windowWidth < threshold - tolerance) {
            // Breite kleiner als Schwelle
            navImg.stop().css({
                width: `${hummeltPublicObj.logo.logo_size_mobil}px`
            });
            bgNav.addClass('resize-small')
            bgNav.stop().css({
                paddingTop: '0.25rem',
                paddingBottom: '0.25rem'
            });
        }
        let width = document.getElementById('masthead').getBoundingClientRect().width;
        let leftBox;
        let rightBox
        leftBox = $('.left-box');
        rightBox = $('.right-box');

        let w = 0;
        if (leftBox.length !== 0) {
            if (width > 1400) {
                w = (width - 1332) / 2 + 30
                leftBox.css('marginLeft', (w) + 'px')
            }
            if (width < 1400 && width > 1200) {
                w = (width - 1152) / 2 + 30
                leftBox.css('marginLeft', (w) + 'px')
            }
        }
        if (rightBox.length !== 0) {
            if (width > 1400) {
                w = (width - 1332) / 2 + 30
                rightBox.css('marginRight', w + 'px')
            }
            if (width < 1400 && width > 1200) {
                w = (width - 1152) / 2 + 30
                rightBox.css('marginRight', w + 'px')
            }
        }

        let content = $('.site-content');
        if (width < 1400) {
            content.addClass('page-mobil')
        } else {
            content.removeClass('page-mobil')
        }

        let containerWidth = $('.container-width');
        if (containerWidth.length !== 0) {
            if (width <= 1199) {
                containerWidth.addClass('container');
            } else {
                containerWidth.removeClass('container')
            }
        }

    }

    let resizeTimeout;
    $(window).on('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            updateImageSizeBasedOnWidth();
        }, 500); // 100ms Verzögerung
    });

    updateImageSizeBasedOnWidth();

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
            document.head.appendChild(script);
            //document.body.appendChild(script);
        });
    }


    async function loadCss(src, id) {
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

    let appParallaxOption = $('.jarallax');

    let themeAnimate = $('.theme-wow-animation');

    initializeAnimateIfNeeded().then()

    async function initializeAnimateIfNeeded() {
        if (appParallaxOption.length !== 0) {
            try {
                let jarallax = `${hummeltPublicObj.theme_url}/theme-style/js/tools/jarallax.min.js`;
                await loadScript(jarallax, 'hummelt-theme-v3-jarallax');
                theme_jarallax();
            } catch (error) {
                console.error('Fehler beim Laden des Skripts:', error);
            }
        }
        if (themeAnimate.length !== 0) {
            try {
                let aniCssUrl = `${hummeltPublicObj.theme_url}/theme-style/css/animate.css`;
                await loadCss(aniCssUrl, 'hummelt-theme-v3-animate-style');
            } catch (error) {
                console.error('Fehler beim Laden des Skripts:', error);
            }
            try {
                let wowUrl = `${hummeltPublicObj.theme_url}/theme-style/js/tools/wow.min.js`;
                await loadScript(wowUrl, 'hummelt-theme-v3-wow');
            } catch (error) {
                console.error('Fehler beim Laden des Skripts:', error);
            }
            try {
                let scrollspyUrl = `${hummeltPublicObj.theme_url}/theme-style/js/tools/scrollspy.js`;
                await loadScript(scrollspyUrl, 'hummelt-theme-v3-animate-scrollspy');
            } catch (error) {
                console.error('Fehler beim Laden des Skripts:', error);
            }
            theme_animate()
        }
    }

    function theme_animate() {
        let animate = document.querySelectorAll('.theme-wow-animation')
        let nodes = Array.prototype.slice.call(animate, 0);
        nodes.forEach(function (nodes) {
            if (nodes.hasAttribute('data-type-animation')) {
                nodes.classList.add('wow');
                nodes.classList.add('animate__' + nodes.getAttribute('data-type-animation'));
            }
        });

        WOW.prototype.addBox = function (element) {
            this.boxes.push(element);
        };

        let starterWow = new WOW(
            {
                boxClass: 'wow',
                animateClass: 'animate__animated',
                mobile: true,
                live: true
            }
        );
        starterWow.init();

        $('.wow').on('scrollSpy:exit', function () {
            if ($(this).attr('data-animation-no-repeat')) {
                return false;
            }

            $(this).css({
                'visibility': 'hidden',
                'animation-name': 'none'
            }).removeClass('animate__animated');
            starterWow.addBox(this);
        }).scrollSpy();
    }


    function theme_jarallax() {
        if (appParallaxOption.length) {

            appParallaxOption.each(function (index, value) {
                jarallax($(this), {
                    speed: $(this).attr('data-speed'),
                    imgPosition: `${$(this).attr('data-left')}% ${$(this).attr('data-top')}%`,
                    type: $(this).attr('data-type'),
                    keepImg: false,
                })
            });
        }
    }

    // JOB WARNING Ankerlink DropDown Click Function
    let path = location.hash;
    const regex = /#.*?/gm;
    let m;
    if ((m = regex.exec(path)) !== null) {
        m.forEach((match, groupIndex) => {
            if (match) {
                let dropDown = $('.nav-link.active.dropdown-toggle').next();
                $('li a', dropDown).removeClass('active');
            }
        });
    }

    // JOB WARNING Ankerlink DropDown Click Function
    // Smooth Scroll
    $(function () {
        $('a[href*="#"]:not([href="#"]):not(a.comment-reply-link):not([href="#tab-reviews"]):not([href="#tab-additional_information"]):not([href="#tab-description"]):not([href="#reviews"]):not([href="#carouselExampleIndicators"]):not([data-smoothscroll="false"])').click(function (e) {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {

                    //JOB WARNING Ankerlink DropDown Click Function
                    let x = $(this).parents('.menu-item-has-children.dropdown').children();
                    x.toggleClass('show');
                    let dropUl = $(this).parents('ul.dropdown-menu');
                    $('li a', dropUl).removeClass('active');
                    $(this).addClass('active');
                    //JOB WARNING Ankerlink DropDown Click Function

                    $('html, body').animate({
                        // Change your offset according to your navbar height
                        scrollTop: target.offset().top - 150
                    }, 1000);
                    return !1
                }
            }

            if (window.location.hash) {
                // Entferne den Anker aus der URL
                history.replaceState(null, null, window.location.pathname + window.location.search);
            }
        })
    });

    // Scroll to ID from external url
    if (window.location.hash) scroll(0, 0);
    setTimeout(function () {
        scroll(0, 0)
    }, 1);
    $(function () {
        $('.scroll').on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(this).attr('href').offset().top - 170
            }, 1000, 'swing')

        });
        if (window.location.hash) {
            $('html, body').animate({
                scrollTop: $(window.location.hash).offset().top -170
            }, 1000, 'swing')
        }
        if (window.location.hash) {
            // Entferne den Anker aus der URL
            history.replaceState(null, null, window.location.pathname + window.location.search);
        }
    });

    WhatAnimation("fadeScroll");
    WhatAnimation("fadeScroll100");
    WhatAnimation("fadeScroll25");
    WhatAnimation("moveLeft");
    WhatAnimation("moveLeft25");
    WhatAnimation("moveLeft100");
    WhatAnimation("moveRight");
    WhatAnimation("moveRight25");
    WhatAnimation("moveRight100");
    WhatAnimation("moveTop");
    WhatAnimation("moveTop25");
    WhatAnimation("moveTop100");
    WhatAnimation("moveBottom");
    WhatAnimation("moveBottom25");
    WhatAnimation("moveBottom100");
    $(window).on("scroll", function () {
        WhatAnimation("fadeScroll");
        WhatAnimation("fadeScroll100");
        WhatAnimation("fadeScroll25");
        WhatAnimation("moveLeft");
        WhatAnimation("moveLeft25");
        WhatAnimation("moveLeft100");
        WhatAnimation("moveRight");
        WhatAnimation("moveRight25");
        WhatAnimation("moveRight100");
        WhatAnimation("moveTop");
        WhatAnimation("moveTop25");
        WhatAnimation("moveTop100");
        WhatAnimation("moveBottom");
        WhatAnimation("moveBottom25");
        WhatAnimation("moveBottom100");
    });

    function WhatAnimation(name) {
        $("." + name).each(function () {
            let moveRemove;
            let aniTop;
            let aniBottom;
            let ani = hummeltPublicObj.animation;
            switch (name) {
                case "fadeScroll":
                    if ($(this).attr('data-animation-top')) {
                        aniTop = $(this).attr('data-animation-top');
                        aniBottom = $(this).attr('data-animation-bottom');
                    } else {
                        aniTop = ani.fadeTop;
                        aniBottom = ani.fadeBottom;
                    }
                    $(this).hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "aniFade", parseInt(aniTop), parseInt(aniBottom), moveRemove);
                    break;
                case "fadeScroll100":
                    $('.fadeScroll100').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "aniFade", parseInt(ani.fadeTop100), parseInt(ani.fadeBottom100), moveRemove);
                    break;
                case "fadeScroll25":
                    $('.fadeScroll25').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "aniFade", parseInt(ani.fadeTop25), parseInt(ani.fadeBottom25), moveRemove);
                    break;
                case "moveLeft":
                    if ($(this).attr('data-animation-top')) {
                        aniTop = $(this).attr('data-animation-top');
                        aniBottom = $(this).attr('data-animation-bottom');
                    } else {
                        aniTop = ani.fadeTop;
                        aniBottom = ani.fadeBottom;
                    }
                    $(this).hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "left", parseInt(aniTop), parseInt(aniBottom), moveRemove);
                    break;
                case "moveLeft25":
                    $('.moveLeft25').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "left", parseInt(ani.moveLeftTop25), parseInt(ani.moveLeftBottom25), moveRemove);
                    break;
                case "moveLeft100":
                    $('.moveLeft100').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "left", parseInt(ani.moveLeftTop100), parseInt(ani.moveLeftBottom100), moveRemove);
                    break;
                case "moveRight":
                    if ($(this).attr('data-animation-top')) {
                        aniTop = $(this).attr('data-animation-top');
                        aniBottom = $(this).attr('data-animation-bottom');
                    } else {
                        aniTop = ani.fadeTop;
                        aniBottom = ani.fadeBottom;
                    }
                    $(this).hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "right", parseInt(aniTop), parseInt(aniBottom), moveRemove);
                    break
                case "moveRight25":
                    $('.moveRight25').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "right", parseInt(ani.moveRightTop25), parseInt(ani.moveRightBottom25), moveRemove);
                    break
                case "moveRight100":
                    $('.moveRight100').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "right", (ani.moveRightTop100), parseInt(ani.moveRightBottom100), moveRemove);
                    break
                case "moveTop":
                    if ($(this).attr('data-animation-top')) {
                        aniTop = $(this).attr('data-animation-top');
                        aniBottom = $(this).attr('data-animation-bottom');
                    } else {
                        aniTop = ani.fadeTop;
                        aniBottom = ani.fadeBottom;
                    }
                    $(this).hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "top", parseInt(aniTop), parseInt(aniBottom), moveRemove);
                    break;
                case "moveTop25":
                    $('.moveTop25').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "top", parseInt(ani.moveTopTop25), parseInt(ani.moveTopBottom25), moveRemove);
                    break;
                case "moveTop100":
                    $('.moveTop100').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "top", parseInt(ani.moveTopTop100), parseInt(ani.moveTopBottom100), moveRemove);
                    break;
                case "moveBottom":
                    if ($(this).attr('data-animation-top')) {
                        aniTop = $(this).attr('data-animation-top');
                        aniBottom = $(this).attr('data-animation-bottom');
                    } else {
                        aniTop = ani.fadeTop;
                        aniBottom = ani.fadeBottom;
                    }
                    $(this).hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "bottom", parseInt(aniTop), parseInt(aniBottom), moveRemove);
                    break;
                case "moveBottom25":
                    $('.moveBottom25').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "bottom", parseInt(ani.moveBottomTop25), parseInt(ani.moveBottomBottom25), moveRemove);
                    break;
                case "moveBottom100":
                    $('.moveBottom100').hasClass('notRepeat') ? moveRemove = false : moveRemove = true;
                    AddClass(this, "bottom", parseInt(ani.moveBottomTop100), parseInt(ani.moveBottomBottom100), moveRemove);
                    break;
            }
        });
    }

    function AddClass(object, name, top, bottom, remove) {
        if (IsVisible(object, top, bottom)) {
            $(object).addClass(name);
        } else {
            if (remove) {
                $(object).removeClass(name);
            }
        }
    }

    function IsVisible(object, top, bottom) {
        let viewport = $(window).scrollTop() + $(window).height();
        let rand = $(object).offset();
        rand.bottom = rand.top + $(object).outerHeight();
        return !(
            viewport < rand.top + top || $(window).scrollTop() > rand.bottom - bottom
        );
    }


    // div height, add class to your content
    $('.height-50').css('height', 0.5 * $(window).height());
    $('.height-75').css('height', 0.75 * $(window).height());
    $('.height-85').css('height', 0.85 * $(window).height());
    $('.height-100').css('height', 1.0 * $(window).height());

}); // jQuery End
