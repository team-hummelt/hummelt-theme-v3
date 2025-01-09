async function loadScript(src, id) {
    return new Promise((resolve, reject) => {
        // Prüfen, ob das Skript bereits geladen wurde
        if (document.getElementById(id)) {
           // console.log(`Skript mit ID "${id}" ist bereits geladen.`);
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

document.addEventListener('DOMContentLoaded', initializeFeatureIfNeeded);

async function initializeFeatureIfNeeded() {
    if(document.querySelector('.theme-v3-gmaps-api-loader')) {
        console.log('Map-Iframe gefunden, lade Skript...');
        try {
        //  await loadScript(`${hummeltPublicObj.theme_url}/theme-style/js/tools/gmaps-api.js`, 'theme-v3-gmaps-api');
            console.log('Map-Iframe Skript wurde geladen.');
        } catch (error) {
            console.error('Fehler beim Laden des Skripts:', error);
        }
    }
}

