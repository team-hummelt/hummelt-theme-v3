document.addEventListener("DOMContentLoaded", function (event) {

    /**
     * @type {NodeListOf<Element>}
     */
    let hupaDuplicate = document.querySelectorAll('.hupa-post-duplicate-item');
    if (hupaDuplicate) {
        let duplicateNodes = Array.prototype.slice.call(hupaDuplicate, 0);
        duplicateNodes.forEach(function (duplicateNodes) {
            duplicateNodes.addEventListener("click", function (e) {
                let postId = duplicateNodes.getAttribute('data-id');
                let paged = get_site_params('paged');
                if (typeof paged === 'undefined' || !paged) {
                    paged = 1;
                }
                const data = {
                    'method': 'hummelt_theme_v3_duplicate_post',
                    'post_type': sort_ajax_obj.post_type,
                    'paged': paged,
                    'postId': postId
                }
                sendXHRAjaxData(data, false);

            });
        });
    }

    /**
     * Sortable
     * @type {NodeListOf<Element>}
     */
    let themeSortable = document.querySelectorAll("table.wp-list-table #the-list");
    if (themeSortable) {
        let sortNodes = Array.prototype.slice.call(themeSortable, 0);
        sortNodes.forEach(function (sortNodes) {
            sortNodes.classList.add('hupa-sortable');
            let elementArray = [];
            const sortable = Sortable.create(sortNodes, {
                animation: 300,
                handle: "td:nth-child(1n+3)",
                ghostClass: 'sortable-ghost',
                forceFallback: true,
                scroll: true,
                bubbleScroll: true,
                scrollSensitivity: 150,
                easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
                scrollSpeed: 20,
                emptyInsertThreshold: 5,
                onMove: function (evt) {

                    sortNodes.classList.add('drag-sortable');
                    // return evt.related.className.indexOf('adminBox') === -1;
                },
                onUpdate: function (evt) {
                    elementArray = [];
                    sortNodes.classList.remove('drag-sortable');
                    evt.to.childNodes.forEach(themeSortable => {

                        if (themeSortable.nodeName === 'TR') {
                            elementArray.push(themeSortable.id);
                        }
                    });

                    let paged = get_site_params('paged');
                    if (typeof paged === 'undefined' || !paged) {
                        paged = 1;
                    }

                    const data = {
                        'method': 'hummelt_theme_v3_post_order',
                        'post_type': sort_ajax_obj.post_type,
                        'paged': paged,
                        'elements': JSON.stringify(elementArray)
                    }

                    sendXHRAjaxData(data, false);
                }
            });
        });
    }

    function sendXHRAjaxData(data, is_formular = true) {
        let xhr = new XMLHttpRequest();
        let formData = new FormData();
        xhr.open('POST', sort_ajax_obj.ajax_url, true);

        if (is_formular) {
            let input = new FormData(data);
            for (let [name, value] of input) {
                formData.append(name, value);
            }
        } else {
            for (let [name, value] of Object.entries(data)) {
                formData.append(name, value);
            }
        }

        formData.append('_ajax_nonce', sort_ajax_obj.nonce);
        formData.append('action', sort_ajax_obj.handle);
        xhr.send(formData);

        //Response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.responseText);
                if (data.reload) {
                    location.reload();
                }
            }
        }
    }

    function get_site_params(search = false, input_url = false) {
        let get_url;
        let get_search;
        input_url ? get_url = input_url : get_url = window.location.href;
        search ? get_search = search : get_search = 'page';
        let url = new URL(get_url);
        return url.searchParams.get(get_search);
    }
});