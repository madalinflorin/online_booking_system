import React, { useState } from "react";
import "../commons/styles/contact.css";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeslash = <FontAwesomeIcon icon={faEyeSlash} />;


function OldPassword(props) {
    const t = props.t;
    const { register, handleSubmit, errors } = useForm();
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordShown1, setPasswordShown1] = useState(false);
    const [samePassword, setSamePassword] = useState(false);
    const user = props.user;


    function onSubmit(data) {

        if (data.password !== data.password_confirmation) {
            setSamePassword(true);
        }

        else {
            let userData = user;
            userData.password = data.password;
            userData.password_confirmation = data.password_confirmation;
            props.sendData(userData);


        }
    };

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const togglePasswordVisiblity1 = () => {
        setPasswordShown1(passwordShown1 ? false : true);
    };


    return (
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
                <input type="submit" value={t("contact.submit")} />{" "}
            </div>{" "}

        </form>
    );
}

export default OldPassword;
