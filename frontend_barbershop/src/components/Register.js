import React, { useState, useEffect } from "react";
import "../commons/styles/contact.css";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import * as API_USERS from "../commons/api/register-api";
import { Loader } from './Loader';
import avatar from '../commons/images/avatar.png';
import moment from 'moment';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { validUsername, validName, validEmail, validPassword, validPasswordConfirmation, handleEnter, emptyFields } from './validators';
import { swalComponent } from './Swal';

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeslash = <FontAwesomeIcon icon={faEyeSlash} />;


function Register(props) {
    const t = props.value;
    const { handleSubmit } = useForm();
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordShown1, setPasswordShown1] = useState(false);
    const [samePassword, setSamePassword] = useState(false);
    const [username, setUsername] = useState('');
    const [wasUsernameModified, setWasUsernameModified] = useState(false);
    const [name, setName] = useState('');
    const [wasNameModified, setWasNameModified] = useState(false);
    const [email, setEmail] = useState('');
    const [wasEmailModified, setWasEmailModified] = useState(false);
    const [password, setPassword] = useState('');
    const [wasPasswordModified, setWasPasswordModified] = useState(false);
    const [password_confirmation, setPassword_confirmation] = useState('');
    const [wasPassword_confirmationModified, setWasPassword_confirmationModified] = useState(false);
    const [gender, setGender] = useState(true);
    const [birthDate, setBirthDate] = useState(new Date());
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(t('register.selectCountry'));
    const [selectedState, setSelectedState] = useState(t('register.selectState'));
    const [selectedCity, setSelectedCity] = useState(t('register.selectCity'));
    const [isLoading, setIsLoading] = useState(true);
    const [base64Image, setbase64Image] = useState(undefined);
    const [isCountrySelected, setIsCountrySelected] = useState(true);
    const [isStateSelected, setIsStateSelected] = useState(true);
    const [isCitySelected, setIsCitySelected] = useState(true);
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(0);
    const [defaultCountry, setDefaultCountry] = useState(t('register.selectCountry'));
    const [defaultState, setDefaultState] = useState(t('register.selectState'));
    const [defaultCity, setDefaultCity] = useState(t('register.selectCity'));
    const [token, setToken] = useState(undefined);


    useEffect(() => {

        API_USERS.getToken((result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                setToken(result.auth_token);
            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
            }
        });

        toDataURL(avatar, function (dataUrl) {
            setbase64Image(dataUrl);
        })


    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        API_USERS.getToken((result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                setToken(result.auth_token);
            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
            }
        });

        toDataURL(avatar, function (dataUrl) {
            setbase64Image(dataUrl);
        })


    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        setIsLoading(true);
        setCountries([{ label: t('register.selectCountry'), value: t('register.selectCountry') }]);
        setDefaultCountry(t('register.selectCountry'));
        setDefaultState(t('register.selectState'));
        setDefaultCity(t('register.selectCity'));
        if (token !== undefined) {
            API_USERS.getCountries(token, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    result.map(country => {
                        setCountries(oldArray => [...oldArray, { label: country.country_name, value: country.country_name }]);
                        return country;
                    });
                    setIsLoading(false);

                } else {
                    console.log(status);
                    console.log(error);
                    setError(error);
                    setErrorStatus(status);
                }
            });
        }

    }, [token, props.language]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        
        setStates([{ label: t('register.selectState'), value: t('register.selectState') }]);

        if (selectedCountry !== t('register.selectCountry')) {

            setDefaultCountry(selectedCountry);
            setIsLoading(true);

            API_USERS.getStates(token, selectedCountry, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    let ok = false;
                    result.map(state => {
                        setStates(oldArray => [...oldArray, { label: state.state_name, value: state.state_name }]);
                        if (state.state_name === selectedState) {
                            ok = true;
                        }
                        return state;
                    });

                    if (ok === false) {
                        setSelectedState(t('register.selectState'));
                        setSelectedCity(t('register.selectCity'));
                    }
                    setIsLoading(false);

                } else {
                    console.log(status);
                    console.log(error);
                    setError(error);
                    setErrorStatus(status);

                }
            });
        }

    }, [selectedCountry]) // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {

        setCities([{ label: t('register.selectCity'), value: t('register.selectCity') }]);
        if (selectedState !== t('register.selectState')) {
            setDefaultState(selectedState);
            setIsLoading(true);
            API_USERS.getCities(token, selectedState, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    let ok = false;
                    result.map(city => {
                        setCities(oldArray => [...oldArray, { label: city.city_name, value: city.city_name }]);
                        if (city.city_name === selectedCity) {
                            ok = true;
                        }
                        return city;
                    });

                    if (ok === false) setSelectedCity(t('register.selectState'));

                    if (result.length === 0) {
                        setSelectedCity('None');
                    }

                    setIsLoading(false);

                } else {
                    console.log(status);
                    console.log(error);
                    setError(error);
                    setErrorStatus(status);
                }
            });
        }

    }, [selectedState]) // eslint-disable-line react-hooks/exhaustive-deps
    

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const resetAllElements = () => {

        setIsLoading(true);
        setSelectedCountry(t('register.selectCountry'));
        setSelectedState(t('register.selectState'));
        setSelectedCity(t('register.selectCity'));
        setUsername('');
        setWasUsernameModified(false);
        setName('');
        setWasNameModified(false);
        setEmail('');
        setWasEmailModified(false);
        setPassword('');
        setWasPasswordModified(false);
        setPassword_confirmation('');
        setWasPassword_confirmationModified(false);
        setBirthDate(new Date());
        setGender('M');
        setIsLoading(false);

    }


    const onSubmit = () => {

        emptyFields(username, setWasUsernameModified, name, setWasNameModified, email, setWasEmailModified, password, setWasPasswordModified, password_confirmation, setWasPassword_confirmationModified);


        if (validUsername(username, wasUsernameModified, t) !== undefined || validName(name, wasNameModified, t) !== undefined || validEmail(email, wasEmailModified, t) !== undefined || validPassword(password, wasPasswordModified, t) !== undefined || validPasswordConfirmation(password_confirmation, wasPassword_confirmationModified, t) !== undefined) {
            swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }
        else if (password !== password_confirmation) {
            setSamePassword(true);
            swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }

        else if (selectedCountry === t('register.selectCountry')) {
            setIsCountrySelected(false);
            swalComponent(t("contact.status"), t('register.notComplete'), "error");

        }

        else if (selectedState === t('register.selectState')) {
            setIsStateSelected(false);
            swalComponent(t("contact.status"), t('register.notComplete'), "error");

        }

        else if (selectedCity === t('register.selectCity') && cities.length > 0) {
            setIsCitySelected(false);
            swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }

        else {

            console.log(selectedCity);
            console.log(cities.length);
            console.log(selectedCity === t('register.selectCity'));

            console.log('am ajuns aici')

            const date = moment(birthDate).format("YYYY-MM-DD");
            let user = {
                name: name,
                username: username,
                email: email,
                password: password,
                password_confirmation: password_confirmation,
                birthDate: date,
                gender: gender ? "M" : "F",
                country: selectedCountry,
                state: selectedState,
                city: selectedCity === 0 ? 'None' : selectedCity,
                photo: base64Image,
                subject: t('register.mailSubject'),
                message: t('register.mailMessage')

            };

            API_USERS.postUser(user, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {

                    swalComponent(t("contact.status"), t('register.succes'), "success");
                    resetAllElements();

                } else {

                    console.log(error);
                    console.log(status);

                    if (status === 400) {

                        swalComponent(t("contact.status"), t('register.usernameError'), "error");

                    }

                    else if (status === 401) {

                        swalComponent(t("contact.status"), t('register.emailError'), "error");

                    }

                    else {
                        swalComponent(t('server.problem'), t('server.problem'), "error");
                        setError(error);
                        setErrorStatus(status);
                    }

                }
            });

        }

    };

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const togglePasswordVisiblity1 = () => {
        setPasswordShown1(passwordShown1 ? false : true);
    };

    const onChangeGender = () => {
        setGender(prevState => !prevState);

    }

    const onChangeDate = date => {
        setBirthDate(date);
    }


    return (
        <div className="containerbig">
            <br />
            <br />
            {isLoading ? <Loader /> : (
                <div className="containerContact">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <img
                            src={avatar}
                            alt="profile-img"
                            className="profile-img-card"
                        />

                        <label> {t("login.username")} </label>
                        <input
                            name="username"
                            type="text"
                            value={username}
                            onChange={e => { setUsername(e.target.value); setWasUsernameModified(true); }}
                            placeholder={t("login.username")}
                            onKeyDown={e => handleEnter(e, username, wasUsernameModified, name, wasNameModified, email, wasEmailModified, password, wasPasswordModified, t)}
                        />

                        {validUsername(username, wasUsernameModified, t)}

                        <label> {t("contact.name")} </label>
                        <input
                            name="name"
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setWasNameModified(true); }}
                            placeholder={t("contact.name")}
                            onKeyDown={e => handleEnter(e, username, wasUsernameModified, name, wasNameModified, email, wasEmailModified, password, wasPasswordModified, t)}
                        />

                        {validName(name, wasNameModified, t)}

                        <label>Email</label>

                        <input
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setWasEmailModified(true); }}
                            onKeyDown={e => handleEnter(e, username, wasUsernameModified, name, wasNameModified, email, wasEmailModified, password, wasPasswordModified, t)}
                        />

                        {validEmail(email, wasEmailModified, t)}

                        <label> {t("login.password")} </label>
                        <div className="pass-wrapper">
                            <input
                                name="password"
                                type={passwordShown ? "text" : "password"}
                                placeholder={t("login.password")}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setWasPasswordModified(true); }}
                                onKeyDown={e => handleEnter(e, username, wasUsernameModified, name, wasNameModified, email, wasEmailModified, password, wasPasswordModified, t)}
                            />
                            {passwordShown ?
                                <i id="i1" onClick={togglePasswordVisiblity}> {eye} </i>
                                :
                                <i id="i1" onClick={togglePasswordVisiblity}> {eyeslash} </i>
                            }
                        </div>

                        {validPassword(password, wasPasswordModified, t)}

                        <label> {t("login.password1")} </label>
                        <div className="pass-wrapper">
                            <input
                                name="password_confirmation"
                                type={passwordShown1 ? "text" : "password"}
                                placeholder={t("login.password")}
                                value={password_confirmation}
                                onChange={e => { setPassword_confirmation(e.target.value); setWasPassword_confirmationModified(true); }}
                            />
                            {passwordShown1 ?
                                <i id="i2" onClick={togglePasswordVisiblity1}> {eye} </i>
                                :
                                <i id="i2" onClick={togglePasswordVisiblity1}> {eyeslash} </i>
                            }
                        </div>

                        {validPasswordConfirmation(password_confirmation, wasPassword_confirmationModified, t)}

                        {samePassword && (

                            <div className="alert alert-danger" role="alert">
                                {t('register.samePassword')}
                            </div>
                        )}

                        <label> {t("register.birthdate")} </label>

                        <div>
                            <DatePicker
                                selected={birthDate}
                                onChange={onChangeDate}
                                maxDate={new Date()}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="scroll"
                            />
                        </div>


                        <label> {t("register.gender")} </label>

                        <div className="radio">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={gender === true}
                                    onChange={onChangeGender}
                                />
                                Male
                            </label>

                            &nbsp;
                            &nbsp;
                            &nbsp;

                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={gender === false}
                                    onChange={onChangeGender}
                                />
                                Female
                            </label>
                        </div>

                        <label> {t("register.country")} </label>

                        <Select
                            name="form-dept-select"
                            options={countries}
                            defaultValue={{ label: selectedCountry === t('register.selectCountry') ? t('register.selectCountry') : defaultCountry, value: t('register.selectCountry') }}
                            onChange={e => {
                                setSelectedCountry(e.value);
                                setIsCountrySelected(true);
                            }}
                        />

                        {!isCountrySelected && (

                            <div className="alert alert-danger" role="alert">
                                {t('register.selectCountry')}
                            </div>
                        )}

                        <label> {t("register.state")} </label>


                        <Select
                            name="form-dept-select"
                            options={states}
                            defaultValue={{ label: selectedState === t('register.selectState') ? t('register.selectState') : defaultState, value: t('register.selectState') }}
                            onChange={e => {
                                setSelectedState(e.value);
                                setIsStateSelected(true);

                            }}
                        />


                        {!isStateSelected && (

                            <div className="alert alert-danger" role="alert">
                                {t('register.selectState')}
                            </div>
                        )}

                        <label> {t("register.city")} </label>


                        <Select
                            name="form-dept-select"
                            options={cities}
                            defaultValue={{ label: selectedCity === t('register.selectCity') ? t('register.selectCity') : defaultCity, value: t('register.selectCity') }}
                            onChange={e => {
                                setSelectedCity(e.value);
                                setIsCitySelected(true);
                            }}
                        />

                        {!isCitySelected && (

                            <div className="alert alert-danger" role="alert">
                                {t('register.selectCity')}
                            </div>
                        )}

                        <br />

                        <div className="buttonHolder">
                            <input type="submit" value={t("register.submit")} />{" "}
                        </div>{" "}

                    </form>

                    {
                        errorStatus > 401 && <div>
                            <br />
                            <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
                        </div>
                    }

                </div >
            )
            }

            <hr />

            <br />
        </div >
    );
}

export default Register;
