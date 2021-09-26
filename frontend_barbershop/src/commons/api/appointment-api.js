import RestApiClient from "./rest-client";
import authHeader from '../../services/auth-header';
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    edit : '/appointment/edit',
    insert : '/appointment/insert',
    delete : '/appointment/delete'
};


function editAppointment(appointment, callback) {
    let request = new Request(BACKEND + endpoint.edit, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(appointment)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function insertAppointment(appointment, callback) {
    let request = new Request(BACKEND + endpoint.insert, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(appointment)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


function getAppointmentsForBarber(barber, date, callback) {
    let request = new Request(BACKEND + '/appointment/barber_id=' + barber + '&date=' + date, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getAppointmentsForUser(username, token, callback) {
    console.log(username +" " + token);
    let request = new Request(BACKEND + '/appointment/username=' + username + "&token=" + token , {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteAppointment(data, callback) {
    let request = new Request(BACKEND + endpoint.delete , {
        method: 'DELETE',
        headers : authHeader(),
        body: JSON.stringify(data)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getCalendarForBarber(barber, callback) {
    let request = new Request(BACKEND + '/calendar/barber_id=' + barber , {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    insertAppointment,
    editAppointment,
    getAppointmentsForBarber,
    getAppointmentsForUser,
    deleteAppointment,
    getCalendarForBarber
};
