import RestApiClient from "./rest-client";
import authHeader from '../../services/auth-header';
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    graphic : '/graphic'
};

function getGraphicForCurrentMonth(month, year, callback) {
    let request = new Request(BACKEND + endpoint.graphic + "/month=" + month + "&year=" + year, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


function getGraphicForCurrentYear(year, callback) {
    let request = new Request(BACKEND + endpoint.graphic + "/year=" + year, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getGraphicForCountries(callback) {
    let request = new Request(BACKEND + endpoint.graphic + "/countries", {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getGraphicForStates(callback) {
    let request = new Request(BACKEND + endpoint.graphic + "/states", {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


function getGraphicForCities(callback) {
    let request = new Request(BACKEND + endpoint.graphic + "/cities", {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getGraphicForGender(callback) {
    let request = new Request(BACKEND + endpoint.graphic + "/gender", {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}




export {
    getGraphicForCurrentMonth,
    getGraphicForCurrentYear,
    getGraphicForCountries,
    getGraphicForStates,
    getGraphicForCities,
    getGraphicForGender
};
