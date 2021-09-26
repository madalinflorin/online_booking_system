import RestApiClient from "./rest-client";
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    barbers_public : '/user/public/barbers'
};



function getBarbersPublic(callback) {
    let request = new Request(BACKEND + endpoint.barbers_public, {
        method: 'GET',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


export {
    getBarbersPublic
};
