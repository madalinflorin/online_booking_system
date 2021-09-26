import React, { useState, useEffect } from 'react';
import '../styles/contact.css';
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import moment from 'moment'
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import * as API_SERVICES from "../api/service-api";


function FormPackage(props) {

    const t = props.value;
    const { register, handleSubmit, errors } = useForm();
    const [startValidityPeriod, setStartValidityPerid] = useState(props.defaultStartValidity ? props.defaultStartValidity : new Date());
    const [endValidityPeriod, setEndValidityPeriod] = useState(props.defaultEndValidity ? props.defaultEndValidity : new Date());
    const [startDiscountPeriod, setStartDiscountPeriod] = useState(props.defaultStartDiscount ? props.defaultStartDiscount : new Date());
    const [endDiscountPeriod, setEndDiscountPeriod] = useState(props.defaultEndDiscount ? props.defaultEndDiscount : new Date());
    const [isStartValidityPeriodLowerThanEndValidityPeriod, setIsStartValidityPeriodLowerThanEndValidityPeriod] = useState(true);
    const [isStartDiscountPeriodLowerThanEndDiscountPeriod, setIsStartDiscountPeriodLowerThanEndDiscountPeriod] = useState(true);
    const [isDiscountPeriodInValidityRange, setIsDiscountPeriodInValidityRange] = useState(true);
    const [services_id, setServicesId] = useState([]);
    const today = new Date();
    const myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const [servicesForPackage, setServicesForPackage] = useState([]);
    const language = localStorage.getItem('i18nextLng');
    const [chooseServices, setChooseServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const isSelectedDateInFuture = (startDate) => {

        let date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0)

        return myToday < date;
    }

    let currentHour = today.getHours();
    let currentMins = today.getMinutes();


    useEffect(() => {

        if (props.id) {
            setIsLoading(true);
            API_SERVICES.getPackage(props.id, (result, status, error) => {
                setChooseServices([]);
                if (result !== null && (status === 200 || status === 201)) {
                    console.log(result);

                    result.services.map(item => {

                        language === 'en' ?
                            setChooseServices(oldArray => [...oldArray, { label: item.nameEn, value: item.id }])
                            :
                            setChooseServices(oldArray => [...oldArray, { label: item.nameRo, value: item.id }])

                        return item;
                    }
                    );
                    setIsLoading(false);

                } else {
                    console.log(status);
                    console.log(error);
                    props.swalComponent(t('server.problem'), t('server.problem'), "error");

                }
            });
        }

        API_SERVICES.getServices((result, status, error) => {
            setServicesForPackage([]);
            if (result !== null && (status === 200 || status === 201)) {
                console.log(result);

                result.map(item => {

                    language === 'en' ?
                        setServicesForPackage(oldArray => [...oldArray, { label: item.nameEn, value: item.id }])
                        :
                        setServicesForPackage(oldArray => [...oldArray, { label: item.nameRo, value: item.id }])

                    language === 'en' ?
                        setServicesId(oldArray => [...oldArray, { label: item.nameEn, value: item.id }])
                        :
                        setServicesId(oldArray => [...oldArray, { label: item.nameRo, value: item.id }])

                    return item;
                }
                );



            } else {
                console.log(status);
                console.log(error);
                props.swalComponent(t('server.problem'), t('server.problem'), "error");

            }
        });
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    const onSubmit = data => {

        if (startValidityPeriod>=endValidityPeriod) {

            props.swalComponent(t('contact.status'), t('admin.errorValidityPeriod'), "error");
            setIsStartValidityPeriodLowerThanEndValidityPeriod(false);

        }
        else if (startDiscountPeriod>=endDiscountPeriod) {

            props.swalComponent(t('contact.status'), t('admin.errorDiscountPeriod'), "error");
            setIsStartDiscountPeriodLowerThanEndDiscountPeriod(false);

        }
        else if (startDiscountPeriod <= startValidityPeriod || endDiscountPeriod >= endValidityPeriod) {

            props.swalComponent(t('contact.status'), t('admin.errorValidityDiscount'), "error");
            setIsDiscountPeriodInValidityRange(false);
        }
        else if (services_id.length === 0) {
            props.swalComponent(t('contact.status'), t('admin.errorServices'), "error");
        }
        else {

            let services_ids = services_id.map(service => service.value);

            let response;

            if (props.id) {
                response = {
                    id: props.id,
                    nameRo: data.nameRo,
                    nameEn: data.nameEn,
                    startValidityPeriod: startValidityPeriod,
                    endValidityPeriod: endValidityPeriod,
                    discount: data.discount,
                    startDiscountPeriod: startDiscountPeriod,
                    endDiscountPeriod: endDiscountPeriod,
                    services_id: services_ids
                }
            }
            else {
                response = {
                    nameRo: data.nameRo,
                    nameEn: data.nameEn,
                    startValidityPeriod: startValidityPeriod,
                    endValidityPeriod: endValidityPeriod,
                    discount: data.discount,
                    startDiscountPeriod: startDiscountPeriod,
                    endDiscountPeriod: endDiscountPeriod,
                    services_id: services_ids
                }
            }

            props.handleData(response);

        }


    };

    const onChangeStartValidityPeriod = date => {

        setStartValidityPerid(date);
        if (date < endValidityPeriod) {
            setIsStartValidityPeriodLowerThanEndValidityPeriod(true);
        }
        else {
            setIsStartValidityPeriodLowerThanEndValidityPeriod(false);
        }

        if (startDiscountPeriod > date && endDiscountPeriod < endValidityPeriod) {

            setIsDiscountPeriodInValidityRange(true);
        }
        else {
            setIsDiscountPeriodInValidityRange(false);
        }

    }

    const onChangeEndValidityPeriod = date => {
        setEndValidityPeriod(date);
        if (startValidityPeriod < date) {
            setIsStartValidityPeriodLowerThanEndValidityPeriod(true);
        }
        else {
            setIsStartValidityPeriodLowerThanEndValidityPeriod(false);
        }

        if (startDiscountPeriod > startValidityPeriod && endDiscountPeriod < date) {

            setIsDiscountPeriodInValidityRange(true);
        }
        else {
            setIsDiscountPeriodInValidityRange(false);
        }
    }

    const onChangeStartDiscountPeriod = date => {
        setStartDiscountPeriod(date);
        if (date < endDiscountPeriod) {
            setIsStartDiscountPeriodLowerThanEndDiscountPeriod(true);
        }
        else {
            setIsStartDiscountPeriodLowerThanEndDiscountPeriod(false);
        }

        if (date > startValidityPeriod && endDiscountPeriod < endValidityPeriod) {

            setIsDiscountPeriodInValidityRange(true);
        }
        else {
            setIsDiscountPeriodInValidityRange(false);
        }
    }

    const onChangeEndDiscountPeriod = date => {
        setEndDiscountPeriod(date);
        if (startDiscountPeriod < date) {
            setIsStartDiscountPeriodLowerThanEndDiscountPeriod(true);
        }
        else {
            setIsStartDiscountPeriodLowerThanEndDiscountPeriod(false);
        }

        if (startDiscountPeriod > startValidityPeriod && date < endValidityPeriod) {

            setIsDiscountPeriodInValidityRange(true);
        }
        else {
            setIsDiscountPeriodInValidityRange(false);
        }

    }

    const handleSelectMultiple = (e) => {
        setServicesId(e);
    }


    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <label>{t('admin.packageNameRo')}</label>

            <input
                name="nameRo"
                type="text"
                placeholder={t('admin.packageNameRo')}
                defaultValue={props.defaultNameRo ? props.defaultNameRo : ""}
                ref={register({ required: t('admin.errorNamePackage'), minLength: 3, maxLength: 50 })} />

            {errors.nameRo && (
                <div className="alert alert-danger" role="alert">
                    {errors.nameRo.message ? errors.nameRo.message : t('admin.errorNamePackageLength')}

                </div>
            )}

            <label>{t('admin.packageNameEn')}</label>

            <input
                name="nameEn"
                type="text"
                placeholder={t('admin.packageNameEn')}
                defaultValue={props.defaultNameEn ? props.defaultNameEn : ""}
                ref={register({ required: t('admin.errorNamePackage'), minLength: 3, maxLength: 50 })} />

            {errors.nameEn && (
                <div className="alert alert-danger" role="alert">
                    {errors.nameEn.message ? errors.nameEn.message : t('admin.errorNamePackageLength')}

                </div>
            )}

            <label> {t("admin.start_validity_period")} </label>

            <div>
                <DatePicker
                    selected={startValidityPeriod}
                    onChange={onChangeStartValidityPeriod}
                    minDate={new Date()}
                    peekNextMonth
                    showTimeSelect
                    minTime={isSelectedDateInFuture(startValidityPeriod) ? new Date(new Date().setHours(0, 0, 0, 0)) : new Date(new Date().setHours(currentHour, currentMins, 0, 0))}
                    maxTime={moment().endOf('day').toDate()}
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                />
            </div>

            <label> {t("admin.end_validity_period")} </label>

            <div>
                <DatePicker
                    selected={endValidityPeriod}
                    onChange={onChangeEndValidityPeriod}
                    minDate={new Date()}
                    peekNextMonth
                    showTimeSelect
                    minTime={isSelectedDateInFuture(endValidityPeriod) ? new Date(new Date().setHours(0, 0, 0, 0)) : new Date(new Date().setHours(currentHour, currentMins, 0, 0))}
                    maxTime={moment().endOf('day').toDate()}
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                />
            </div>

            {!isStartValidityPeriodLowerThanEndValidityPeriod && (
                <div className="alert alert-danger" role="alert">
                    {t('admin.errorValidityPeriod')}

                </div>
            )}

            <label>Discount</label>

            <input
                name="discount"
                type="text"
                placeholder={"Discount"}
                defaultValue={props.defaultDiscount ? props.defaultDiscount : ""}
                ref={register({
                    required: t('admin.discount'),
                    pattern: {
                        value: /^[+]?\d+$/
                    },
                    min: 0,
                    max: 100
                })}
            />

            {errors.discount && (
                <div className="alert alert-danger" role="alert">
                    {errors.discount.message ? errors.discount.message : t('admin.errorDiscount')}

                </div>
            )}

            <label> {t("admin.start_discount_period")} </label>

            <div>
                <DatePicker
                    selected={startDiscountPeriod}
                    onChange={onChangeStartDiscountPeriod}
                    minDate={new Date()}
                    peekNextMonth
                    showTimeSelect
                    minTime={isSelectedDateInFuture(startDiscountPeriod) ? new Date(new Date().setHours(0, 0, 0, 0)) : new Date(new Date().setHours(currentHour, currentMins, 0, 0))}
                    maxTime={moment().endOf('day').toDate()}
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                />
            </div>

            <label> {t("admin.end_discount_period")} </label>

            <div>
                <DatePicker
                    selected={endDiscountPeriod}
                    onChange={onChangeEndDiscountPeriod}
                    minDate={new Date()}
                    minTime={isSelectedDateInFuture(endDiscountPeriod) ? new Date(new Date().setHours(0, 0, 0, 0)) : new Date(new Date().setHours(currentHour, currentMins, 0, 0))}
                    maxTime={moment().endOf('day').toDate()}
                    peekNextMonth
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                />
            </div>


            {!isStartDiscountPeriodLowerThanEndDiscountPeriod && (
                <div className="alert alert-danger" role="alert">
                    {t('admin.errorDiscountPeriod')}
                </div>
            )}

            {!isDiscountPeriodInValidityRange && (
                <div className="alert alert-danger" role="alert">
                    {t('admin.errorValidityDiscount')}
                </div>
            )}

            <label> {t("admin.option1")} </label>

            {!isLoading &&
                <Select
                    name="form-dept-select"
                    options={servicesForPackage}
                    defaultValue={chooseServices}
                    isMulti
                    onChange={handleSelectMultiple}
                />
            }


            <br />

            <div className="buttonHolder">
                <input type="submit" value={t('profile.button')} />
            </div>


        </form>

    )

}

export default FormPackage;