export default function SetAjaxData(data) {
    let formData = new FormData();
    for (let [name, value] of Object.entries(data)) {
        formData.append(name, value);
    }

    formData.append('_ajax_nonce', hummeltRestObj.nonce);
    formData.append('action', hummeltRestObj.handle);

    return formData;
}