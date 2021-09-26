import RestApiClient from "./rest-client";
import authHeader from '../../services/auth-header';
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    chat : '/chat/access',
    messages: '/chat/all',
    delete : '/chat/delete'
};



function verifyAccess(callback) {
    let request = new Request(BACKEND + endpoint.chat, {
        method: 'GET',
        headers: authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getMessages(callback) {
    let request = new Request(BACKEND + endpoint.messages, {
        method: 'GET',
        headers: authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteMessages(callback) {
    let request = new Request(BACKEND + endpoint.delete, {
        method: 'DELETE',
        headers: authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}



export {
    verifyAccess,
    getMessages,
    deleteMessages
};
