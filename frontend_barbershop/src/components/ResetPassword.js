import React, { useState, useEffect } from "react";
import "../commons/styles/contact.css";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import * as API_USERS from "../commons/api/login-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { useParams } from "react-router-dom";
import { swalComponent, swalComponentWithoutButton } from './Swal';
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2';

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeslash = <FontAwesomeIcon icon={faEyeSlash} />;


function ResetPassword(props) {
    const t = props.value;
    const { register, handleSubmit, errors } = useForm();
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordShown1, setPasswordShown1] = useState(false);
    const [samePassword, setSamePassword] = useState(false);
    const { token } = useParams();
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {

        API_USERS.verifyToken(token, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                swalComponent(t("contact.status"), t('password.validToken'), "success");
            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);

                if (status === 400) {
                    swalComponentWithoutButton(t("contact.status"), t('password.error'), "error");
                }

                if (status === 401) {
                    swalComponentWithoutButton(t("contact.status"), t('password.expired'), "error");
                }
            }
        });


    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    function onSubmit(data) {

        setIsLoading(true);

        if (data.password !== data.password_confirmation) {
            setSamePassword(true);
        }

        else {

            let details = {
                password: data.password,
                password_confirmation: data.password_confirmation,
                token: token

            };

            API_USERS.changePassword(details, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    Swal.fire({
                        title: t("contact.status"),
                        text: t('password.success'),
                        icon: "success",
                        confirmButtonColor: '#8B7871',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {

                            history.push("/");

                        }
                    });

                } else {

                    setError(error);
                    setErrorStatus(status);

                    if (status === 402) {
                        swalComponent(t("contact.status"), t('register.samePassword'), "error");
                    }

                }
            });

        }

        setIsLoading(false);
    };

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const togglePasswordVisiblity1 = () => {
        setPasswordShown1(passwordShown1 ? false : true);
    };


    return (
        <div>
            { errorStatus < 400 ?
                (<div className="containerbig">
                    <br />
                    <div className="containerContact">
                        <form onSubmit={handleSubmit(onSubmit)}>


                            <label> {t("login.password")} </label>
                            <div className="pass-wrapper">
                                <input
                                    name="password"
                                    type={passwordShown ? "text" : "password"}
                                    placeholder={t("login.password")}
                                    ref={register({
                                        required: t("login.errorPassword"),
                                    })}
                                />
                                {passwordShown ?
                                    <i id="i1" onClick={togglePasswordVisiblity}> {eye} </i>
                                    :
                                    <i id="i1" onClick={togglePasswordVisiblity}> {eyeslash} </i>
                                }
                            </div>
                            {errors.password && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.password.message}
                                </div>
                            )}

                            <label> {t("login.password1")} </label>
                            <div className="pass-wrapper">
                                <input
                                    name="password_confirmation"
                                    type={passwordShown1 ? "text" : "password"}
                                    placeholder={t("login.password1")}
                                    ref={register({
                                        required: t("login.errorPassword"),
                                    })}
                                />
                                {passwordShown1 ?
                                    <i id="i2" onClick={togglePasswordVisiblity1}> {eye} </i>
                                    :
                                    <i id="i2" onClick={togglePasswordVisiblity1}> {eyeslash} </i>
                                }
                            </div>
                            {errors.password_confirmation && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.password_confirmation.message}
                                </div>
                            )}

                            {samePassword && (

                                <div className="alert alert-danger" role="alert">
                                    {t('register.samePassword')}
                                </div>
                            )}

                            <br />

                            <div className="buttonHolder">

                                {isLoading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <input type="submit" disabled={isLoading} value={t("contact.submit")} />{" "}
                            </div>{" "}

                        </form>

                        {
                            errorStatus > 402 && <div>
                                <br />
                                <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
                            </div>
                        }

                    </div >

                    <hr />

                    <br />

                </div >)
                :
                (<div className="containerActivation">
                    <br />

                    {errorStatus > 402 &&
                        <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
                    }


                    <br />

                </div >)
            }
        </div>
    );
}

export default ResetPassword;
