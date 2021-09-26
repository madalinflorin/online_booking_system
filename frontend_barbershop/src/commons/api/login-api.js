import RestApiClient from "./rest-client";
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    login : '/api/auth/signin',
    resetPassword: '/user/resetPassword',
    changePassword: '/user/changePassword',
    acceptToken: '/user/tokenPassword'
};



function login(user, callback) {
    console.log(user);
    let request = new Request(BACKEND + endpoint.login, {
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

function forgetPassword(details, callback) {
    console.log(details);
    let request = new Request(BACKEND + endpoint.resetPassword, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(details)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function changePassword(details, callback) {
    console.log(details);
    let request = new Request(BACKEND + endpoint.changePassword, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(details)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function verifyToken(token, callback) {
    console.log(token);
    let request = new Request(BACKEND + endpoint.acceptToken, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: token
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}



export {
    login,
    forgetPassword,
    changePassword,
    verifyToken
};
