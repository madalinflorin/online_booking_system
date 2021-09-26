import RestApiClient from "./rest-client";
import authHeader from '../../services/auth-header';
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    getUsers: '/user/users',
    getAdmins: '/user/admins',
    getBarbers: '/user/barbers',
    insertUser: '/user/insert',
    deleteUser: '/user/delete/',
    selectUser: '/user/',
    editUser: '/user/update'
};


function getUsers(callback) {
    let request = new Request(BACKEND + endpoint.getUsers, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getAdmins(callback) {
    let request = new Request(BACKEND + endpoint.getAdmins, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getBarbers(callback) {
    let request = new Request(BACKEND + endpoint.getBarbers, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function insertUser(user, callback) {
    console.log(user);
    let request = new Request(BACKEND + endpoint.insertUser, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(user)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteUser(id, callback) {
    console.log(id);
    let request = new Request(BACKEND + endpoint.deleteUser + id, {
        method: 'DELETE',
        headers : authHeader(),
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function selectUser(id, callback) {
    console.log(id);
    let request = new Request(BACKEND + endpoint.selectUser + id, {
        method: 'GET',
        headers : authHeader(),
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function editUser(data, callback) {
    console.log(data);
    let request = new Request(BACKEND + endpoint.editUser, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(data)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getUsers,
    getAdmins,
    getBarbers,
    insertUser,
    deleteUser,
    selectUser,
    editUser
};
