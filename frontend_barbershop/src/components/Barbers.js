import React, { useState, useEffect } from 'react';
import '../commons/styles/barbers.css';
import '../commons/styles/services.css';
import * as API_USERS from "../commons/api/barbers-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { swalComponent } from './Swal';

function Barbers(props) {

    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(0);
    const [bodyTable, setBodyTable] = useState([]);
    const [bodyTableRo, setBodyTableRo] = useState([]);
    const t = props.value;

    useEffect(() => {

        API_USERS.getBarbersPublic((result, status, error) => {
            setBodyTable([]);
            setBodyTableRo([]);
            if (result !== null && (status === 200 || status === 201)) {

                result.map(item => {

                    let services_en = [];
                    let services_ro = [];
                    let packages_en = [];
                    let packages_ro = [];

                    item.packages.map(packagee => {

                        packages_en = [...packages_en, <li key={packagee.nameEn}>
                            {packagee.nameEn}
                        </li>];
                        packages_ro = [...packages_ro, <li key={packagee.nameRo}>
                            {packagee.nameRo}
                        </li>];

                        return packagee;

                    });

                    item.services.map(service => {

                        services_en = [...services_en, <li key={service.nameEn}>
                            {service.nameEn}
                        </li>];
                        services_ro = [...services_ro, <li key={service.nameRo}>
                            {service.nameRo}
                        </li>];

                        return service;

                    });

                    setBodyTable(oldArray => [...oldArray, <tr key={item.id}>

                        <td>

                            <h3>{item.name}</h3>
                            <br />
                            <img src={`data:image/jpeg;base64,${item.photo}`} alt={`barber${item.id}`} width="300" height="300" />


                        </td>

                        <td>

                            {packages_en}

                        </td>

                        <td>

                            {services_en}

                        </td>

                    </tr>]);

                    setBodyTableRo(oldArray => [...oldArray, <tr key={item.id}>

                        <td>

                            <h3>{item.name}</h3>
                            <br />
                            <img src={`data:image/jpeg;base64,${item.photo}`} alt={`barber${item.id}`} width="300" height="300" />


                        </td>

                        <td>

                            {packages_ro}

                        </td>

                        <td>

                            {services_ro}

                        </td>

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
            <br />
            <table className="styled-table">

                <thead>

                    <tr>
                        <th>
                            <h2>{t('header.thirdLink')}</h2>
                        </th>

                        <th>
                            <h2>{t('barbers.packages')}</h2>
                        </th>

                        <th>
                            <h2>{t('barbers.services')}</h2>
                        </th>
                    </tr>


                </thead>

                <tbody>

                    {props.language === 'en' ? bodyTable : bodyTableRo}

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

export default Barbers;