async function loadScript(src, id) {
    return new Promise((resolve, reject) => {
        // Prüfen, ob das Skript bereits geladen wurde
        if (document.getElementById(id)) {
            console.log(`Skript mit ID "${id}" ist bereits geladen.`);
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
    });
}

// Funktion, die geprüft und initialisiert wird
async function initializeFeatureIfNeeded() {
    if (document.querySelector('.theme-v3-leaflet-loader')) {
        // console.log('Element gefunden, lade Skript...');
        try {
            await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/leaflet/leaflet/leaflet.js`, 'theme-v3-leaflet');
            await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/leaflet/leaflet-minimap/Control.MiniMap.min.js`, 'theme-v3-leaflet-minimap');
            await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/leaflet/leaflet.fullscreen/Control.FullScreen.js`, 'theme-v3-leaflet-fullscreen');
            await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/leaflet/leaflet.markercluster/leaflet.markercluster.js`, 'theme-v3-leaflet-markercluster');
            //console.log('Skript wurde geladen.');
            initializeFeature(); // Funktion aus dem geladenen Skript
        } catch (error) {
            console.error('Fehler beim Laden des Skripts:', error);
        }
    } else {
       // console.log('Element nicht gefunden, Skript wird nicht geladen.');
    }
}

document.addEventListener('DOMContentLoaded', initializeFeatureIfNeeded);

function initializeFeature() {
    let leaflet = document.querySelectorAll('.theme-v3-leaflet-loader');
    let leafletEvent = Array.prototype.slice.call(leaflet, 0);
    let settings;
    leafletEvent.forEach(function (leafletEvent) {
        try {

            settings = atob(leafletEvent.getAttribute('data-leaflet'), 'UTF8')
              if (!settings) {
                return false;
            }
            let formData = {
                'method': 'get_leaflet_data',
                'data': settings
            }
            fetchLeafletApi(formData);
        } catch (error) {
            console.error('Fehler beim Laden des Skripts:', error);
        }
    })

}

