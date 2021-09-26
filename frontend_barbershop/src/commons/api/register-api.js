import RestApiClient from "./rest-client";
import authHeader from "../../services/auth-header"
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;
const API_REMOTE = 'https://www.universal-tutorial.com/api';

const endpoint = {
    person: '/patient',
    token: '/getaccesstoken',
    country: '/countries/',
    state: '/states/',
    city: '/cities/',
    register: '/api/auth/signup',
    activation : '/user/activate/',
    updateUser: '/user/update',
    updateProfile: '/user/update_profile',
    getUser: '/user/profile/'
};


function getToken(callback) {
    let request = new Request(API_REMOTE + endpoint.token, {
        method: 'GET', 
        headers: {
            "Accept": "application/json",
            "api-token": "rrc5xbey8QSBcpVnFMqQuIBwo37KXdFxhPheDtRrHyBHhEeenQ_qj1ccyQ3Wubzv1HM",
            "user-email": "licentabarbershop@gmail.com"
        },
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getCountries(token, callback) {
    let request = new Request(API_REMOTE + endpoint.country, {
        method: 'GET', 
        headers: {
            "Authorization": 'Bearer ' + token
        },
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getStates(token, country, callback) {
    let request = new Request(API_REMOTE + endpoint.state + country, {
        method: 'GET', 
        headers: {
            "Authorization": 'Bearer ' + token
        },
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getCities(token, state, callback) {
    let request = new Request(API_REMOTE + endpoint.city + state, {
        method: 'GET', 
        headers: {
            "Authorization": 'Bearer ' + token
        },
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postUser(user, callback) {
    console.log(user);
    let request = new Request(BACKEND + endpoint.register, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function activation(username, callback) {
    console.log(username);
    let request = new Request(BACKEND + endpoint.activation, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: username
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function updateUser(user, callback) {
    console.log(user);
    let request = new Request(BACKEND + endpoint.updateUser, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(user)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function updateProfile(user, callback) {
    console.log(user);
    let request = new Request(BACKEND + endpoint.updateProfile, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(user)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getUser(username, token, callback) {
    console.log(username+" with token "+token);
    let request = new Request(BACKEND + endpoint.getUser + "username=" + username + "&token=" + token, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


export {
    getToken,
    getCountries,
    getStates,
    getCities,
    postUser,
    activation,
    updateUser,
    updateProfile,
    getUser
};
