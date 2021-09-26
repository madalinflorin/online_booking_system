import React, { useState, useEffect } from 'react';
import '../commons/styles/services.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import AuthService from '../services/AuthService';
import DatePicker from "react-datepicker";
import * as API_USERS from "../commons/api/register-api";
import { Loader } from './Loader';
import moment from 'moment';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { validName, validEmail, validPassword, handleEnter, emptyFields } from './validators';
import * as API_SERVICES from "../commons/api/service-api";
import { swalComponent } from './Swal';
import MyModal from './Modal';
import OldPassword from './OldPassword';
import imageCompression from 'browser-image-compression';
import { useHistory } from "react-router-dom";

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeslash = <FontAwesomeIcon icon={faEyeSlash} />;

function Profile(props) {

    const { handleSubmit } = useForm();
    const [passwordShown, setPasswordShown] = useState(false);
    const t = props.value;
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [wasNameModified, setWasNameModified] = useState(false);
    const [email, setEmail] = useState('');
    const [wasEmailModified, setWasEmailModified] = useState(false);
    const [password, setPassword] = useState('');
    const [wasPasswordModified, setWasPasswordModified] = useState(false);
    const [gender, setGender] = useState(undefined);
    const [birthDate, setBirthDate] = useState(undefined);
    const [state, setState] = useState(undefined);
    const [city, setCity] = useState(undefined);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [selectedState, setSelectedState] = useState(0);
    const [selectedCity, setSelectedCity] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCountrySelected, setIsCountrySelected] = useState(true);
    const [isStateSelected, setIsStateSelected] = useState(true);
    const [isCitySelected, setIsCitySelected] = useState(true);
    const [defaultState] = useState({ label: t('register.selectState'), value: 0 });
    const [defaultCity] = useState({ label: t('register.selectCity'), value: 0 });
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(0);
    const currentUser = AuthService.getCurrentUser();
    const [selectedImage, setSelectedImage] = useState();
    const [isBarber, setIsBarber] = useState(false);
    const [services, setServices] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const language = localStorage.getItem('i18nextLng');
    const [show, setShow] = useState(false);
    const [user, setUser] = useState();
    const history = useHistory();
    const [token, setToken] = useState(undefined);


    const handleClose = () => {
        setShow(false);
    }
    const handleSelectMultipleServices = (e) => {
        setSelectedServices(e);
    }

    const handleSelectMultiplePackages = (e) => {
        setSelectedPackages(e);
    }

    useEffect(() => {

        fetchData();

    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function fetchData() {

        currentUser.roles.map(role => {
            if (role === "ROLE_BARBER")
                setIsBarber(true);
            return role;
        })

        API_SERVICES.getPackages((result, status, error) => {
            setPackages([]);
            if (result !== null && (status === 200 || status === 201)) {

                result.map(item => {

                    language === 'en' ?
                        setPackages(oldArray => [...oldArray, { label: item.nameEn, value: item.id }])
                        :
                        setPackages(oldArray => [...oldArray, { label: item.nameRo, value: item.id }])

                    return item;
                }
                );

            } else {
                console.log(status);
                console.log(error);
                if (status === 401) {
                    history.push("/");
                }
                else {
                    props.swalComponent(t('server.problem'), t('server.problem'), "error");
                }

            }
        });

        API_SERVICES.getServices((result, status, error) => {
            setServices([]);
            if (result !== null && (status === 200 || status === 201)) {

                result.map(item => {

                    language === 'en' ?
                        setServices(oldArray => [...oldArray, { label: item.nameEn, value: item.id }])
                        :
                        setServices(oldArray => [...oldArray, { label: item.nameRo, value: item.id }])

                    return item;
                }
                );

            } else {
                console.log(status);
                console.log(error);
                if (status === 401) {
                    history.push("/");
                }
                else {
                    props.swalComponent(t('server.problem'), t('server.problem'), "error");
                }

            }
        });

        API_USERS.getUser(currentUser.username, currentUser.accessToken, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                if (result.services) {
                    result.services.map(p => {
                        language === 'en' ?
                            setSelectedServices(oldArray => [...oldArray, { label: p.nameEn, value: p.id }])
                            :
                            setSelectedServices(oldArray => [...oldArray, { label: p.nameRo, value: p.id }])
                        return p;
                    })
                }

                if (result.packages) {
                    result.packages.map(p => {
                        language === 'en' ?
                            setSelectedPackages(oldArray => [...oldArray, { label: p.nameEn, value: p.id }])
                            :
                            setSelectedPackages(oldArray => [...oldArray, { label: p.nameRo, value: p.id }])
                        return p;
                    })
                }

                console.log(result);

                setUsername(result.username);
                setName(result.name);
                setEmail(result.email);
                setPassword("");
                result.gender === 'M' ?
                    setGender(true) : setGender(false);
                setBirthDate(new Date(result.birthDate));
                setSelectedImage(`data:image/jpeg;base64,${result.photo}`);
                setState(result.state);
                setCity(result.city);
                const currentUser = AuthService.getCurrentUser();
                currentUser.country = result.country;
                currentUser.state = result.state;
                currentUser.city = result.city;
                localStorage.setItem("user", JSON.stringify(currentUser));
            } else {
                console.log(status);
                console.log(error);
                if (status === 401) {
                    history.push("/");
                }
                setError(error);
                setErrorStatus(status);
            }
        });


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

    }

    useEffect(() => {

        setCountries([]);
        if (token !== undefined) {
            API_USERS.getCountries(token, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    result.map(country => {
                        setCountries(oldArray => [...oldArray, { label: country.country_name, value: country.country_name }]);
                        return country;
                    });
                    setSelectedCountry(AuthService.getCurrentUser().country);

                } else {
                    console.log(status);
                    console.log(error);
                    setError(error);
                    setErrorStatus(status);
                }
            });
        }

    }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        setStates([])
        if (selectedCountry !== 0) {

            setIsLoading(true);

            API_USERS.getStates(token, selectedCountry, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    let ok = false;
                    result.map(item => {
                        setStates(oldArray => [...oldArray, { label: item.state_name, value: item.state_name }]);
                        if (item.state_name === state) {
                            ok = true;
                        }
                        return item;
                    });

                    ok === true ? setSelectedState(state) : setSelectedState(defaultState.label);
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

        setCities([]);
        if (selectedState !== 0) {

            setIsLoading(true);

            API_USERS.getCities(token, selectedState, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    let ok = false;
                    result.map(item => {
                        setCities(oldArray => [...oldArray, { label: item.city_name, value: item.city_name }]);
                        if (item.city_name === city) { ok = true; }
                        return item;
                    });

                    ok === true ? setSelectedCity(city) : setSelectedCity(defaultCity.label);

                    if (result.length === 0) {
                        setSelectedCity('None');
                    }

                } else {
                    console.log(status);
                    console.log(error);
                    setError(error);
                    setErrorStatus(status);
                }
            });
        }

    }, [selectedState]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        if (selectedCity !== 0)
            setIsLoading(false);

    }, [selectedCity]) // eslint-disable-line react-hooks/exhaustive-deps


    function onSubmit() {

        emptyFields(username, setWasNameModified, name, setWasNameModified, email, setWasEmailModified, password, setWasPasswordModified, 'not_null', setWasPasswordModified);

        if (password === '') {
            swalComponent(t("contact.status"), t('login.errorPassword'), "error");
        }

        else if (validName(name, wasNameModified, t) !== undefined || validEmail(email, wasEmailModified, t) !== undefined || validPassword(password, wasPasswordModified, t) !== undefined ) {
            swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }

        else if (selectedCountry === 0) {
            setIsCountrySelected(false);
            swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }

        else if (selectedState === 0 || selectedState === defaultState.label) {
            setIsStateSelected(false);
            swalComponent(t("contact.status"), t('register.notComplete'), "error");

        }

        else if ((selectedCity === t('register.selectCity') || selectedCity === 0) && cities.length > 1) {

            setIsCitySelected(false);
            swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }

        else {

            let services = selectedServices.map(s => s.value);
            let packages = selectedPackages.map(p => p.value);

            const date = moment(birthDate).format("YYYY-MM-DD");
            let user = {
                id: currentUser.id,
                name: name,
                username: currentUser.username,
                email: email,
                newPassword: password,
                password: password,
                password_confirmation: password,
                birthDate: date,
                gender: gender ? "M" : "F",
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
                photo: selectedImage,
                subject: 'none',
                message: 'none',
                services_id: services,
                packages_id: packages

            };

            setShow(true);
            setUser(user);

        };



    };

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const onChangeGender = () => {
        setGender(prevGender => !prevGender);

    }

    const onChangeDate = date => {
        setBirthDate(date);
    }

    async function changeHandler(event) {
        var reader = new FileReader();

        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 500,
            useWebWorker: true
        }
        try {
            const compressedFile = await imageCompression(imageFile, options);
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

            reader.onloadend = function () {
                setSelectedImage(reader.result);
            }
            reader.readAsDataURL(compressedFile);

        } catch (error) {
            console.log(error);
        }

    };

    const sendData = (userData) => {

        API_USERS.updateProfile(userData, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                swalComponent(t("contact.status"), t('profile.status'), "success");
                handleClose();
                const currentUser = AuthService.getCurrentUser();
                currentUser.photo = result.photo;
                localStorage.setItem("user", JSON.stringify(currentUser));

            } else {

                console.log(error);
                console.log(status);

                if (status === 400) {
                    swalComponent(t('contact.status'), t('register.usernameError'), "error");
                }
                else if (status === 401) {
                    swalComponent(t('contact.status'), t('login.error'), "error");
                }
                else if (status === 404) {
                    swalComponent(t('contact.status'), t('register.emailError'), "error");
                }
                else if (status === 402) {
                    swalComponent(t('contact.status'), t('admin.errorFindService'), "error");
                }
                else if (status === 403) {
                    swalComponent(t('contact.status'), t('admin.errorFindPackage'), "error");
                }
                else {

                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }
            }

        });
    }

    return (
        <div className="containerbig">
            {isLoading ? <Loader /> :
                <div className="containerContact">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <img
                            src={selectedImage}
                            alt="profile-img"
                            className="profile-img-card"

                        />

                        <input className="profile-img-input" type="file" accept="image/*" onChange={changeHandler} />

                        <label> {t("login.username")} </label>
                        <input
                            name="username"
                            type="text"
                            value={username}
                            disabled={true}
                            placeholder={t("login.username")}
                        />

                        <label> {t("contact.name")} </label>
                        <input
                            name="name"
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setWasNameModified(true); }}
                            placeholder={t("contact.name")}
                            onKeyDown={e => handleEnter(e, username, false, name, wasNameModified, email, wasEmailModified, password, wasPasswordModified, t)}
                        />

                        {validName(name, wasNameModified, t)}

                        <label>Email</label>

                        <input
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setWasEmailModified(true); }}
                            onKeyDown={e => handleEnter(e, username, false, name, wasNameModified, email, wasEmailModified, password, wasPasswordModified, t)}
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
                                onKeyDown={e => handleEnter(e, username, false, name, wasNameModified, email, wasEmailModified, password, wasPasswordModified, t)}
                            />
                            {passwordShown ?
                                <i id="i1" onClick={togglePasswordVisiblity}> {eye} </i>
                                :
                                <i id="i1" onClick={togglePasswordVisiblity}> {eyeslash} </i>
                            }
                        </div>

                        {validPassword(password, wasPasswordModified, t)}

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
                            defaultValue={{ label: selectedCountry, value: selectedCountry }}
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
                            defaultValue={{ label: selectedState, value: selectedState }}
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
                            defaultValue={{ label: selectedCity, value: selectedCity }}
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

                        {isBarber &&
                            <div>
                                <label> {t("admin.option1")} </label>
                                <Select
                                    name="form-dept-select"
                                    options={services}
                                    defaultValue={selectedServices}
                                    isMulti
                                    onChange={handleSelectMultipleServices}
                                />

                                <label> {t("admin.option2")} </label>
                                <Select
                                    name="form-dept-select"
                                    options={packages}
                                    defaultValue={selectedPackages}
                                    isMulti
                                    onChange={handleSelectMultiplePackages}
                                />
                            </div>
                        }
                        <br />
                        <div className="buttonHolder">
                            <input type="submit" value={t("profile.button")} />{" "}
                        </div>{" "}
                    </form>
                    <MyModal component={<OldPassword t={t} user={user} handleClose={handleClose} sendData={sendData} />} header={t('profile.oldPassword')} show={show} handleClose={handleClose} />

                    {
                        errorStatus > 401 && <div>
                            <br />
                            <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
                        </div>
                    }

                </div>
            }

            <hr />

            <br />
        </div >
    );
}

export default Profile;