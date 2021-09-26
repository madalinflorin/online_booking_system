import React from 'react';
import '../styles/contact.css';
import { useForm } from "react-hook-form";
import 'react-phone-number-input/style.css';

function FormService(props) {

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = data => {

        props.id ?
        props.handleData(props.id, data)
        :
        props.handleData(data)

    };

    const t = props.value;

    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <label>{t('admin.serviceNameRo')}</label>

            <input
                name="nameRo"
                type="text"
                placeholder={t('admin.serviceNameRo')}
                defaultValue = {props.defaultNameRo ? props.defaultNameRo : ""}
                ref={register({ required: t('admin.errorNameService'), minLength: 3, maxLength: 50 })} />

            {errors.nameRo && (
                <div className="alert alert-danger" role="alert">
                    {errors.nameRo.message ? errors.nameRo.message : t('admin.errorNameServiceLength')}

                </div>
            )}

            <label>{t('admin.serviceNameEn')}</label>

            <input
                name="nameEn"
                type="text"
                placeholder={t('admin.serviceNameEn')}
                defaultValue = {props.defaultNameEn ? props.defaultNameEn : ""}
                ref={register({ required: t('admin.errorNameService'), minLength: 3, maxLength: 50 })} />

            {errors.nameEn && (
                <div className="alert alert-danger" role="alert">
                    {errors.nameEn.message ? errors.nameEn.message : t('admin.errorNameServiceLength')}

                </div>
            )}

            <label>{t('admin.servicePrice')}</label>

            <input
                name="price"
                type="text"
                placeholder={t('admin.servicePrice')}
                defaultValue = {props.defaultPrice ? props.defaultPrice : ""}
                ref={register({
                    required: t('admin.errorPrice'),
                    pattern: {
                        value: /^[+-]?\d+(\.\d+)?$/
                    },
                    min: 1

                })}
            />

            {errors.price && (
                <div className="alert alert-danger" role="alert">
                    {errors.price.message ? errors.price.message : t('admin.float')}

                </div>
            )}

            <label>{t('admin.serviceDuration')}</label>

            <input
                name="duration"
                type="text"
                placeholder={t('admin.serviceDuration')}
                defaultValue = {props.defaultDuration ? props.defaultDuration : ""}
                ref={register({
                    required: t('admin.errorDuration'),
                    pattern: {
                        value: /^[+]?\d+$/
                    },
                    min: 10,
                    max: 60
                })}
            />

            {errors.duration && (
                <div className="alert alert-danger" role="alert">
                    {errors.duration.message ? errors.duration.message : t('admin.errorDurationLength')}

                </div>
            )}

            <div className="buttonHolder">
                <input type="submit" value={t('profile.button')} />
            </div>
        </form>

    )

}

export default FormService;