import React, { useState } from "react";
import "../commons/styles/contact.css";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import Swal from 'sweetalert2';
import * as API_USERS from "../commons/api/login-api";
import {swalComponent} from './Swal';

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeslash = <FontAwesomeIcon icon={faEyeSlash} />;

function Login(props) {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(0);

  const swalComponentSucces = (header, message, severity) => {
    Swal.fire({
      title: header,
      text: message,
      icon: severity,
      confirmButtonColor: '#8B7871'
    })
      .then((result) => {
        if (result.isConfirmed) {
          props.setIsModified(prevState => !prevState);
        }
      })
  }


  function onSubmit(data) {

    let user = {
      username: data.username,
      password: data.password
    };


    API_USERS.login(user, (result, status, error) => {
      if (result !== null && (status === 200 || status === 201)) {

        console.log(result);

        result.jwtExpirationMs = result.jwtExpirationMs + new Date().getTime();

        localStorage.setItem("user", JSON.stringify(result));
        history.push("/");

        swalComponentSucces(t('login.success'), t('login.welcome') + result.username + "!", "success");

      } else {
        console.log(status);
        console.log(error);
        if (status === 400) {

          swalComponent(t("contact.status"), t('login.activate'), "warning");

        }
        else if (status === 401) {
          swalComponent(t("contact.status"), t('login.error'), "error");
        }

        else {
          setError(error);
          setErrorStatus(status);
          swalComponent(t('server.problem'), t('server.problem'), "error");
        }

      }


    });

  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const t = props.value;

  return (
    <div className="containerbig">
      <br />
      <br />
      <div className="containerContact">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label> {t("login.username")} </label>
          <input
            name="username"
            type="text"
            placeholder={t("login.username")}
            ref={register({
              required: t("login.errorUsername"),
              minLength: 3,
              pattern: {
                value: /^[a-zA-Z]+([a-zA-Z0-9])*$/i,
                message: t('login.errorUsername'),
              },
            })}
          />
          {errors.username && (
                <div className="alert alert-danger" role="alert">
                    {errors.username.message}
                </div>
            )}
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
            <i id="i3" onClick={togglePasswordVisiblity}> {eye} </i>
            :
            <i id="i3" onClick={togglePasswordVisiblity}> {eyeslash} </i>
            }

          </div>

          {errors.password && (
                <div className="alert alert-danger" role="alert">
                    {errors.password.message}
                </div>
            )}


          <a href="/forget_password" className="center-screen-a">{t('login.forget_password')}</a>

          <br />

          <div className="buttonHolder">
            <input type="submit" value={t("login.login")} />{" "}
          </div>{" "}

          {
            errorStatus > 401 && <div>
              <br />
              <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
            </div>
          }
        </form>
      </div>
      
      <hr />

      <br />
    </div>
  );
}

export default Login;
