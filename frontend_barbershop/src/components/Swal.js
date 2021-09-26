import Swal from 'sweetalert2';

export const swalComponent = (header, message, severity) => {
    Swal.fire({
        title: header,
        text: message,
        icon: severity,
        confirmButtonColor: '#8B7871'
    });
}

export const swalComponentWithoutButton = (header, message, severity) => {
    Swal.fire({
        title: header, 
        text: message,
        icon: severity,
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

