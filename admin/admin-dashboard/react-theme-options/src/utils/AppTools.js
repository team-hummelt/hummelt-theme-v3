import Swal from "sweetalert2";
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';
import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);

export const swalAlertMsg = (data, position = 'top-end') => {
    if (data.status) {
        reactSwal.fire({
            position: position,
            title: data.title,
            text: data.msg,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            showClass: {
                //  popup: 'animate__animated animate__fadeInDown'
            },
            customClass: {
                popup: 'swal-success-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then();
    } else {
        reactSwal.fire({
            position: position,
            title: data.title,
            text: data.msg,
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            showClass: {
                //  popup: 'animate__animated animate__fadeInDown'
            },
            customClass: {
                popup: 'swal-error-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then();
    }
}

export function swal_delete_modal(data) {
    return new Promise((resolve) => {
        reactSwal.fire({
            title: data.title,
            reverseButtons: true,
            html: `<span class="swal-delete-body">${data.msg}</span>`,
            confirmButtonText: data.btn,
            cancelButtonText: 'Abbrechen',
            showClass: {
                // popup: `animate__animated ${animate ? 'animate__fadeInDown' : 'animate__bounceIn' }`
            },
            customClass: {
                popup: 'swal-delete-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then((result) => {
            return resolve(result.isConfirmed)
        });
    })
}

export const success_message = (msg) => {
    let x = document.getElementById("snackbar-success");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
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