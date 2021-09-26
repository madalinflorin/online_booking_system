import React, { useState } from "react";
import "../commons/styles/contact.css";
import { useForm } from "react-hook-form";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_USERS from "../commons/api/login-api";
import {swalComponent} from './Swal';


function ForgetPassword(props) {
    const { register, handleSubmit, reset, errors } = useForm();
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(0);
    const t = props.value;


    function onSubmit(data) {

        let details = {
            email: data.email,
            subject: t('login.mailSubject'),
            message: t('login.mailMessage')

        }

        API_USERS.forgetPassword(details, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                reset();
                swalComponent(t("contact.status"), t('login.resetPassword_success'), "success");

            } else {

                setError(error);
                setErrorStatus(status);
                console.log(status);
                console.log(error);
                swalComponent(t("contact.status"), t('login.resetPassword_error'), "error");

            }

        });

    };


    return (
        <div className="containerbig">
            <br />
            <div className="containerContact">
                <form onSubmit={handleSubmit(onSubmit)}>

                    <label>Email</label>
                    <input
                        name="email"
                        type="text"
                        placeholder="Email"
                        ref={register({
                            required: t('contact.errorEmail'),
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: t('contact.errorEmailValid'),
                            },
                        })}
                    />

                    {errors.email &&
                        <div className="alert alert-danger" role="alert">
                            {errors.email.message}
                        </div>}

                    <br />

                    <div className="buttonHolder">
                        <input type="submit" value={t("contact.submit")} />{" "}
                    </div>{" "}
                </form>
                {
                    errorStatus > 401 && <div>
                        <br />
                        <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
                    </div>
                }
            </div>

            <hr />

            <br />

        </div>
    );
}

export default ForgetPassword;
