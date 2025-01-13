/*
 * Import remote dependencies.
 */
import Axios from 'axios';

const Api = Axios.create({
    baseURL: hummeltPublicObj.ajax_url,
    headers: {
        'content-type': 'application/json',
        'X-WP-Nonce': hummeltPublicObj.theme_nonce
    }
});

export default Api;