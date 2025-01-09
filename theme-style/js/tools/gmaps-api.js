let googleMapsScriptIsInjected = false;
let record = {};
let gmapsContainer = '';
const injectGoogleMapsApiScript = (options = {}) => {
    if (googleMapsScriptIsInjected) {

        return false;
    }
    const optionsQuery = Object.keys(options)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`)
        .join('&');
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {


    const url = `https://maps.googleapis.com/maps/api/js?${optionsQuery}`;
    const script = document.createElement('script');
    script.setAttribute('src', url);
    script.async = true;
    script.defer = true;
    script.setAttribute('loading', 'async');
    //document.head.appendChild(script);
    document.body.appendChild(script);
    }

    googleMapsScriptIsInjected = true;
};

async function initMap() {
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
    const {Map} = await google.maps.importLibrary("maps");
    let infowindow = new google.maps.InfoWindow();
    //let geocoder = new google.maps.Geocoder();
    let map_type_ids = ['roadmap'];


    let custom_style;
    if (record.color_schema) {
        custom_style = new google.maps.StyledMapType(record.color_schema, {name: record.site_name});
        map_type_ids = ['styled_map'];
    }

    let map;
    let initLat = 52.10865639405879;
    let initLong = 11.633041908696315;
    map = new Map(gmapsContainer, {
        center: {lat: initLat, lng: initLong},
        zoom: record.attr.zoom,
        //mapId: id,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: map_type_ids
        }
    });

    if (custom_style) {
        map.mapTypes.set('styled_map', custom_style);
        map.setMapTypeId('styled_map');
    }
    let totalLat = 0;
    let totalLng = 0;
    let pinCount = 0;

    let output = []; // Array für alle Marker

    for (const [key, value] of Object.entries(record.pins)) {
        let pinadress = { lat: value.lat, lng: value.lng };
        let textbox = value.info_text;

        let marker = new google.maps.Marker({
            map: map,
            position: pinadress,
            icon: value.pin,
            loc: textbox,
        });

        output.push(marker); // Füge Marker dem Array hinzu
        if (textbox !== '') {
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.close();
                infowindow.setContent('<div class="infowindow"><p>' + this.loc + '</p></div>');
                infowindow.open({
                    anchor: this,
                    map,
                    shouldFocus: false,
                });
            });
        }
    }

    // Karte anpassen, um alle Marker zu zeigen
    if (output.length > 0) {
        let bounds = new google.maps.LatLngBounds();
        output.forEach(marker => {
            bounds.extend(marker.getPosition()); // Grenzen berechnen
        });
      //  map.fitBounds(bounds); // Karte so zoomen, dass alle Marker sichtbar sind
    } else {
        console.warn('Keine Marker vorhanden.');
    }

    if (pinCount > 0) {
        let centerLat = totalLat / pinCount;
        let centerLng = totalLng / pinCount;
        map.setCenter({ lat: centerLat, lng: centerLng });
        map.setZoom(record.attr.zoom); // Optional: Zoom anpassen
    }

}

const windowReady = new Promise(resolve => {
    if (document.readyState === 'complete') {
        resolve('ready');
    } else {
        window.addEventListener('load', resolve);
    }
});

windowReady.then((resolve) => {

    let gmapsApiContainer = document.querySelectorAll('.theme-v3-gmaps-api-loader');
    if(gmapsApiContainer) {
        let gmapsApiEvent = Array.prototype.slice.call(gmapsApiContainer, 0);
        let settings;
        gmapsApiEvent.forEach(function (gmapsApiEvent) {
            try {
                settings = atob(gmapsApiEvent.getAttribute('data-gmaps-api'), 'UTF8')
                if (!settings) {
                    return false;
                }
                let formData = {
                    'method': 'get_gmaps_api_data',
                    'data': settings
                }
                fetchGmapsApi(formData);
            } catch (error) {
                console.error('Fehler beim Laden des Skripts:', error);
            }
        })
    }

    function fetchGmapsApi(formData, path = hummeltRestEditorObj.public_rest_path + 'settings') {
        wp.apiFetch({
            path: path,
            method: 'POST',
            data: formData,
        }).then(data => {
            switch (data.type) {
                case 'get_gmaps_api_data':
                    if (data.status) {
                        record = data.record;
                        if(data.isDs && sessionStorage.getItem(`gmaps-api`) !== '1') {
                            ds_gmaps_api_placeholder_template()
                        } else {
                            gmapsContainer = document.getElementById(`gmaps-api-map-${data.record.attr.id}`)
                            injectGoogleMapsApiScript({
                                key: atob(data.record.key),
                                callback: 'initMap',
                            });
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

    function gmaps_api_ds_action(container, data){
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
                document.getElementById(`gmaps-api-loader-${data.attr.id}`).remove()
                sessionStorage.setItem(`gmaps-api`, '1')
                container.innerHTML = '';
                gmapsContainer = container
                injectGoogleMapsApiScript({
                    key: atob(data.key),
                    callback: 'initMap',
                });
            }
        })
    }

    function ds_gmaps_api_placeholder_template() {
        let data = record;
        let ds = data.ds;
        let grayscale;
        let button_css;
        ds.map_bg_grayscale ? grayscale = ' img-grayscale' : grayscale = '';
        ds.button_css ? button_css = ` ${ds.button_css}` : button_css = '';
        let html = `<div style="width: ${data.attr.width}; height: ${data.attr.height};" class="map-placeholder position-relative d-flex justify-content-center overflow-hidden align-items-center">
                <img decoding="async" style="width:  ${data.attr.width}; height: ${data.attr.height};" alt="" class="map-placeholder-img${grayscale}" src="${ds.map_img_url}">
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
        let container = document.getElementById(`gmaps-api-map-${data.attr.id}`)
        container.insertAdjacentHTML('beforeend', html);
        gmaps_api_ds_action(container, data)
    }
})



