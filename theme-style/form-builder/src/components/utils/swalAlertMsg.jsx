
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
const waitSwal = withReactContent(Swal);

export default function swalAlertMsg(data){
    if (data.status) {
        waitSwal.fire({
            position: 'top-end',
            title: data.title,
            text: data.msg,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            customClass: {
                popup: 'swal-success-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then();
    } else {
        waitSwal.fire({
            position: 'top-end',
            title: data.title,
            text: data.msg,
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
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