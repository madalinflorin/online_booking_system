import React, { useState, useEffect } from "react";
import "../commons/styles/contact.css";
import * as API_USERS from "../commons/api/register-api";
import { Loader } from './Loader';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { useParams } from "react-router-dom";
import {swalComponentWithoutButton} from './Swal';

function ActivationPage(props) {
    const t = props.value;
    const { username } = useParams();
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {

        setIsLoading(true);

        API_USERS.activation(username, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                swalComponentWithoutButton(t('activate.header'),t('activate.success'),"success");

            }
            else if (result !== null && (status === 202)) {

                swalComponentWithoutButton(t('activate.header'),t('activate.null'),"warning");
            }

            else if (status === 400) {

                swalComponentWithoutButton(t('activate.header'),t('activate.error'),"error");
            }

            else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);

                swalComponentWithoutButton(t('server.problem'),t('server.problem'),"error");

            }
        });

        setIsLoading(false);


    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="containerActivation">
            <br />

            {isLoading ? <Loader /> :
                (
                    errorStatus > 400 &&
                    <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
                )
            }

            <br />

        </div >
    );
}

export default ActivationPage;
