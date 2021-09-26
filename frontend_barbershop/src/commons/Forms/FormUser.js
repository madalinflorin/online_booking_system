import React, { useState, useEffect } from "react";
import "../styles/contact.css";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import * as API_USERS from "../api/register-api";
import { Loader } from '../../components/Loader';
import avatar from '../images/avatar.png';
import moment from 'moment';
import { validUsername, validName, validEmail, validPassword, validPasswordConfirmation, handleEnter, emptyFields } from '../../components/validators';
import * as API_SERVICES from "../api/service-api";
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import imageCompression from 'browser-image-compression';

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeslash = <FontAwesomeIcon icon={faEyeSlash} />;


function FormUser(props) {
    const t = props.value;
    const { handleSubmit } = useForm();
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordShown1, setPasswordShown1] = useState(false);
    const [samePassword, setSamePassword] = useState(false);
    const [username, setUsername] = useState(props.defaultUsername ? props.defaultUsername : '');
    const [wasUsernameModified, setWasUsernameModified] = useState(false);
    const [name, setName] = useState(props.defaultName ? props.defaultName : '');
    const [wasNameModified, setWasNameModified] = useState(false);
    const [email, setEmail] = useState(props.defaultEmail ? props.defaultEmail : '');
    const [wasEmailModified, setWasEmailModified] = useState(false);
    const [password, setPassword] = useState('');
    const [wasPasswordModified, setWasPasswordModified] = useState(false);
    const [password_confirmation, setPassword_confirmation] = useState('');
    const [wasPassword_confirmationModified, setWasPassword_confirmationModified] = useState(false);
    const [gender, setGender] = useState(props.defaultGender ? props.defaultGender === 'M' ? true : false : true);
    const [birthDate, setBirthDate] = useState(props.defaultBirthDate ? new Date(props.defaultBirthDate) : new Date());
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(t('register.selectCountry'));
    const [selectedState, setSelectedState] = useState(t('register.selectState'));
    const [selectedCity, setSelectedCity] = useState(t('register.selectCity'));
    const [isLoading, setIsLoading] = useState(true);
    const [isCountrySelected, setIsCountrySelected] = useState(true);
    const [isStateSelected, setIsStateSelected] = useState(true);
    const [isCitySelected, setIsCitySelected] = useState(true);
    const [defaultCountry] = useState({ label: t('register.selectCountry'), value: t('register.selectCountry') });
    const [defaultState] = useState({ label: t('register.selectState'), value: t('register.selectState') });
    const [defaultCity] = useState({ label: t('register.selectCity'), value: t('register.selectCity') });
    const [chooseRoles, setChooseRoles] = useState([]);
    const [chooseServices, setChooseServices] = useState([]);
    const [choosePackages, setChoosePackages] = useState([]);
    const [services, setServices] = useState([]);
    const [packages, setPackages] = useState();
    const language = localStorage.getItem('i18nextLng');
    const [isBarber, setIsBarber] = useState(props.isBarber ? props.isBarber : false);
    const [timeMondayStart, setTimeMondayStart] = useState(new Date());
    const [timeMondayEnd, setTimeMondayEnd] = useState(new Date());
    const [timeTuesdayStart, setTimeTuesdayStart] = useState(new Date());
    const [timeTuesdayEnd, setTimeTuesdayEnd] = useState(new Date());
    const [timeWednesdayStart, setTimeWednesdayStart] = useState(new Date());
    const [timeWednesdayEnd, setTimeWednesdayEnd] = useState(new Date());
    const [timeThursdayStart, setTimeThursdayStart] = useState(new Date());
    const [timeThursdayEnd, setTimeThursdayEnd] = useState(new Date());
    const [timeFridayStart, setTimeFridayStart] = useState(new Date());
    const [timeFridayEnd, setTimeFridayEnd] = useState(new Date());
    const [timeSaturdayStart, setTimeSaturdayStart] = useState(new Date());
    const [timeSaturdayEnd, setTimeSaturdayEnd] = useState(new Date());
    const [timeSundayStart, setTimeSundayStart] = useState(new Date());
    const [timeSundayEnd, setTimeSundayEnd] = useState(new Date());
    const [isOkMonday, setIsOkMonday] = useState(false);
    const [isOkTuesday, setIsOkTuesday] = useState(false);
    const [isOkWednesday, setIsOkWednesday] = useState(false);
    const [isOkThursday, setIsOkThursday] = useState(false);
    const [isOkFriday, setIsOkFriday] = useState(false);
    const [isOkSaturday, setIsOkSaturday] = useState(false);
    const [isOkSunday, setIsOkSunday] = useState(false);
    const [freeMonday, setFreeMonday] = useState(false);
    const [freeTuesday, setFreeTuesday] = useState(false);
    const [freeWednesday, setFreeWednesday] = useState(false);
    const [freeThursday, setFreeThursday] = useState(false);
    const [freeFriday, setFreeFriday] = useState(false);
    const [freeSaturday, setFreeSaturday] = useState(false);
    const [freeSunday, setFreeSunday] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedImage, setSelectedImage] = useState();
    const [token, setToken] = useState(undefined);
    

    const roles = [
        {
            label: "User", value: "user"
        },
        {
            label: "Barber", value: "barber"
        },
        {
            label: "Admin", value: "admin"
        }
    ];


    useEffect(() => {


        if (props.isBarber) {
            setChoosePackages(props.defaultPackages);
            setChooseServices(props.defaultServices);
            setSelectedServices(props.defaultServices);
            setSelectedPackages(props.defaultPackages);
            setFreeMonday(true);
            setFreeTuesday(true);
            setFreeWednesday(true);
            setFreeThursday(true);
            setFreeFriday(true);
            setFreeSaturday(true);
            setFreeSunday(true);
            props.defaultPrograms.map(program => {
                if (program.day === 1) {
                    setTimeMondayStart(program.startProgram);
                    setTimeMondayEnd(program.endProgram);
                    setIsOkMonday(true);
                    setFreeMonday(false);

                }
                if (program.day === 2) {
                    setTimeTuesdayStart(program.startProgram);
                    setTimeTuesdayEnd(program.endProgram);
                    setIsOkTuesday(true);
                    setFreeTuesday(false);
                }
                if (program.day === 3) {
                    setTimeWednesdayStart(program.startProgram);
                    setTimeWednesdayEnd(program.endProgram);
                    setIsOkWednesday(true);
                    setFreeWednesday(false);
                }
                if (program.day === 4) {
                    setTimeThursdayStart(program.startProgram);
                    setTimeThursdayEnd(program.endProgram);
                    setIsOkThursday(true);
                    setFreeThursday(false);
                }
                if (program.day === 5) {
                    setTimeFridayStart(program.startProgram);
                    setTimeFridayEnd(program.endProgram);
                    setIsOkFriday(true);
                    setFreeFriday(false);
                }
                if (program.day === 6) {
                    setTimeSaturdayStart(program.startProgram);
                    setTimeSaturdayEnd(program.endProgram);
                    setIsOkSaturday(true);
                    setFreeSaturday(false);
                }
                if (program.day === 0) {
                    setTimeSundayStart(program.startProgram);
                    setTimeSundayEnd(program.endProgram);
                    setIsOkSunday(true);
                    setFreeSunday(false);
                }

                return program;
            })
        }

        if (props.id) {
            setChooseRoles(props.defaultRoles);
            setSelectedRoles(props.defaultRoles);
            setSelectedImage(`data:image/jpeg;base64,${props.defaultPhoto}`);
        }

        else {
            toDataURL(avatar, function (dataUrl) {
                setSelectedImage(dataUrl);
            })
        }


        API_SERVICES.getPackages((result, status, error) => {
            setPackages([]);
            if (result !== null && (status === 200 || status === 201)) {
                console.log(result);

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
                props.swalComponent(t('server.problem'), t('server.problem'), "error");

            }
        });

        API_SERVICES.getServices((result, status, error) => {
            setServices([]);
            if (result !== null && (status === 200 || status === 201)) {
                console.log(result);

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
                props.swalComponent(t('server.problem'), t('server.problem'), "error");

            }
        });
        
        API_USERS.getToken((result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                setToken(result.auth_token);
            } else {
                console.log(status);
                console.log(error);
            }
        });

    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {


        setCountries([]);
        if (token !== undefined) {
            API_USERS.getCountries(token, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    result.map(country => {
                        setCountries(oldArray => [...oldArray, { label: country.country_name, value: country.country_name }]);
                        return country;
                    });
                    setIsLoading(false);
                    if (props.defaultCountry && selectedCountry === defaultCountry.label) setSelectedCountry(props.defaultCountry);

                } else {
                    console.log(status);
                    console.log(error);
                }
            });
        }

    }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        setStates([]);

        if (selectedCountry !== t('register.selectCountry')) {

            setIsLoading(true);

            API_USERS.getStates(token, selectedCountry, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    let ok = false;
                    result.map(state => {
                        setStates(oldArray => [...oldArray, { label: state.state_name, value: state.state_name }]);
                        if (state.state_name === selectedState) {
                            ok = true;
                            console.log(selectedState);
                        }
                        return state;
                    });

                    if (ok === false) {
                        setSelectedState(defaultState.label);
                        setSelectedCity(defaultCity.label);
                    }

                    if (props.defaultState && selectedState === defaultState.label) setSelectedState(props.defaultState);
                    else
                        setIsLoading(false);

                } else {
                    console.log(status);
                    console.log(error);

                }
            });
        }

    }, [selectedCountry]) // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {

        setCities([]);
        if (selectedState !== t('register.selectState')) {
            setIsLoading(true);
            API_USERS.getCities(token, selectedState, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    let ok = false;
                    result.map(city => {
                        setCities(oldArray => [...oldArray, { label: city.city_name, value: city.city_name }]);
                        if (city.city_name === selectedCity) {
                            ok = true;
                            console.log(selectedCity)
                        }
                        return city;
                    });

                    if (ok === false) setSelectedCity(defaultCity.label);

                    if (result.length === 0) {
                        setSelectedCity('None');
                    }

                    if (props.defaultCity && selectedCity === defaultCity.label) setSelectedCity(props.defaultCity);

                    setIsLoading(false);

                } else {
                    console.log(status);
                    console.log(error);
                }
            });
        }

    }, [selectedState]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        if (selectedCity !== t('register.selectCity'))
            setIsLoading(false);

    }, [selectedCity]) // eslint-disable-line react-hooks/exhaustive-deps


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


    const onSubmit = () => {

        emptyFields(username, setWasUsernameModified, name, setWasNameModified, email, setWasEmailModified, password, setWasPasswordModified, password_confirmation, setWasPassword_confirmationModified);

        if (isBarber && ((!isOkMonday && !freeMonday) || (!isOkTuesday && !freeTuesday) || (!isOkWednesday && !freeWednesday) || (!isOkThursday && !freeThursday) || (!isOkFriday && !freeFriday) || (!isOkSaturday && !freeSaturday) || (!isOkSunday && !freeSunday))) {
            props.swalComponent(t("contact.status"), t('admin.errorMonday'), "error");
        }
        else if (validUsername(username, wasUsernameModified, t) !== undefined || validName(name, wasNameModified, t) !== undefined || validEmail(email, wasEmailModified, t) !== undefined || validPassword(password, wasPasswordModified, t) !== undefined || validPasswordConfirmation(password_confirmation, wasPassword_confirmationModified, t) !== undefined) {
            props.swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }
        else if (password !== password_confirmation) {
            setSamePassword(true);
            props.swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }

        else if (selectedCountry === t('register.selectCountry')) {
            setIsCountrySelected(false);
            props.swalComponent(t("contact.status"), t('register.notComplete'), "error");

        }

        else if (selectedState === t('register.selectState')) {
            setIsStateSelected(false);
            props.swalComponent(t("contact.status"), t('register.notComplete'), "error");

        }

        else if (selectedCity === t('register.selectCity') && cities.length > 1) {
            setIsCitySelected(false);
            props.swalComponent(t("contact.status"), t('register.notComplete'), "error");
        }

        else {
            const date = moment(birthDate).format("YYYY-MM-DD");
            let services_id = selectedServices.map(service_item => service_item.value);
            let packages_id = selectedPackages.map(package_item => package_item.value);
            let roles = selectedRoles.map(role_item => role_item.value);

            let days_id = [];
            let start_id = [];
            let end_id = [];

            if (!freeMonday) {

                days_id = [...days_id, 1];
                start_id = [...start_id, timeMondayStart];
                end_id = [...end_id, timeMondayEnd];

            }

            if (!freeTuesday) {
                days_id = [...days_id, 2];
                start_id = [...start_id, timeTuesdayStart];
                end_id = [...end_id, timeTuesdayEnd];
            }

            if (!freeWednesday) {
                days_id = [...days_id, 3];
                start_id = [...start_id, timeWednesdayStart];
                end_id = [...end_id, timeWednesdayEnd];
            }

            if (!freeThursday) {
                days_id = [...days_id, 4];
                start_id = [...start_id, timeThursdayStart];
                end_id = [...end_id, timeThursdayEnd];
            }

            if (!freeFriday) {
                days_id = [...days_id, 5];
                start_id = [...start_id, timeFridayStart];
                end_id = [...end_id, timeFridayEnd];
            }

            if (!freeSaturday) {
                days_id = [...days_id, 6];
                start_id = [...start_id, timeSaturdayStart];
                end_id = [...end_id, timeSaturdayEnd];
            }

            if (!freeSunday) {
                days_id = [...days_id, 0];
                start_id = [...start_id, timeSundayStart];
                end_id = [...end_id, timeSundayEnd];
            }

            let user;

            if (isBarber) {

                user = {
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
                    photo: selectedImage,
                    subject: t('register.mailSubject'),
                    message: t('register.mailMessage'),
                    services_id: services_id,
                    packages_id: packages_id,
                    role: roles,
                    days_id: days_id,
                    start_id: start_id,
                    end_id: end_id

                }
            }
            else {
                user = {
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
                    photo: selectedImage,
                    subject: t('register.mailSubject'),
                    message: t('register.mailMessage'),
                    role: roles
                }

            }

            if (props.id) {
                props.handleDataUserEdit(props.id, user);
            }
            else {
                props.handleDataForUsers(user);
            }

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

    const handleSelectMultipleRoles = (e) => {

        setSelectedRoles(e);
        let ok = false;
        e.map(role => {
            if (role.value === "barber") {
                ok = true;
            }
            return role;
        })
        if (ok === true) {
            setIsBarber(true);
        }
        else {
            setIsBarber(false);
        }
    }

    const handleSelectMultipleServices = (e) => {
        setSelectedServices(e);
    }

    const handleSelectMultiplePackages = (e) => {
        setSelectedPackages(e);
    }

    const onChangeMondayStart = (e) => {

        setTimeMondayStart(e);
        if (e < timeMondayEnd) {
            setIsOkMonday(true);
        }
        else {
            setIsOkMonday(false);
        }
    }

    const onChangeMondayEnd = (e) => {
        setTimeMondayEnd(e);
        if (timeMondayStart < e) {
            setIsOkMonday(true);
        }
        else {
            setIsOkMonday(false);
        }
    }

    const onChangeTuesdayStart = (e) => {
        setTimeTuesdayStart(e);
        if (e < timeTuesdayEnd) {
            setIsOkTuesday(true);
        }
        else {
            setIsOkTuesday(false);
        }
    }

    const onChangeTuesdayEnd = (e) => {
        setTimeTuesdayEnd(e);
        if (timeTuesdayStart < e) {
            setIsOkTuesday(true);
        }
        else {
            setIsOkTuesday(false);
        }
    }

    const onChangeWednesdayStart = (e) => {
        setTimeWednesdayStart(e);
        if (e < timeWednesdayEnd) {
            setIsOkWednesday(true);
        }
        else {
            setIsOkWednesday(false);
        }
    }

    const onChangeWednesdayEnd = (e) => {
        setTimeWednesdayEnd(e);
        if (timeWednesdayStart < e) {
            setIsOkWednesday(true);
        }
        else {
            setIsOkWednesday(false);
        }
    }

    const onChangeThursdayStart = (e) => {
        setTimeThursdayStart(e);
        if (e < timeThursdayEnd) {
            setIsOkThursday(true);
        }
        else {
            setIsOkThursday(false);
        }
    }

    const onChangeThursdayEnd = (e) => {
        setTimeThursdayEnd(e);
        if (timeThursdayStart < e) {
            setIsOkThursday(true);
        }
        else {
            setIsOkThursday(false);
        }
    }

    const onChangeFridayStart = (e) => {
        setTimeFridayStart(e);
        if (e < timeFridayEnd) {
            setIsOkFriday(true);
        }
        else {
            setIsOkFriday(false);
        }
    }

    const onChangeFridayEnd = (e) => {
        setTimeFridayEnd(e);
        if (timeFridayStart < e) {
            setIsOkFriday(true);
        }
        else {
            setIsOkFriday(false);
        }
    }

    const onChangeSaturdayStart = (e) => {
        setTimeSaturdayStart(e);
        if (e < timeSaturdayEnd) {
            setIsOkSaturday(true);
        }
        else {
            setIsOkSaturday(false);
        }
    }

    const onChangeSaturdayEnd = (e) => {
        setTimeSaturdayEnd(e);
        if (timeSaturdayStart < e) {
            setIsOkSaturday(true);
        }
        else {
            setIsOkSaturday(false);
        }
    }

    const onChangeSundayStart = (e) => {
        setTimeSundayStart(e);
        if (e < timeSundayEnd) {
            setIsOkSunday(true);
        }
        else {
            setIsOkSunday(false);
        }
    }

    const onChangeSundayEnd = (e) => {
        setTimeSundayEnd(e);
        if (timeSundayStart < e) {
            setIsOkSunday(true);
        }
        else {
            setIsOkSunday(false);
        }
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


    return (

        <div>
            {isLoading ? <Loader /> :
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
                        defaultValue={{ label: selectedState, value: selectedState === defaultState.label ? 0 : selectedState }}
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
                        defaultValue={{ label: selectedCity, value: selectedCity === defaultCity.label ? 0 : selectedCity }}
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

                    <label> {t("admin.role")} </label>

                    <Select
                        name="form-dept-select"
                        options={roles}
                        defaultValue={chooseRoles}
                        isMulti
                        onChange={handleSelectMultipleRoles}
                    />

                    {isBarber &&
                        <div>
                            <label> {t("admin.option1")} </label>
                            <Select
                                name="form-dept-select"
                                options={services}
                                defaultValue={chooseServices}
                                isMulti
                                onChange={handleSelectMultipleServices}
                            />

                            <label> {t("admin.option2")} </label>
                            <Select
                                name="form-dept-select"
                                options={packages}
                                defaultValue={choosePackages}
                                isMulti
                                onChange={handleSelectMultiplePackages}
                            />
                            <label> {t("admin.program")} </label>

                            <br />


                            <label> {t("admin.monday")} </label>
                            {" "}
                            <label>
                                <input type="checkbox"
                                    defaultChecked={freeMonday}
                                    onChange={() => setFreeMonday(!freeMonday)}
                                />
                                Free
                            </label>
                            <br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    onChange={onChangeMondayStart}
                                    value={timeMondayStart}
                                    ampm={false}
                                    disabled={freeMonday}
                                    minutesStep={5}
                                />
                                <br />
                                <TimePicker
                                    onChange={onChangeMondayEnd}
                                    value={timeMondayEnd}
                                    ampm={false}
                                    disabled={freeMonday}
                                    minutesStep={5}
                                />
                            </MuiPickersUtilsProvider>
                            {!isOkMonday && !freeMonday && (

                                <div className="alert alert-danger" role="alert">
                                    {t('admin.errorMonday')}
                                </div>
                            )}
                            <br />
                            <label> {t("admin.tuesday")} </label>
                            {" "}
                            <label>
                                <input type="checkbox"
                                    defaultChecked={freeTuesday}
                                    onChange={() => setFreeTuesday(!freeTuesday)}
                                />
                                Free
                            </label>
                            <br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    onChange={onChangeTuesdayStart}
                                    value={timeTuesdayStart}
                                    clearable
                                    ampm={false}
                                    disabled={freeTuesday}
                                    minutesStep={5}
                                />
                                <br />
                                <TimePicker
                                    onChange={onChangeTuesdayEnd}
                                    value={timeTuesdayEnd}
                                    clearable
                                    ampm={false}
                                    disabled={freeTuesday}
                                    minutesStep={5}
                                />
                            </MuiPickersUtilsProvider>
                            {!isOkTuesday && !freeTuesday && (

                                <div className="alert alert-danger" role="alert">
                                    {t('admin.errorTuesday')}
                                </div>
                            )}
                            <br />
                            <label> {t("admin.wednesday")} </label>
                            {" "}
                            <label>
                                <input type="checkbox"
                                    defaultChecked={freeWednesday}
                                    onChange={() => setFreeWednesday(!freeWednesday)}
                                />
                                Free
                            </label>
                            <br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    onChange={onChangeWednesdayStart}
                                    value={timeWednesdayStart}
                                    clearable
                                    ampm={false}
                                    disabled={freeWednesday}
                                    minutesStep={5}
                                />
                                <br />
                                <TimePicker
                                    onChange={onChangeWednesdayEnd}
                                    value={timeWednesdayEnd}
                                    clearable
                                    ampm={false}
                                    disabled={freeWednesday}
                                    minutesStep={5}
                                />
                            </MuiPickersUtilsProvider>
                            {!isOkWednesday && !freeWednesday && (

                                <div className="alert alert-danger" role="alert">
                                    {t('admin.errorWednesday')}
                                </div>
                            )}
                            <br />
                            <label> {t("admin.thursday")} </label>
                            {" "}
                            <label>
                                <input type="checkbox"
                                    defaultChecked={freeThursday}
                                    onChange={() => setFreeThursday(!freeThursday)}
                                />
                                Free
                            </label>
                            <br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    onChange={onChangeThursdayStart}
                                    value={timeThursdayStart}
                                    clearable
                                    ampm={false}
                                    disabled={freeThursday}
                                    minutesStep={5}
                                />
                                <br />
                                <TimePicker
                                    onChange={onChangeThursdayEnd}
                                    value={timeThursdayEnd}
                                    clearable
                                    ampm={false}
                                    disabled={freeThursday}
                                    minutesStep={5}
                                />
                            </MuiPickersUtilsProvider>
                            {!isOkThursday && !freeThursday && (

                                <div className="alert alert-danger" role="alert">
                                    {t('admin.errorThursday')}
                                </div>
                            )}
                            <br />
                            <label> {t("admin.friday")} </label>
                            {" "}
                            <label>
                                <input type="checkbox"
                                    defaultChecked={freeFriday}
                                    onChange={() => setFreeFriday(!freeFriday)}
                                />
                                Free
                            </label>
                            <br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    onChange={onChangeFridayStart}
                                    value={timeFridayStart}
                                    clearable
                                    ampm={false}
                                    disabled={freeFriday}
                                    minutesStep={5}
                                />
                                <br />
                                <TimePicker
                                    onChange={onChangeFridayEnd}
                                    value={timeFridayEnd}
                                    clearable
                                    ampm={false}
                                    disabled={freeFriday}
                                    minutesStep={5}
                                />
                            </MuiPickersUtilsProvider>
                            {!isOkFriday && !freeFriday && (

                                <div className="alert alert-danger" role="alert">
                                    {t('admin.errorFriday')}
                                </div>
                            )}
                            <br />
                            <label> {t("admin.saturday")} </label>
                            {" "}
                            <label>
                                <input type="checkbox"
                                    defaultChecked={freeSaturday}
                                    onChange={() => setFreeSaturday(!freeSaturday)}
                                />
                                Free
                            </label>
                            <br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    onChange={onChangeSaturdayStart}
                                    value={timeSaturdayStart}
                                    clearable
                                    ampm={false}
                                    disabled={freeSaturday}
                                    minutesStep={5}
                                />
                                <br />
                                <TimePicker
                                    onChange={onChangeSaturdayEnd}
                                    value={timeSaturdayEnd}
                                    clearable
                                    ampm={false}
                                    disabled={freeSaturday}
                                    minutesStep={5}
                                />
                            </MuiPickersUtilsProvider>
                            {!isOkSaturday && !freeSaturday && (

                                <div className="alert alert-danger" role="alert">
                                    {t('admin.errorSaturday')}
                                </div>
                            )}
                            <br />
                            <label> {t("admin.sunday")} </label>
                            {" "}
                            <label>
                                <input type="checkbox"
                                    defaultChecked={freeSunday}
                                    onChange={() => setFreeSunday(!freeSunday)}
                                />
                                Free
                            </label>
                            <br />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    onChange={onChangeSundayStart}
                                    value={timeSundayStart}
                                    clearable
                                    ampm={false}
                                    disabled={freeSunday}
                                    minutesStep={5}
                                />
                                <br />
                                <TimePicker
                                    onChange={onChangeSundayEnd}
                                    value={timeSundayEnd}
                                    clearable
                                    ampm={false}
                                    disabled={freeSunday}
                                    minutesStep={5}
                                />
                            </MuiPickersUtilsProvider>
                            {!isOkSunday && !freeSunday && (

                                <div className="alert alert-danger" role="alert">
                                    {t('admin.errorSunday')}
                                </div>
                            )}

                        </div>
                    }

                    <br />
                    <div className="buttonHolder">
                        <input type="submit" value={t("profile.button")} />{" "}
                    </div>{" "}

                </form>
            }
        </div >


    );
}

export default FormUser;
