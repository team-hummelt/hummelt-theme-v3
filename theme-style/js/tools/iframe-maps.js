document.addEventListener('DOMContentLoaded', initializeIframeMaps);

function initializeIframeMaps() {
    let iFrameContainer = document.querySelectorAll('.theme-v3-iframe-loader');
    if(iFrameContainer) {
        let iFrameEvent = Array.prototype.slice.call(iFrameContainer, 0);
        let settings;
        iFrameEvent.forEach(function (iFrameEvent) {
            try {
                settings = atob(iFrameEvent.getAttribute('data-iframe'), 'UTF8')
                if (!settings) {
                    return false;
                }
                let formData = {
                    'method': 'get_iframe_data',
                    'data': settings
                }
                fetchIframeApi(formData);
            } catch (error) {
                console.error('Fehler beim Laden des Skripts:', error);
            }
        })
    }
}


function fetchIframeApi(formData, path = hummeltRestEditorObj.public_rest_path + 'settings') {
    wp.apiFetch({
        path: path,
        method: 'POST',
        data: formData,
    }).then(data => {
        switch (data.type) {
            case 'get_iframe_data':
                if (data.status) {
                    if (data.is_ds && sessionStorage.getItem(`iframe-${data.record.attr.type}`) !== '1') {
                        ds_iframe_placeholder_template(data.record);
                    } else {
                        build_iframe_map(data.record)
                        document.getElementById(`iframe-loader-${data.record.attr.id}`).remove()
                    }
                }
                break;
        }
    }).catch(
        (error) => {
            if (error.code === 'rest_permission_error' || error.code === 'rest_failed') {
                console.log(error.message);
            }
        }
    );
}

function osm_map_mouse_handle(container, data) {
    let pc = true;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        pc = false;
    }



    if (pc) {

        let overview = container.querySelector('.iframe-osm-overlay')
        overview.addEventListener('click', function (event) {
            overview.classList.add('focus')
            overview.classList.remove('scroll')
            overview.style.zIndex = -1;
        })
       container.addEventListener('mouseleave', function(event) {
           overview.classList.remove('scroll')
           overview.classList.remove('focus')
           overview.style.zIndex = 1;
        })
        container.addEventListener('mouseover', function(event) {
            if(container.classList.contains('focus')) {
                overview.classList.remove('scroll')
                overview.style.zIndex = 1;
            } else {
                overview.classList.add('scroll')
            }
        })
    }
}

function build_iframe_map(data) {
    let iframeUrl = atob(data.attr.url);
    let html = `<iframe class="iframe-${data.attr.id} iframe-${data.attr.type}" height="${data.attr.height}" width="${data.attr.width}" src="${iframeUrl}"></iframe>`;
    let iFrameContainer = document.getElementById(`iframe-map-${data.attr.id}`)
    iFrameContainer.innerHTML= html;
    if(data.attr.type === 'openstreetmap') {
        let addContainer = '<div class="iframe-osm-overlay"></div>';
        iFrameContainer.insertAdjacentHTML('afterbegin', addContainer)
        osm_map_mouse_handle(iFrameContainer, data)

    }
}

function iframe_ds_action(container, data){
    let dsCheck = container.querySelector('.gmaps-karte-check')
    let dsBtn = container.querySelector('.gmaps-ds-btn')
    dsCheck.addEventListener("click", function (e) {
        if (e.target.checked) {
            dsBtn.removeAttribute('disabled')
        } else {
            dsBtn.setAttribute('disabled', 'disabled')
        }

    })
    dsBtn.addEventListener("click", function () {
        if (dsCheck.checked) {
            document.getElementById(`iframe-loader-${data.attr.id}`).remove()
            sessionStorage.setItem(`iframe-${data.attr.type}`, '1')
            container.innerHTML = '';
            build_iframe_map(data)
        }
    })
}

function ds_iframe_placeholder_template(data) {
    let ds = data.ds;
    let grayscale;
    let button_css;
    ds.map_bg_grayscale ? grayscale = ' img-grayscale' : grayscale = '';
    ds.button_css ? button_css = ` ${ds.button_css}` : button_css = '';
    let html = `<div style="width: ${data.attr.width}px; height: ${data.attr.height}px;" class="map-placeholder position-relative d-flex justify-content-center overflow-hidden align-items-center">
                <img decoding="async" style="width:  ${data.attr.width}px; height: ${data.attr.height}px;" alt="" class="map-placeholder-img${grayscale}" src="${ds.map_img_url}">
                <div class="ds-check-wrapper position-absolute align-items-center justify-content-center flex-column py-4">
                    <button disabled type="button" class="btn btn-secondary gmaps-ds-btn ${button_css} z-1 position-relative">
                        ${ds.map_ds_btn_text}
                    </button>
                    <div class="form-check mx-4 mt-3">
                        <input class="form-check-input gmaps-karte-check" type="checkbox" id="ds-${data.attr.id}">
                        <label class="form-check-label text-light fw-normal fst-normal" for="ds-${data.attr.id}">
                            ${ds.map_ds_text}
                        </label>
                    </div>
                </div>
            </div>`;

    let iFrameContainer = document.getElementById(`iframe-map-${data.attr.id}`)
    iFrameContainer.insertAdjacentHTML('beforeend', html);
    iframe_ds_action(iFrameContainer, data)
}