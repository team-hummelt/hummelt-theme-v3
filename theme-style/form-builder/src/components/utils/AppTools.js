export function deUmlaut(value){
    value = value.toLowerCase();
    value = value.replace(/ä/g, 'ae');
    value = value.replace(/ö/g, 'oe');
    value = value.replace(/ü/g, 'ue');
    value = value.replace(/ß/g, 'ss');
    value = value.replace(/ /g, '-');
    value = value.replace(/\./g, '');
    value = value.replace(/,/g, '');
    value = value.replace(/&/g, '');
    value = value.replace(/\$/g, '');
    value = value.replace(/\+/g, '');
    value = value.replace(/\(/g, '');
    value = value.replace(/\)/g, '');
    value = value.replace(/\d/g, '');
    value = value.replace(/;/g, '');
    value = value.replace(/#/g, '');
    value = value.replace(/=/g, '');
    value = value.replace(/\(/g, '');
    value = value.replace(/\)/g, '');
    return value;
}

export const swal_message = (title, msg) => {
    Swal.fire({
        position: 'center',
        title: title,
        html: msg,
        //icon: 'success',
        //timer: 1500,
        showConfirmButton: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        customClass: {
            popup: 'swal-message-container'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then();
}

export const randInteger = (length) => {
    let randomCodes = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        randomCodes += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomCodes;
}

export const randomChar = (length) => {
    let randomCodes = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        randomCodes += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomCodes;
}

export const success_message = (msg) => {
    let x = document.getElementById("snackbar-success");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

export const upload_message = (msg, target) => {
    let x = document.getElementById(target);
    x.innerHTML = msg;
    x.classList.add('show')
    setTimeout(function () {
        x.classList.remove('show')
    }, 3000);
}

export const warning_message = (msg) => {
    let x = document.getElementById("snackbar-warning");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

export  const scrollToWrap = (target, offset = 50) => {
    return new Promise((resolve) => {
        setTimeout(function () {
            jQuery('html, body').stop().animate({
                scrollTop: jQuery(target).offset().top - (offset),
            }, 400, "linear", function () {
            });
        }, 350);
    });

}

