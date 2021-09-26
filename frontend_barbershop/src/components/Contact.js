import React, { useState } from 'react';
import '../commons/styles/contact.css';
import { useForm } from "react-hook-form";
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import * as API_USERS from "../commons/api/contact-api";
import {swalComponent} from './Swal';

function Contact(props) {

    const { register, handleSubmit, reset, errors } = useForm();
    const [value, setValue] = useState();

    const onSubmit = data => {

        if(!isValidPhoneNumber(String(value))) {

        swalComponent(t("contact.status"), t('register.notComplete'), "error");

        }
        
        else {

        let contact = {
            name: data.name,
            email: data.email,
            telephone: value,
            message: data.message,
            language: localStorage.getItem('i18nextLng')

        }
    
        API_USERS.postContact(contact, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                reset();
                swalComponent(t("contact.status"), t('contact.messageModal'), "success");

            } else {
                console.log(status);
                console.log(error);
                swalComponent(t('server.problem'), t('server.problem'), "error");
            }
        });
    }
    };

    const t = props.value;

    return (

        <div className="containerbig">
            <br/>
            <br/>
            <div className="containerContact"> 

                <form onSubmit={handleSubmit(onSubmit)}>

                    <label>{t('contact.name')}</label>

                    <input
                        name="name"
                        type="text"
                        placeholder={t('contact.name')}
                        ref={register({ required: t('contact.errorName'), minLength: 3, maxLength: 50 })} />

                        {errors.name && (
                            <div className="alert alert-danger" role="alert">
                                {errors.name.message ? errors.name.message : t('contact.errorNameLength')}
                                
                            </div>
                        )}

                    <label>Email</label>

                    <input
                        name="email"
                        type="text"
                        placeholder="Email"
                        ref={register({
                            required: t('contact.errorEmail'),
                            maxLength: 50,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: t('contact.errorEmailValid'),
                            },
                        })}
                    />

                        {errors.email && (
                            <div className="alert alert-danger" role="alert">
                                {errors.email.message ? errors.email.message : t('contact.errorEmailLength')}
                            </div>
                        )}  


                    <label>{t('contact.telephone')}</label>

                    <br/>

                    <PhoneInput
                    placeholder={t('contact.enterTelephone')}
                    value={value}
                    onChange={setValue}/>

                    {
                    !isValidPhoneNumber(String(value)) && value!==undefined && (
                            <div>
                            <br/>
                            <div className="alert alert-danger" role="alert">
                                
                                {t('contact.errorTelephone')}
                            </div>
                            </div>
                    )} 

                    <br/>

                    <label>{t('contact.message')}</label>

                    <textarea
                        name="message"
                        placeholder={t('contact.message')}
                        style={{ height: "200px" }}
                        ref={register({ required: t('contact.errorMessage'), maxLength: 999 })}
                    ></textarea>

                        {errors.message && (
                            <div className="alert alert-danger" role="alert">
                                {errors.message.message ? errors.message.message : t('contact.errorMessageLength')}
                            </div>
                        )}  

                    <div className="buttonHolder">
                        <input type="submit" value={t('contact.submit')} />
                    </div>
                </form>

            </div>

            <hr />

            <br />

        </div>
    )

}

export default Contact;