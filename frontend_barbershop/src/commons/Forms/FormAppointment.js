import React, { useState, useEffect } from "react";
import "../styles/contact.css";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as API_USERS from "../api/barbers-api";
import * as API_PROGRAM from "../api/program-api";
import * as API_APPOINTMENT from "../api/appointment-api";
import { swalComponent } from '../../components/Swal';
import AuthService from '../../services/AuthService';
import moment from 'moment-timezone';
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import MyModal from '../../components/Modal';
import OldPassword from '../../components/OldPassword';

function FormAppointment(props) {
    const t = props.t;
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
    const [appointment, setAppointment] = useState();
    const myAppointment = props.user;
    const defaultBarber = props.user.nameBarber;
    const [price, setPrice] = useState(0);
    const [daysOfWork, setDaysOfWork] = useState([0, 1, 2, 3, 4, 5, 6]);
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
    const history = useHistory();
    const [defaultServices, setDefaultServices] = useState();
    const [defaultHour, setDefaultHour] = useState();

    const handleClose = () => {
        setShow(false);
    }


    useEffect(() => {

        fetchData();

    }, []) // eslint-disable-line react-hooks/exhaustive-deps



    function fetchData() {

        let startHour = new Date(myAppointment.startAppointment).getHours();
        let startMinute = new Date(myAppointment.startAppointment).getMinutes();

        setSelectedDate(new Date(myAppointment.startAppointment));

        setSelectedHour(new Date(myAppointment.startAppointment));



        let stringStartHour = startHour < 10 ? "0" + startHour : startHour;
        let stringStartMinute = startMinute < 10 ? "0" + startMinute : startMinute;

        setDefaultHour(stringStartHour + ":" + stringStartMinute);

        setChooseSomething(true);

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

                    if (barber.name === myAppointment.nameBarber) {

                        setSelectedServices([]);
                        setDefaultServices([]);

                        services_aux = barber.services.map(service => {

                            myAppointment.services.map(s => {
                                if (s.id === service.id) {
                                    if (language === 'en') {
                                        setSelectedServices(oldArray => [...oldArray, { label: service.nameEn, value: service.id }])
                                        setDefaultServices(oldArray => [...oldArray, {
                                            label: "Name service: " + service.nameEn + "\nPrice: " + service.price + " lei\nDuration: " + service.duration + " minutes", value: service.id, duration: service.duration, price: service.price

                                        }]);
                                    }
                                    else {
                                        setSelectedServices(oldArray => [...oldArray, { label: service.nameRo, value: service.id }]);
                                        setDefaultServices(oldArray => [...oldArray, {
                                            label: "Nume serviciu: " + service.nameRo + "\nPret: " + service.price + " lei\nDurata:" + service.duration + " minute", value: service.id, duration: service.duration, price: service.price
        
                                        }]);
                                    }
                                    setDuration(duration + s.duration);

                                }
                                return s;
                            })

                            return language === 'en' ?

                                {
                                    label: "Name service: " + service.nameEn + "\nPrice: " + service.price + " lei\nDuration: " + service.duration + " minutes", value: service.id, duration: service.duration, price: service.price

                                }
                                :
                                {
                                    label: "Nume serviciu: " + service.nameRo + "\nPret: " + service.price + " lei\nDurata:" + service.duration + " minute", value: service.id, duration: service.duration, price: service.price

                                }

                        });

                        setSelectedBarber(barber.id);
                        setServices(services_aux);

                        setPackages(packages_aux);


                    }

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

                    result.map(elem => {
                        setDaysOfWork(oldArray => [...oldArray, elem.day]);
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

                                    console.log(myAppointment.id)

                                    appointments_for_today.map(ap => {
                                        console.log(ap.id);
                                        if (myAppointment.id !== ap.id && newDate < new Date(ap.endAppointment) && new Date(ap.startAppointment) < newDateAfterAppointment) {
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



    }, [selectedDate, selectedBarber, selectedServices, selectedPackage]) // eslint-disable-line react-hooks/exhaustive-deps


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
                id: myAppointment.id,
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

        }


    };

    const sendData = (data) => {

        console.log(new Date(data.startAppointment));
        console.log(new Date(myAppointment.startAppointment));

        if (new Date(data.startAppointment).getTime() !== new Date(myAppointment.startAppointment).getTime()) {

            API_APPOINTMENT.editAppointment(data, (result, status, error) => {

                if (result !== null && (status === 200 || status === 201)) {

                    props.sendData();
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
                    props.handleClose();
                }
            });
        }
        else {
            props.handleClose();
            handleClose();
        }

    }


    const onChange = date => {

        setSelectedDate(date);
        setSelectedHour(undefined);

    };

    const onChangeChoice = () => {
        setChoice(prevState => !prevState);
        setDefaultServices([]);
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
        setDefaultServices([]);
        packagesAndServicesForBarbers.map(value => {
            if (value.id === id) {
                setPackages(value.packages);
                setServices(value.services);
            }
            return value;
        })
    }

    return (


        <form onSubmit={handleSubmit(onSubmit)}>
            <label> {t("appointment.barber")} </label>

            <Select

                name="form-dept-select"
                options={barbers}
                defaultValue={{ label: defaultBarber, value: selectedBarber }}
                onChange={handleChangeBarber}
            />


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
                            defaultValue={defaultServices}
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
                                        defaultValue={free ? { label: t('appointment.free'), value: 0 } : { label: defaultHour, value: selectedHour }}
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
                    <MyModal component={<OldPassword t={t} user={appointment} handleClose={handleClose} sendData={sendData} />} header={t('appointment.password')} show={show} handleClose={handleClose} />
                </div>
            }

            <div className="buttonHolder">
                <input type="submit" value={t("profile.button")} />{" "}
            </div>{" "}
        </form>


    );
}

export default FormAppointment;
