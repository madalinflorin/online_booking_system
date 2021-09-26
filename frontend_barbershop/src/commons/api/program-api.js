import RestApiClient from "./rest-client";
import authHeader from '../../services/auth-header';
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    program: '/program',
    programBarber: '/program/barber'
};



function getProgram(callback) {
    let request = new Request(BACKEND + endpoint.program, {
        method: 'GET',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getProgramForBarber(barber, day, callback) {
    let request = new Request(BACKEND + endpoint.program + "/user_id=" + barber + "&day=" + day, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getAllProgramsForBarber(barber, callback) {
    let request = new Request(BACKEND + endpoint.program + "/all/user_id=" + barber, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


export {
    getProgram,
    getProgramForBarber,
    getAllProgramsForBarber
};