function fetchLeafletApi(formData, path = hummeltRestEditorObj.public_rest_path + 'settings') {
    wp.apiFetch({
        path: path,
        method: 'POST',
        data: formData,
    }).then(data => {
        switch (data.type) {
            case 'get_leaflet_data':
                if (data.status) {
                    if (data.is_ds && sessionStorage.getItem('theme-leaflet') !== '1') {
                        ds_placeholder_template(data.record)
                    } else {
                        document.getElementById(`loader-${data.record.attr.id}`).remove()
                        buildOsmMap(data.record)
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

function leaflet_ds_action(container, data) {
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
            document.getElementById(`loader-${data.attr.id}`).remove()
            sessionStorage.setItem('theme-leaflet', '1')
            container.innerHTML = '';
            buildOsmMap(data)
        }
    })
}

function ds_placeholder_template(data) {
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
    let leafletContainer = document.getElementById(`map-${data.attr.id}`)
    leafletContainer.insertAdjacentHTML('beforeend', html);
    leaflet_ds_action(leafletContainer, data)
}

function buildOsmMap(data) {

    let pc = true;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        pc = false;
    }
    let mapCenter = [52.0, 11.5]; // Standardwerte setzen
    let pins = data.pins || [];
    let markerData = pins;

    if (pins.length > 0) {
        // Berechne die Bounding Box aller Pins
        const bounds = L.latLngBounds();
        pins.forEach(pin => {
            if(pin.active) {
                if (pin.geo_json.lat && pin.geo_json.lon) {
                    bounds.extend([parseFloat(pin.geo_json.lat), parseFloat(pin.geo_json.lon)]);
                }
            }
        });
        // Falls Pins vorhanden sind, berechne den Mittelpunkt der Bounding Box
        mapCenter = bounds.getCenter();
    } else {
        // Falls keine Pins vorhanden sind, verwende Standardwerte
        mapCenter = [parseFloat(lat), parseFloat(lon)];
    }

    // Karte erstellen
    let osmMap = L.map(`map-${data.attr.id}`, {
        center: [mapCenter.lat, mapCenter.lng], // Berechnetes oder Standardzentrum
        zoom: data.attr.zoom,
        zoomDelta: 0.25,
        zoomSnap: 0.25,
        dragging: pc,
        tap: pc,
        scrollWheelZoom: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topright',
            forceSeparateButton: true,
            titleCancel: 'Den Vollbildmodus beenden',
            title: 'Vollbildmodus anzeigen'
        }
    });

    // Map-Tiles hinzufügen
    const attribution = 'Map data &copy; <a target="_blank" href="https://www.openstreetmap.de/">OpenStreetMap</a> contributors, <a target="_blank" href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

    let osmUrl;
    if(data.layer && data.layer.tiles_url) {
        osmUrl = data.layer.tiles_url;
    } else {
        osmUrl = 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png';
    }

    L.tileLayer(osmUrl, {
        maxZoom: data.attr.max_zoom,
        minZoom: data.attr.min_zoom,
        attribution: attribution
    }).addTo(osmMap);

    let markers = L.markerClusterGroup({
        polygonOptions: {
            color: "#aaaaaa",
            weight: 1,
            fillColor: "#f7ed7e"
        },
        maxClusterRadius: data.attr.cluster_radius
    });

    if (data.attr.show_minimap) {
        let osm2 = new L.TileLayer(osmUrl, {
            minZoom: data.attr.minimap_min_zoom,
            maxZoom: data.attr.minimap_max_zoom,
            attribution: attribution,
        });

        let miniMap = new L.Control.MiniMap(osm2, {
            toggleDisplay: true,
            minimized: false,
            position: 'bottomright',
            width: data.attr.minimap_width,
            height: data.attr.minimap_height,
            strings: {
                hideText: 'Miniaturkarte ausblenden',
                showText: 'Miniaturkarte einblenden',
            }

        }).addTo(osmMap);
    }

    pins.map((k, index) => {
        if(k.active) {
            let lon;
            let lat;
            if (k.geo_json.lat && k.geo_json.lon) {
                lon = parseFloat(k.geo_json.lon);
                lat = parseFloat(k.geo_json.lat);
                let customIcon = L.divIcon({
                    //  iconUrl: child_localize_obj.theme_url + '/assets/img/marker.png',
                    className: "box",
                    iconSize: [21, 30],
                    iconAnchor: [22, 31],
                    popupAnchor: [-10, -36],
                    html: `<span class="w-100 h-100 card-icon"><i style="color: ${k.marker_color}" class="icon-location-sharp"></i></span>`
                });
                if (k.textbox) {
                    L.marker([lat, lon], {icon: customIcon}).bindPopup(k.textbox).addTo(markers);
                } else {
                    L.marker([lat, lon], {icon: customIcon}).addTo(markers);
                }
            }
        }
    })
   markers.addTo(osmMap);

    let t = [];
    pins.map((p, index) => {
        if(p.active) {
            if (p.polygone_show) {
                let geo = p.geo_json.geojson.coordinates;
                let type;
                if (p.geo_json.geojson.type === 'Point') {
                    type = 'Polygon'
                } else {
                    type = p.geo_json.geojson.type
                }
                let item = {
                    "type": "Feature",
                    "properties": {
                        "app": "pin",
                        color: p.polygone_border,
                        fillColor: p.polygone_fill,
                        weight: p.polygone_border_width,
                    },
                    "geometry": {
                        "type": type,
                        "coordinates": geo,
                    }
                }
                t.push(item)
            }
        }
    })
   L.geoJSON(t, {
        style: function (feature) {
            switch (feature.properties.app) {
                case 'pin':
                    return {
                        color: feature.properties.color,
                        fillColor: feature.properties.fillColor,
                        fillOpacity: 1.0,
                        weight: feature.properties.weight,
                    };
                case 'Democrat':
                    return {color: "#0000ff"};
            }
        }
    }).addTo(osmMap);

    // Scrollen aktivieren/deaktivieren
   /* osmMap.on('mouseenter', function () {
        osmMap.scrollWheelZoom.enable();
    });
    osmMap.on('mouseleave', function () {
        osmMap.scrollWheelZoom.disable();
    });*/

    let container = osmMap.getContainer();
    let mapHasFocus = false;
    if (pc) {
        container.addEventListener('wheel', function (event) {
            if (mapHasFocus) {
                container.classList.remove('scroll')
            } else {
                container.classList.add('scroll')
            }
        });
    }

    container.addEventListener('mouseleave', function() {
        container.classList.remove('scroll')
    });

    if (pc) {
        osmMap.on('focus', function () {
            osmMap.scrollWheelZoom.enable();
            mapHasFocus = true;
            container.classList.add('focus');
            container.classList.remove('scroll')
        });
        osmMap.on('blur', function () {
            osmMap.scrollWheelZoom.disable();
            mapHasFocus = false;
            container.classList.remove('focus');
        });
    }

    const mapEl = document.getElementById(`map-${data.attr.id}`);
    L.DomEvent.on(mapEl, 'touchstart', onTwoFingerDrag);
    L.DomEvent.on(mapEl, 'touchend', onTwoFingerDrag);

    function onTwoFingerDrag(e) {

        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping')
        } else {
            e.currentTarget.classList.remove('swiping')
        }
    }
}