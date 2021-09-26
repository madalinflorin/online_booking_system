import RestApiClient from "./rest-client";
import authHeader from '../../services/auth-header';
import {HOST} from '../../constants/host';

const BACKEND = HOST.backend_api;

const endpoint = {
    services : '/service/all',
    packages : '/package/all',
    packagesPublic : '/package/public/all',
    addService: '/service/insert',
    deleteService: '/service/delete/',
    editService: '/service/update',
    postPackage: '/package/insert',
    deletePackage: '/package/delete/',
    getPackage: '/package/',
    editPackage: '/package/update'
};



function getServices(callback) {
    let request = new Request(BACKEND + endpoint.services, {
        method: 'GET',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPackages(callback) {
    let request = new Request(BACKEND + endpoint.packages, {
        method: 'GET',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPackagesPublic(callback) {
    let request = new Request(BACKEND +  endpoint.packagesPublic, {
        method: 'GET',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}



function postService(service, callback) {
    console.log(service);
    let request = new Request(BACKEND + endpoint.addService, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(service)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


function deleteService(id, callback) {
    console.log(id);
    let request = new Request(BACKEND + endpoint.deleteService + id, {
        method: 'DELETE',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}


function editService(service, callback) {
    console.log(service);
    let request = new Request(BACKEND + endpoint.editService, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(service)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postPackage(packagee, callback) {
    console.log(packagee);
    
    let request = new Request(BACKEND + endpoint.postPackage, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(packagee)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function deletePackage(id, callback) {
    console.log(id);
    let request = new Request(BACKEND + endpoint.deletePackage + id, {
        method: 'DELETE',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPackage(id, callback) {
    console.log(id);
    let request = new Request(BACKEND + endpoint.getPackage + id, {
        method: 'GET',
        headers : authHeader()
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function editPackage(packagee, callback) {
    console.log(packagee);
    let request = new Request(BACKEND + endpoint.editPackage, {
        method: 'POST',
        headers : authHeader(),
        body: JSON.stringify(packagee)
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}



export {
    getServices,
    getPackages,
    postService,
    deleteService,
    editService,
    postPackage,
    deletePackage,
    getPackage,
    editPackage,
    getPackagesPublic
};
