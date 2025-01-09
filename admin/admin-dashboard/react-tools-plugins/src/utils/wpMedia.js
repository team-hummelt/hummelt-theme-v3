
export const openMediaFrame = (title, btn,type_key, url_key, callback, multiple = false) => {

    let mediaFrame;
    if (mediaFrame) {
        mediaFrame.open();
        return;
    }

     mediaFrame = wp.media({
        title: title,
        button: {
            text: btn
        },
        multiple: multiple
    });

    mediaFrame.on('select', function () {
        const attachment = mediaFrame.state().get('selection').first().toJSON();
        callback(attachment, type_key, url_key )
    })

    mediaFrame.open();

}