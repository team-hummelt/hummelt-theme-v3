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
                bgNav.removeClass('header-scroll')
                navImg.stop().css({
                    width: `${hummeltPublicObj.logo.logo_size}px`
                });
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
            bgNav.stop().css({
                paddingTop: '1rem',
                paddingBottom: '1rem'
            });
        } else if (windowWidth < threshold - tolerance) {
            // Breite kleiner als Schwelle
            navImg.stop().css({
                width: `${hummeltPublicObj.logo.logo_size_mobil}px`
            });
            bgNav.stop().css({
                paddingTop: '0.25rem',
                paddingBottom: '0.25rem'
            });
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


    // div height, add class to your content
    $('.height-50').css('height', 0.5 * $(window).height());
    $('.height-75').css('height', 0.75 * $(window).height());
    $('.height-85').css('height', 0.85 * $(window).height());
    $('.height-100').css('height', 1.0 * $(window).height());

}); // jQuery End
