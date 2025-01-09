export default function SetAjaxData(data){

    let formData = new FormData();
    for (let [name, value] of Object.entries(data)) {
        formData.append(name, value);
    }
    formData.append('action', hummeltPublicObj.form_handle);
    formData.append('_ajax_nonce', hummeltPublicObj.form_nonce);
    return formData;
}