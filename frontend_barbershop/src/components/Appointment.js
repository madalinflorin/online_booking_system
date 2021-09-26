import React, { useState, useEffect } from "react";
import "../commons/styles/contact.css";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as API_USERS from "../commons/api/barbers-api";
import * as API_PROGRAM from "../commons/api/program-api";
import * as API_APPOINTMENT from "../commons/api/appointment-api";
import { swalComponent } from './Swal';
import AuthService from '../services/AuthService';
import MyModal from './Modal';
import OldPassword from './OldPassword';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment-timezone';
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import FormAppointment from '../commons/Forms/FormAppointment';

function Appointment(props) {
    const t = props.value;
    const { handleSubmit } = useForm();
    const [selectedBarber, setSelectedBarber] = useState(undefined);
    const [selectedHour, setSelectedHour] = useState(undefined);
    const [packagesAndServicesForBarbers, setPackagesAndServicesForBarbers] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [choice, setChoice] = useState(false);
    const [packages, setPackages] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(undefined);
    const [chooseSomething, setChooseSomething] = useState(false);
    const [duration, setDuration] = useState(0);
    const [free, setIsFree] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hours, setHours] = useState([]);
    const [isBarberSelected, setIsBarberSelected] = useState(true);
    const [isPackageOrServicesSelected, setIsPackageOrServicesSelected] = useState(true);
    const [isHourSelected, setIsHourSelected] = useState(true);
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [appointment, setAppointment] = useState();
    const [price, setPrice] = useState(0);
    const [rows, setRows] = useState([]);
    const [number, setNumber] = useState(false);
    const [daysOfWork, setDaysOfWork] = useState([0, 1, 2, 3, 4, 5, 6]);
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
    const [fetchAppointments, setFetchAppointments] = useState(false);
    const history = useHistory();

    const handleClose = () => {
        setShow(false);
    }

    const handleCloseEdit = () => {
        setShowEdit(false);
    }

    useEffect(() => {

        setSelectedBarber(undefined);
        setSelectedHour(undefined);
        setSelectedServices([]);
        setSelectedPackage(undefined);
        

    }, [props.language]) // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {

        fetchData();

    }, [props.language]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        fetchAppointmentsForUser();

    }, [fetchAppointments, props.language]) // eslint-disable-line react-hooks/exhaustive-deps

    function fetchAppointmentsForUser() {

        const currentUser = AuthService.getCurrentUser();
        const language = localStorage.getItem('i18nextLng');

        API_APPOINTMENT.getAppointmentsForUser(currentUser.username, currentUser.accessToken, (result, status, error) => {

            if (result !== null && (status === 200 || status === 201)) {

                setRows(result.map(appointment => {

                    let services_aux = appointment.services.map(service => language === "en" ? <li key={service.id}>{service.nameEn}</li> : <li key={service.id}>{service.nameRo}</li>);

                    return <tr key={appointment.id}>
                        <td>{appointment.nameBarber}</td>
                        <td>{moment(appointment.startAppointment).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{services_aux}</td>
                        <td>{appointment.price}</td>
                        <td>{Date.now() > new Date(appointment.startAppointment) ?
                            <Tooltip title={t('appointment.editAppointment')}>
                                <span>
                                    <IconButton disabled>
                                    <EditIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            :
                            <Tooltip title={t('appointment.editAppointment')}>
                                <IconButton onClick={() => editAppointment(appointment)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>

                        }
                        </td>
                        <td>{Date.now() > new Date(appointment.startAppointment) ?
                            <Tooltip title={t('appointment.cantDelete')}>
                                <span>
                                    <IconButton disabled>
                                        <DeleteIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            :
                            <Tooltip title={t('appointment.deleteAppointment')}>
                                <IconButton onClick={() => deleteAppointment(appointment.id, new Date(appointment.startAppointment))}>
                                <DeleteIcon />
                                </IconButton>
                            </Tooltip>

                        }
                        </td>
                    </tr>

                }));

            } else {
                console.log(status);
                console.log(error);

                if (status === 401) {
                    history.push("/");
                }
                else {
                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }
            }
        });

    }

    function fetchData() {

        const language = localStorage.getItem('i18nextLng');

        API_USERS.getBarbersPublic((result, status, error) => {
            setBarbers([]);
            if (result !== null && (status === 200 || status === 201)) {
                console.log(result);
                result.map(barber => {
                    setBarbers(oldArray => [...oldArray, { label: barber.name, value: barber.id }]);
                    let services_aux;
                    let packages_aux;

                    packages_aux = barber.packages.map(item => {
                        const date = Date.now();
                        const ok = date > new Date(item.startDiscountPeriod) && date < new Date(item.endDiscountPeriod);

                        let price = 0;
                        let duration = 0;

                        services_aux = item.services.map(service => {

                            duration = duration + service.duration;
                            price = price + service.price;
                            return language === 'en' ?

                                {
                                    label: "Name service: " + service.nameEn + "\nPrice: " + service.price + " lei\nDuration: " + service.duration + " minutes", value: service.id, duration: service.duration, price: service.price

                                }
                                :
                                {
                                    label: "Nume serviciu: " + service.nameRo + "\nPret: " + service.price + " lei\nDurata:" + service.duration + " minute", value: service.id, duration: service.duration, price: service.price

                                }

                        });

                        price = ok ? (price - item.discount * price / 100) : price;

                        return language === 'en' ?

                            {
                                label: "Name package: " + item.nameEn + "\nPrice: " + price + " lei\nDuration: " + duration + " minutes", value: item.id, duration: duration, price: price

                            }
                            :
                            {
                                label: "Nume pachet: " + item.nameRo + "\nPret: " + price + " lei\nDurata: " + duration + " minute", value: item.id, duration: duration, price: price

                            }


                    });

                    services_aux = barber.services.map(service => {

                        return language === 'en' ?

                            {
                                label: "Name service: " + service.nameEn + "\nPrice: " + service.price + " lei\nDuration: " + service.duration + " minutes", value: service.id, duration: service.duration, price: service.price

                            }
                            :
                            {
                                label: "Nume serviciu: " + service.nameRo + "\nPret: " + service.price + " lei\nDurata:" + service.duration + " minute", value: service.id, duration: service.duration, price: service.price

                            }

                    });

                    setPackagesAndServicesForBarbers(oldArray => [...oldArray, { id: barber.id, services: services_aux, packages: packages_aux }]);

                    return barber;
                }
                );

            } else {
                console.log(status);
                console.log(error);
                if (status === 401) {
                    history.push("/");
                }
                else {
                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }
            }
        });


    }

    const editAppointment = (appointment) => {
        setAppointment(appointment);
        setShowEdit(true);

    }

    const deleteAppointment = (id, startAppointment) => {
        const currentUser = AuthService.getCurrentUser();
        let appointment = {
            id: id,
            user_id: currentUser.id,
            username: currentUser.username,
            startAppointment: startAppointment,
            message: "None"
        }
        setAppointment(appointment);
        setShow(true);
        setNumber(true);

    }

    const isWorkDay = date => {
        let dayWork = false;
        const day = date.getDay();
        daysOfWork.map(d => {
            if (d === day) dayWork = true;
            return d;
        })
        return dayWork;
    };

    useEffect(() => {

        if (selectedBarber !== undefined) {
            setDaysOfWork([]);
            setIsLoadingCalendar(true);
            API_PROGRAM.getAllProgramsForBarber(selectedBarber, (result, status, error) => {

                if (result !== null && (status === 200 || status === 201)) {

                    console.log(result);
                    result.map(elem => {
                        setDaysOfWork(oldArray => [...oldArray, elem.day]);
                        console.log(elem.day);
                        return elem;
                    })

                    setIsLoadingCalendar(false);

                } else {
                    console.log(status);
                    console.log(error);

                    if (status === 401) {
                        history.push("/");
                    }
                    else {
                        swalComponent(t('server.problem'), t('server.problem'), "error");
                    }

                }
            });
        }


    }, [selectedBarber])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        if (selectedBarber !== undefined) {

            let appointments_for_today;


            API_APPOINTMENT.getAppointmentsForBarber(selectedBarber, new Date(moment.tz(selectedDate, "Europe/Bucharest").format()), (result, status, error) => {

                if (result !== null && (status === 200 || status === 201)) {
                    appointments_for_today = result;

                    API_PROGRAM.getProgramForBarber(selectedBarber, selectedDate.getDay(), (result, status, error) => {
                        if (result !== null && (status === 200 || status === 201)) {

                            if (result.id) {

                                setIsLoading(true);
                                setIsFree(false);
                                let hours_aux = [];
                                let date = new Date(selectedDate);
                                let today = moment(selectedDate).isSame(Date.now(), 'day');
                                let startHour = new Date(result.startProgram).getHours();
                                let startMinute = new Date(result.startProgram).getMinutes();
                                let endHour = new Date(result.endProgram).getHours();
                                let endMinute = new Date(result.endProgram).getMinutes();
                                let finalProgram = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), endHour, endMinute, 0);
                                let stringStartHour;
                                let stringStartMinute;

                                while (startHour <= endHour) {
                                    let ok = true;
                                    let newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, startMinute, 0);
                                    let newDateAfterAppointment = moment(newDate).add(duration, 'm').toDate();
                                    stringStartHour = startHour < 10 ? "0" + startHour : startHour;
                                    stringStartMinute = startMinute < 10 ? "0" + startMinute : startMinute;

                                    appointments_for_today.map(ap => {
                                        if (newDate < new Date(ap.endAppointment) && new Date(ap.startAppointment) < newDateAfterAppointment) {
                                            ok = false;
                                        }
                                        return ap;
                                    })

                                    if (newDateAfterAppointment > finalProgram || !ok || (today && Date.now() > newDate)) {
                                        hours_aux = [...hours_aux, { label: stringStartHour + ":" + stringStartMinute, value: newDate, isDisabled: true }];
                                    }
                                    else {
                                        hours_aux = [...hours_aux, { label: stringStartHour + ":" + stringStartMinute, value: newDate }];
                                    }
                                    startMinute += 5;
                                    if (startMinute >= 60) { startMinute = 0; startHour += 1; }
                                    if (startHour === endHour && startMinute > endMinute) break;
                                }

                                setHours(hours_aux);
                                setIsLoading(false);
                            }
                            else {
                                setIsLoading(true);
                                setIsFree(true);
                                setHours([]);
                                setIsLoading(false);
                            }

                        } else {
                            console.log(status);
                            console.log(error);
                            if (status === 401) {
                                history.push("/");
                            }
                            else {
                                swalComponent(t('server.problem'), t('server.problem'), "error");
                            }
                        }
                    });



                } else {
                    console.log(status);
                    console.log(error);
                    if (status === 401) {
                        history.push("/");
                    }
                    else {
                        swalComponent(t('server.problem'), t('server.problem'), "error");
                    }
                }
            });

        }



    }, [fetchAppointments, selectedDate, selectedBarber, selectedServices, selectedPackage]) // eslint-disable-line react-hooks/exhaustive-deps


    function onSubmit() {

        if (selectedBarber === undefined) {
            swalComponent(t('contact.status'), t('appointment.errorBarber'), "error");
            setIsBarberSelected(false);
        }
        else if (selectedPackage === undefined && selectedServices.length === 0) {
            swalComponent(t('contact.status'), t('appointment.errorPackageServices'), "error");
            setIsPackageOrServicesSelected(false);

        }
        else if (selectedHour === undefined) {
            swalComponent(t('contact.status'), t('appointment.errorHour'), "error");
            setIsHourSelected(false);
        }
        else {
            const currentUser = AuthService.getCurrentUser();

            let data = {
                barber_id: selectedBarber,
                user_id: currentUser.id,
                startAppointment: selectedHour,
                endAppointment: moment(selectedHour).add(duration, 'm').toDate(),
                services: selectedServices.map(s => s.value),
                package_id: selectedPackage,
                username: currentUser.username,
                price: price,
                language: localStorage.getItem('i18nextLng'),
                message: "None"
            }

            setShow(true);
            setAppointment(data);
            setNumber(false);

        }


    };

    const sendDataEdit = () => {

        setFetchAppointments(prevState => !prevState);

    }

    const sendData = (data) => {

        API_APPOINTMENT.insertAppointment(data, (result, status, error) => {

            if (result !== null && (status === 200 || status === 201)) {

                setFetchAppointments(prevState => !prevState);
                swalComponent(t('contact.status'), t('appointment.succes'), "success");
                Swal.fire({
                    title: t('contact.status'),
                    text: t('appointment.succes'),
                    icon: 'success',
                    confirmButtonColor: '#8B7871',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
    
                        window.location.reload();
    
                    }
                })
    
            } else {
                console.log(status);
                console.log(error);

                if (status === 400) {
                    swalComponent(t('contact.status'), t('appointment.errorUser'), "error");
                }
                else if (status === 401) {
                    swalComponent(t('contact.status'), t('login.error'), "error");
                }
                else if (status === 402) {
                    swalComponent(t('contact.status'), t('appointment.errorUserBarber'), "error");
                }
                else if (status === 403) {
                    swalComponent(t('contact.status'), t('appointment.errorPackage'), "error");
                }
                else if (status === 404) {
                    swalComponent(t('contact.status'), t('appointment.errorService'), "error");
                }
                else if (status === 405) {
                    swalComponent(t('contact.status'), t('appointment.errorAppointment'), "error");
                }
                else if (status === 406) {
                    swalComponent(t('contact.status'), t('appointment.limitAppointments') + "(" + moment(error.expireDate).tz('Europe/Bucharest').format('DD/MM/YYYY HH:mm') + ")", "error");
                }
                else {
                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }
            }
            if (status !== 401) {
                handleClose();
            }
        });

    }

    const onChange = date => {

        setSelectedDate(date);
        setSelectedHour(undefined);

    };

    const onChangeChoice = () => {
        setChoice(prevState => !prevState);
        setChooseSomething(false);
        setSelectedPackage(undefined);
        setSelectedServices([]);
        setSelectedHour(undefined);

    }

    const handleSelectMultipleServices = (e) => {
        let duration_aux = 0;
        let price_aux = 0;
        e.map(elem => {
            duration_aux = duration_aux + elem.duration;
            price_aux = price_aux + elem.price;
            return elem;
        });
        setDuration(duration_aux);
        setPrice(price_aux);
        setSelectedServices(e);
        if (e.length > 0) {
            setChooseSomething(true);
            setIsPackageOrServicesSelected(true);
        }
        else
            setChooseSomething(false);
    }

    const handleChangeBarber = (e) => {
        let id = e.value;
        setSelectedBarber(e.value);
        setIsBarberSelected(true);
        setSelectedHour(undefined);
        packagesAndServicesForBarbers.map(value => {
            if (value.id === id) {
                setPackages(value.packages);
                setServices(value.services);
            }
            return value;
        })
    }

    const deleteRow = (data) => {

        API_APPOINTMENT.deleteAppointment(data, (result, status, error) => {

            if (result !== null && (status === 200 || status === 201)) {
                setFetchAppointments(prevState => !prevState);
                swalComponent(t('contact.status'), t('appointment.cancel'), "success");

            } else {
                console.log(status);
                console.log(error);
                if (status === 400) {
                    swalComponent(t('contact.status'), t('appointment.cantDelete'), "error");
                }
                else if (status === 401) {
                    swalComponent(t('contact.status'), t('login.error'), "error");
                }
                else if (status === 402) {
                    swalComponent(t('contact.status'), t('appointment.dontExistAnymore'), "error");
                }
                else {

                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }
            }
            if (status !== 401) {
                handleClose();
            }
        });
    }

    return (
        <div className="containerbig">
            <br />
            <br />
            <div className="containerContact">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label> {t("appointment.barber")} </label>
                    {props.language === 'en' &&
                        <Select

                            name="form-dept-select"
                            options={barbers}
                            defaultValue={{ label: t('appointment.selectBarber'), value: 0 }}
                            onChange={handleChangeBarber}
                        />
                    }

                    {props.language === 'ro' &&
                        <Select

                            name="form-dept-select"
                            options={barbers}
                            defaultValue={{ label: t('appointment.selectBarber'), value: 0 }}
                            onChange={handleChangeBarber}
                        />
                    }

                    {!isBarberSelected && (

                        <div className="alert alert-danger" role="alert">
                            {t('appointment.selectBarber')}
                        </div>
                    )}

                    <br />

                    {selectedBarber &&

                        <div>

                            <label>{t("appointment.choice")}</label>

                            <div className="radio">
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={choice === true}
                                        onChange={onChangeChoice}
                                    />
                                    {t('appointment.choicePackage')}
                                </label>

                        &nbsp;
                        &nbsp;
                        &nbsp;

                        <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={choice === false}
                                        onChange={onChangeChoice}
                                    />
                                    {t('appointment.choiceServices')}
                                </label>
                            </div>
                            {choice &&
                                <Select

                                    name="form-dept-select"
                                    options={packages}
                                    defaultValue={{ label: t('appointment.selectPackage'), value: 0 }}
                                    classNamePrefix="lp-copy-sel"
                                    onChange={e => {
                                        setSelectedPackage(e.value);
                                        setDuration(e.duration);
                                        setChooseSomething(true);
                                        setIsPackageOrServicesSelected(true);
                                        setPrice(e.price);
                                    }}
                                />
                            }
                            {!choice &&
                                <Select
                                    name="form-dept-select"
                                    options={services}
                                    isMulti
                                    classNamePrefix="lp-copy-sel"
                                    onChange={handleSelectMultipleServices}
                                />
                            }

                            {!isPackageOrServicesSelected && choice && (

                                <div className="alert alert-danger" role="alert">
                                    {t('appointment.selectPackage')}
                                </div>
                            )}

                            {!isPackageOrServicesSelected && !choice && (

                                <div className="alert alert-danger" role="alert">
                                    {t('appointment.selectServices')}
                                </div>
                            )}

                            <label>{t("appointment.date")}</label>

                            {!isLoadingCalendar &&
                                <div>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={onChange}
                                        minDate={new Date()}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="scroll"
                                        filterDate={isWorkDay}
                                    />
                                </div>
                            }



                            {chooseSomething &&
                                <div>
                                    <label>{t("appointment.hour")}</label>

                                    {!isLoading &&
                                        <div>
                                            <Select

                                                name="form-dept-select"
                                                options={hours}
                                                defaultValue={free ? { label: t('appointment.free'), value: 0 } : { label: t('appointment.selectHour'), value: 0 }}
                                                onChange={e => {
                                                    setSelectedHour(e.value);
                                                    setIsHourSelected(true);
                                                }}
                                            />
                                            {!isHourSelected && (

                                                <div className="alert alert-danger" role="alert">
                                                    {t('appointment.errorHour')}
                                                </div>

                                            )}
                                        </div>
                                    }
                                    <br />
                                </div>
                            }
                        </div>
                    }

                    <div className="buttonHolder">
                        <input type="submit" value={t("profile.button")} />{" "}
                    </div>{" "}
                </form>


                <MyModal component={<OldPassword t={t} user={appointment} handleClose={handleClose} sendData={!number ? sendData : deleteRow} />} header={t('appointment.password')} show={show} handleClose={handleClose} />
                <MyModal component={<FormAppointment t={t} user={appointment} handleClose={handleCloseEdit} sendData={sendDataEdit} />} header={t('appointment.editAppointment')} show={showEdit} handleClose={handleCloseEdit} />
            </div>

            <br />

            <h2 className="contentHomePage">{t('appointment.myAppointments')}</h2>
            <br/>

            <table className="styled-table">
                <thead>
                    <tr>
                        <th>{t('appointment.nameBarber')}</th>
                        <th>{t('appointment.startAppointment')}</th>
                        <th>{t('appointment.services')}</th>
                        <th>{t('appointment.price')}</th>
                        <th>{t('appointment.editAppointment')}</th>
                        <th>{t('appointment.deleteAppointment')}</th>
                    </tr>
                </thead>
                <tbody className="center-screen-tabel">
                    {rows.length > 0 ? rows : <tr><td colSpan="6">{t('appointment.madeAppointment')}</td></tr>}
                </tbody>
            </table>

            <hr />

            <br />
        </div>
    );
}

export default Appointment;
