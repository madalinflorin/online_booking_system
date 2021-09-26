import RestApiClient from "./rest-client";
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    contact: '/user/contact'
};



function postContact(contact, callback) {
    console.log(contact);
    let request = new Request(BACKEND + endpoint.contact, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}



export {
    postContact
};
