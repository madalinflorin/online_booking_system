import React, { useState, useEffect } from "react";
import '../commons/styles/services.css';
import * as API_USERS from "../commons/api/service-api";
import Swal from 'sweetalert2';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

function Services(props) {

    const t = props.value;

    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(0);
    const [services, setServices] = useState([]);
    const [servicesRo, setServicesRo] = useState([]);
    const [packages, setPackages] = useState([]);
    const [packagesRo, setPackagesRo] = useState([]);


    const swalComponent = (header, message, severity) => {
        Swal.fire({
            title: header,
            text: message,
            icon: severity,
            confirmButtonColor: '#8B7871'
        });
    }

    useEffect(() => {

        API_USERS.getServices((result, status, error) => {
            setServices([]);
            setServicesRo([]);
            if (result !== null && (status === 200 || status === 201)) {

                result.map(item => {
                    setServices(oldArray => [...oldArray,
                    <tr key={item.id}>

                        <td>{item.nameEn}</td>
                        <td>{item.price} lei</td>
                        <td>{item.duration} minutes</td>

                    </tr>]);

                    setServicesRo(oldArray => [...oldArray,
                    <tr key={item.id}>

                        <td>{item.nameRo}</td>
                        <td>{item.price} lei</td>
                        <td>{item.duration} minute</td>

                    </tr>]);

                    return item;
                })


            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                swalComponent(t('server.problem'), t('server.problem'), "error");
            }
        });

        API_USERS.getPackagesPublic((result, status, error) => {
            setPackages([]);
            setPackagesRo([]);
            if (result !== null && (status === 200 || status === 201)) {


                result.map(item => {

                    const date = Date.now();
                    const ok = date > new Date(item.startDiscountPeriod) && date < new Date(item.endDiscountPeriod);

                    let price = 0;
                    let duration = 0;

                    let services_aux = [];
                    let services_aux_ro = [];

                    item.services.map(service => {

                        duration = duration + service.duration;
                        price = price + service.price;
                        services_aux = [...services_aux, <li key={service.id}>{service.nameEn}</li>];
                        services_aux_ro = [...services_aux_ro, <li key={service.id}>{service.nameRo}</li>];
                        return service;
                    });

                    setPackages(oldArray => [...oldArray, <tr key={item.id}>

                        <td>{item.nameEn}</td>
                        <td>{services_aux}</td>
                        {ok ?
                            <td><del>{price}</del> {(price - item.discount * price / 100)} lei</td>
                            :
                            <td>{price} lei</td>}
                        <td>{duration} minutes</td>

                    </tr>]);


                    setPackagesRo(oldArray => [...oldArray, <tr key={item.id}>

                        <td>{item.nameRo}</td>
                        <td>{services_aux_ro}</td>
                        {ok ?
                            <td><del>{price}</del> {(price - item.discount * price / 100)} lei</td>
                            :
                            <td>{price} lei</td>}
                        <td>{duration} minute</td>

                    </tr>]);

                    return item;

                }

                );


            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                swalComponent(t('server.problem'), t('server.problem'), "error");
            }
        });


    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (

        <div className="contentServicii">
            <br />
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>{t('services.th1')}</th>
                        <th>{t('services.th2')}</th>
                        <th>{t('services.th3')}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.language === 'en' ? services : servicesRo}
                </tbody>
            </table>
            <hr />
            <br />

            <table className="styled-table">
                <thead>
                    <tr>
                        <th>{t('services.packet')}</th>
                        <th>{t('services.services')}</th>
                        <th>{t('services.th2')}</th>
                        <th>{t('services.th3')}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.language ==='en' ? packages : packagesRo}
                </tbody>
            </table>
            <hr />
            <br />

            {

                errorStatus > 401 &&
                <div>

                    <br />
                    <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
                </div>
            }

        </div>

    )

}

export default Services;
