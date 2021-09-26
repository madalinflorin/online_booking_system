import React, { useState, useEffect } from 'react';
import '../commons/styles/contact.css';
import Select from 'react-select';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { Table } from '../commons/tables/Table';
import * as API_SERVICES from "../commons/api/service-api";
import * as API_USERS from "../commons/api/users-api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import MyModal from './Modal';
import FormService from '../commons/Forms/FormService';
import FormPackage from '../commons/Forms/FormPackage';
import FormUser from '../commons/Forms/FormUser';
import moment from 'moment';
import { swalComponent } from './Swal';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";


function AdminPage(props) {

    const t = props.value;
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(0);
    const [value, setValue] = useState(0);
    const [role, setRole] = useState(0);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [edit_text, setEdit] = useState();
    const [delete_text, setDelete] = useState();
    const [headerModal, setHeaderModal] = useState();
    const [title, setTitle] = useState();
    const [form, setForm] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const language = localStorage.getItem('i18nextLng');
    const history = useHistory();

    const handleClose = () => {

        if (value === 1) {
            setHeaderModal(t('admin.saveService'));
            setForm(<FormService handleData={handleDataService} value={t} />);
        }
        else if (value === 2) {
            setForm(<FormPackage swalComponent={swalComponent} handleDataService={handleDataService} handleData={handleDataPackage} value={t} />);
            setHeaderModal(t('admin.savePackage'))
        }
        else {
            setForm(<FormUser swalComponent={swalComponent} handleDataForUsers={handleDataUser} value={t} />);
            setHeaderModal(t('admin.saveUser'))
        }

        setShow(false);
    }

    const options = [
        {
            label: t('admin.option1'), value: 1
        },

        {
            label: t('admin.option2'), value: 2
        }
        ,

        {
            label: t('admin.option3'), value: 3
        }

    ];

    const optionsUsers = [
        {
            label: 'User', value: 1
        },

        {
            label: 'Barber', value: 2
        }
        ,

        {
            label: 'Admin', value: 3
        }

    ];

    const columnsServices = [
        {
            title: "ID",
            field: "id",
        },
        {
            title: t('admin.serviceNameRo'),
            field: "nameRo",
        },
        {
            title: t('admin.serviceNameEn'),
            field: "nameEn",
        },
        {
            title: t('admin.servicePrice'),
            field: "price",
        },
        {
            title: t('admin.serviceDuration'),
            field: "duration",
        },
    ];

    const columnsPackages = [
        {
            title: "ID",
            field: "id",
        },
        {
            title: t('admin.serviceNameRo'),
            field: "nameRo",
        },
        {
            title: t('admin.serviceNameEn'),
            field: "nameEn",
        },
        {
            title: t('admin.start_validity_period'),
            field: "start_validity_period",
        },
        {
            title: t('admin.end_validity_period'),
            field: "end_validity_period",
        },
        {
            title: "Discount",
            field: "discount",
        },
        {
            title: t('admin.start_discount_period'),
            field: "start_discount_period",
        },
        {
            title: t('admin.end_discount_period'),
            field: "end_discount_period",
        },
        {
            title: t('admin.option1'),
            field: "services",
        },
    ];

    const columnsUsersAndAdmins = [
        {
            title: "ID",
            field: "id",
        },
        {
            title: t("login.username"),
            field: "username",
        },
        {
            title: 'Email',
            field: "email",
        },
        {
            title: t("contact.name"),
            field: "name",
        },
        {
            title: t("register.birthdate"),
            field: "birthDate",
        },
        {
            title: t("register.gender"),
            field: "gender",
        },
        {
            title: t("admin.photo"),
            field: "photo",
        },
        {
            title: t("register.country"),
            field: "country",
        },
        {
            title: t("register.state"),
            field: "state",
        },
        {
            title: t("register.city"),
            field: "city",
        },
    ];

    const columnsBarbers = [
        {
            title: "ID",
            field: "id",
        },
        {
            title: t("login.username"),
            field: "username",
        },
        {
            title: 'Email',
            field: "email",
        },
        {
            title: t("contact.name"),
            field: "name",
        },
        {
            title: t("register.birthdate"),
            field: "birthDate",
        },
        {
            title: t("register.gender"),
            field: "gender",
        },
        {
            title: t("admin.photo"),
            field: "photo",
        },
        {
            title: t("register.country"),
            field: "country",
        },
        {
            title: t("register.state"),
            field: "state",
        },
        {
            title: t("register.city"),
            field: "city",
        },
        {
            title: t("admin.option1"),
            field: "services",
        },
        {
            title: t("admin.option2"),
            field: "packages",
        },
    ];

    useEffect(() => {
        setValue(0);
        setRole(0);
    }, [props.language])

    useEffect(() => {

        setIsLoading(true);

        if (value !== 0) {

            if (value === 1) {

                setRole(0);

                API_SERVICES.getServices((result, status, error) => {
                    setData([]);
                    if (result !== null && (status === 200 || status === 201)) {

                        result.map(item => {

                            setData(oldArray => [...oldArray, item])

                            return item;
                        }
                        );

                        setColumns(columnsServices);
                        setEdit(t('admin.editService'));
                        setDelete(t('admin.deleteService'));
                        setTitle(t('admin.serviceTitle'));
                        setHeaderModal(t('admin.saveService'));
                        setForm(<FormService handleData={handleDataService} value={t} />);

                        setIsLoading(false);

                    } else {
                        console.log(status);
                        console.log(error);
                        setError(error);
                        setErrorStatus(status);
                        if (status === 401) {
                            history.push("/");
                        }
                        else {

                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }

                    }
                });
            }

            if (value === 2) {

                setRole(0);

                API_SERVICES.getPackages((result, status, error) => {
                    setData([]);
                    if (result !== null && (status === 200 || status === 201)) {
                        console.log(result);

                        result.map(item => {

                            let services = item.services.map(service => {

                                return language === 'en' ?
                                    <li key={service.id}>{service.nameEn}</li>
                                    :
                                    <li key={service.id}>{service.nameRo}
                                    </li>
                            });

                            setData(oldArray => [...oldArray, { id: item.id, nameRo: item.nameRo, nameEn: item.nameEn, start_validity_period: moment(new Date(item.startValidityPeriod)).format('YYYY-MM-DD HH:mm:ss'), end_validity_period: moment(new Date(item.endValidityPeriod)).format('YYYY-MM-DD HH:mm:ss'), discount: item.discount, start_discount_period: moment(new Date(item.startDiscountPeriod)).format('YYYY-MM-DD HH:mm:ss'), end_discount_period: moment(new Date(item.endDiscountPeriod)).format('YYYY-MM-DD HH:mm:ss'), services: services }])

                            return item;
                        }
                        );

                        setColumns(columnsPackages);
                        setEdit(t('admin.editPackage'));
                        setDelete(t('admin.deletePackage'));
                        setTitle(t('admin.packageTitle'));
                        setHeaderModal(t('admin.savePackage'));
                        setForm(<FormPackage swalComponent={swalComponent} handleDataService={handleDataService} handleData={handleDataPackage} value={t} />);
                        setIsLoading(false);

                    } else {
                        console.log(status);
                        console.log(error);
                        setError(error);
                        setErrorStatus(status);
                        if (status === 401) {
                            history.push("/");
                        }
                        else {

                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }

                    }
                });
            }

            if (value === 3 && role === 1) {

                API_USERS.getUsers((result, status, error) => {
                    setData([]);
                    if (result !== null && (status === 200 || status === 201)) {

                        result.map(item => {

                            setData(oldArray => [...oldArray, {
                                id: item.id, username: item.username, email: item.email, name: item.name, birthDate: moment(new Date(item.birthDate)).format('YYYY-MM-DD HH:mm:ss'), gender: item.gender,
                                photo:
                                    <img
                                        src={`data:image/jpeg;base64,${item.photo}`}
                                        alt="profile-img"
                                        className="profile-img-card"
                                    />, country: item.country, state: item.state, city: item.city
                            }])

                            return item;
                        }
                        );

                        setColumns(columnsUsersAndAdmins);
                        setEdit(t('admin.editUser'));
                        setDelete(t('admin.deleteUser'));
                        setTitle(t('admin.userTitle'));
                        setHeaderModal(t('admin.saveUser'));
                        setForm(<FormUser swalComponent={swalComponent} handleDataForUsers={handleDataUser} value={t} />);
                        setIsLoading(false);

                    } else {
                        console.log(status);
                        console.log(error);
                        setError(error);
                        setErrorStatus(status);
                        if (status === 401) {
                            history.push("/");
                        }
                        else {

                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }

                    }
                });
            }

            if (value === 3 && role === 2) {

                API_USERS.getBarbers((result, status, error) => {
                    setData([]);
                    if (result !== null && (status === 200 || status === 201)) {
                        result.map(item => {

                            let services = item.services.map(service =>
                                language === 'en' ?
                                    <li key={service.id}>{service.nameEn}</li>
                                    :
                                    <li key={service.id}>{service.nameRo}</li>

                            );

                            let packages = item.packages.map(p =>
                                language === 'en' ?
                                    <li key={p.id}>{p.nameEn}</li>
                                    :
                                    <li key={p.id}>{p.nameRo}</li>

                            );


                            setData(oldArray => [...oldArray, {
                                id: item.id, username: item.username, email: item.email, name: item.name, birthDate: moment(new Date(item.birthDate)).format('YYYY-MM-DD HH:mm:ss'), gender: item.gender, photo:
                                    <img
                                        src={`data:image/jpeg;base64,${item.photo}`}
                                        alt="profile-img"
                                        className="profile-img-card"
                                    />, country: item.country, state: item.state, city: item.city, services: services, packages: packages
                            }])

                            return item;
                        }
                        );

                        setColumns(columnsBarbers);
                        setEdit(t('admin.editBarber'));
                        setDelete(t('admin.deleteBarber'));
                        setTitle(t('admin.barberTitle'));
                        setHeaderModal(t('admin.saveBarber'));
                        setForm(<FormUser swalComponent={swalComponent} handleDataForUsers={handleDataUser} value={t} />);
                        setIsLoading(false);

                    } else {
                        console.log(status);
                        console.log(error);
                        setError(error);
                        setErrorStatus(status);
                        if (status === 401) {
                            history.push("/");
                        }
                        else {

                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }

                    }
                });
            }


            if (value === 3 && role === 3) {

                API_USERS.getAdmins((result, status, error) => {
                    setData([]);
                    if (result !== null && (status === 200 || status === 201)) {
                        console.log(result);

                        result.map(item => {


                            setData(oldArray => [...oldArray, {
                                id: item.id, username: item.username, email: item.email, name: item.name, birthDate: moment(new Date(item.birthDate)).format('YYYY-MM-DD HH:mm:ss'), gender: item.gender,
                                photo:
                                    <img
                                        src={`data:image/jpeg;base64,${item.photo}`}
                                        alt="profile-img"
                                        className="profile-img-card"
                                    />, country: item.country, state: item.state, city: item.city
                            }])

                            return item;
                        }
                        );

                        setColumns(columnsUsersAndAdmins);
                        setEdit(t('admin.editAdmin'));
                        setDelete(t('admin.deleteAdmin'));
                        setTitle(t('admin.adminTitle'));
                        setHeaderModal(t('admin.saveAdmin'));
                        setForm(<FormUser swalComponent={swalComponent} handleDataForUsers={handleDataUser} value={t} />);
                        setIsLoading(false);

                    } else {
                        console.log(status);
                        console.log(error);
                        setError(error);
                        setErrorStatus(status);
                        if (status === 401) {
                            history.push("/");
                        }
                        else {

                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }

                    }
                });
            }


        }

    }, [value, role]) // eslint-disable-line react-hooks/exhaustive-deps

    const editServiceMethod = (data) => {

        setHeaderModal(t('admin.editService'));
        setForm(<FormService id={data.id} defaultNameRo={data.nameRo} defaultNameEn={data.nameEn} defaultPrice={data.price} defaultDuration={data.duration} handleData={handleDataServiceEdit} value={t} />);
        handleShow(true);
    }

    const deleteServiceMethod = (id) => {

        Swal.fire({
            title: t('delete.title'),
            text: t('delete.text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8B7871',
            cancelButtonColor: '#d33',
            confirmButtonText: t('delete.messageButton')
        }).then((result) => {
            if (result.isConfirmed) {

                API_SERVICES.deleteService(id, (result, status, error) => {
                    if (result !== null && (status === 200 || status === 201)) {

                        setData(data.filter(item => item.id !== id));

                        swalComponent(t('contact.status'), t('admin.successDelete'), "success");

                    } else {
                        console.log(status);
                        console.log(error);
                        setError(error);
                        setErrorStatus(status);
                        if (status === 400) {
                            swalComponent(t('contact.status'), t('admin.errorFindService'), "error");
                        }
                        else if (status === 401) {
                            history.push("/");
                        }
                        else {
                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }

                    }
                });

            }
        })

    }

    const editPackageMethod = (data) => {

        setHeaderModal(t('admin.editPackage'));
        setForm(<FormPackage id={data.id} defaultNameRo={data.nameRo} defaultNameEn={data.nameEn} defaultStartValidity={new Date(data.start_validity_period)} defaultEndValidity={new Date(data.end_validity_period)} defaultDiscount={data.discount} defaultStartDiscount={new Date(data.start_discount_period)} defaultEndDiscount={new Date(data.end_discount_period)} swalComponent={swalComponent} handleData={handleDataPackageEdit} value={t} />);
        handleShow(true);
    }

    const deletePackageMethod = (id) => {

        Swal.fire({
            title: t('delete.title'),
            text: t('delete.text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8B7871',
            cancelButtonColor: '#d33',
            confirmButtonText: t('delete.messageButton')
        }).then((result) => {
            if (result.isConfirmed) {

                API_SERVICES.deletePackage(id, (result, status, error) => {
                    if (result !== null && (status === 200 || status === 201)) {

                        setData(data.filter(item => item.id !== id));

                        swalComponent(t('contact.status'), t('admin.successDeletePackage'), "success");

                    } else {
                        console.log(status);
                        console.log(error);
                        setError(error);
                        setErrorStatus(status);
                        if (status === 400) {
                            swalComponent(t('contact.status'), t('admin.errorFindPackage'), "error");
                        }
                        else if (status === 401) {
                            history.push("/");
                        }
                        else {
                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }

                    }
                });
            }
        })

    }

    const handleSubmit = () => {
        handleShow();
    }

    const handleDataService = (data) => {
        handleClose();

        API_SERVICES.postService(data, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                setData(oldArray => [...oldArray, { id: result.id, nameRo: result.nameRo, nameEn: result.nameEn, price: result.price, duration: result.duration }]);


                swalComponent(t('contact.status'), t('admin.successAddService'), "success");


            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                swalComponent(t('server.problem'), t('server.problem'), "error");

            }
        });

    }

    const handleDataPackage = (data) => {
        handleClose();

        API_SERVICES.postPackage(data, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                let services = result.services.map(service => {


                    return language === 'en' ?
                        <li key={service.id}>{service.nameEn}</li>
                        :
                        <li key={service.id}>{service.nameRo}
                        </li>
                });

                setData(oldArray => [...oldArray, { id: result.id, nameRo: result.nameRo, nameEn: result.nameEn, start_validity_period: moment(new Date(result.startValidityPeriod)).format('YYYY-MM-DD HH:mm:ss'), end_validity_period: moment(new Date(result.endValidityPeriod)).format('YYYY-MM-DD HH:mm:ss'), discount: result.discount, start_discount_period: moment(new Date(result.startDiscountPeriod)).format('YYYY-MM-DD HH:mm:ss'), end_discount_period: moment(new Date(result.endDiscountPeriod)).format('YYYY-MM-DD HH:mm:ss'), services: services }])

                swalComponent(t('contact.status'), t('admin.successAddPackage'), "success");


            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                if (status === 400) {

                    swalComponent(t('contact.status'), t('admin.errorCreatePackage'), "error");

                }
                else if (status === 401) {
                    history.push("/");
                }
                else if (status === 402) {

                    swalComponent(t('contact.status'), t('admin.errorAddServiceToPackage'), "error");

                }
                else {
                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }

            }
        });

    }

    const handleDataUser = (data) => {


        API_USERS.insertUser(data, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                if ((data.role.includes("user") && role === 1) || (data.role.includes("admin") && role === 3)) {
                    setData(oldArray => [...oldArray, {
                        id: result.id, username: result.username, email: result.email, name: result.name, birthDate: moment(new Date(result.birthDate)).format('YYYY-MM-DD HH:mm:ss'), gender: result.gender, photo: <img
                            src={`data:image/jpeg;base64,${result.photo}`}
                            alt="profile-img"
                            className="profile-img-card"
                        />, country: result.country, state: result.state, city: result.city
                    }])
                }

                if (data.role.includes("barber") && role === 2) {
                    let services = result.services.map(service =>
                        language === 'en' ?
                            <li key={service.id}>{service.nameEn}</li>
                            :
                            <li key={service.id}>{service.nameRo}</li>

                    );

                    let packages = result.packages.map(p =>
                        language === 'en' ?
                            <li key={p.id}>{p.nameEn}</li>
                            :
                            <li key={p.id}>{p.nameRo}</li>

                    );


                    setData(oldArray => [...oldArray, { id: result.id, username: result.username, email: result.email, name: result.name, birthDate: moment(new Date(result.birthDate)).format('YYYY-MM-DD HH:mm:ss'), gender: result.gender, photo: result.photo, country: result.country, state: result.state, city: result.city, services: services, packages: packages }])

                }

                handleClose();

                swalComponent(t('contact.status'), t('admin.successAddUser'), "success");


            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                if (status === 400) {
                    swalComponent(t('contact.status'), t('register.usernameError'), "error");
                }
                else if (status === 401) {
                    history.push("/");
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


    const handleDataServiceEdit = (oldId, datas) => {

        let service = {
            id: oldId,
            nameRo: datas.nameRo,
            nameEn: datas.nameEn,
            price: datas.price,
            duration: datas.duration
        }

        API_SERVICES.editService(service, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                setData(data.map(item => {
                    if (item.id === result.id) {
                        item.nameRo = result.nameRo;
                        item.nameEn = result.nameEn;
                        item.price = result.price;
                        item.duration = result.duration;
                    }
                    return item;
                }));
                handleClose();
                setForm(<FormService handleData={handleDataService} value={t} />)
                swalComponent(t('contact.status'), t('admin.successEdit'), "success");

            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                if (status === 400) {
                    swalComponent(t('contact.status'), t('admin.errorFindService'), "error");
                }
                else if (status === 401) {
                    history.push("/");
                }
                else {
                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }

            }
        });
    }


    const handleDataPackageEdit = (datas) => {

        API_SERVICES.editPackage(datas, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                let services = result.services.map(service => {

                    return language === 'en' ?
                        <li key={service.id}>{service.nameEn}</li>
                        :
                        <li key={service.id}>{service.nameRo}
                        </li>
                });


                setData(data.map(item => {
                    if (item.id === result.id) {
                        item.nameRo = result.nameRo;
                        item.nameEn = result.nameEn;
                        item.start_validity_period = moment(new Date(result.startValidityPeriod)).format('YYYY-MM-DD HH:mm:ss');
                        item.end_validity_period = moment(new Date(result.endValidityPeriod)).format('YYYY-MM-DD HH:mm:ss');
                        item.discount = result.discount;
                        item.start_discount_period = moment(new Date(result.startDiscountPeriod)).format('YYYY-MM-DD HH:mm:ss');
                        item.end_discount_period = moment(new Date(result.endDiscountPeriod)).format('YYYY-MM-DD HH:mm:ss');
                        item.services = services;
                    }
                    return item;
                }));
                handleClose();
                setForm(<FormPackage swalComponent={swalComponent} handleDataService={handleDataService} handleData={handleDataPackage} value={t} />)
                swalComponent(t('contact.status'), t('admin.successEditPackage'), "success");

            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                if (status === 400) {
                    swalComponent(t('contact.status'), t('admin.errorFindPackage'), "error");
                }
                else if (status === 401) {
                    history.push("/");
                }
                else {
                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }

            }
        });

    }

    const deleteUserMethod = (id) => {

        Swal.fire({
            title: t('delete.title'),
            text: t('delete.text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8B7871',
            cancelButtonColor: '#d33',
            confirmButtonText: t('delete.messageButton')
        }).then((result) => {
            if (result.isConfirmed) {

                API_USERS.deleteUser(id, (result, status, error) => {
                    if (result !== null && (status === 200 || status === 201)) {

                        setData(data.filter(item => item.id !== id));

                        swalComponent(t('contact.status'), t('admin.successDeleteUser'), "success");

                    } else {
                        console.log(status);
                        console.log(error);
                        setError(error);
                        setErrorStatus(status);
                        if (status === 400) {
                            swalComponent(t('contact.status'), t('admin.errorFindUser'), "error");
                        }
                        else if (status === 401) {
                            history.push("/");
                        }
                        else {
                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }

                    }
                });


            }
        })

    }

    const editUserMethod = (data) => {

        setHeaderModal(t('admin.editUser'));

        API_USERS.selectUser(data.id, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                let roles = [];
                let isBarber = false;
                let packages = [];
                let services = [];

                result.packages.map(p => {
                    language === 'en' ?
                        packages = [...packages, { label: p.nameEn, value: p.id }]
                        :
                        packages = [...packages, { label: p.nameRo, value: p.id }]
                    return p;
                })

                result.services.map(p => {
                    language === 'en' ?
                        services = [...services, { label: p.nameEn, value: p.id }]
                        :
                        services = [...services, { label: p.nameRo, value: p.id }]
                    return p;
                })

                result.role.map(role => {
                    if (role.name === "ROLE_BARBER") {
                        roles = [...roles, { label: "Barber", value: "barber" }];
                        isBarber = true;
                    }
                    if (role.name === "ROLE_ADMIN") {
                        roles = [...roles, { label: "Admin", value: "admin" }];
                    }

                    if (role.name === "ROLE_USER") {
                        roles = [...roles, { label: "User", value: "user" }];
                    }
                    return role;
                })

                console.log(services);
                console.log(packages);
                console.log(roles);
                setForm(<FormUser isBarber={isBarber} id={data.id} defaultUsername={result.username} defaultName={result.name} defaultEmail={result.email} defaultBirthDate={result.birthDate} defaultGender={result.gender} defaultPhoto={result.photo} defaultCountry={result.country} defaultState={result.state} defaultCity={result.city} defaultServices={services} defaultPackages={packages} defaultRoles={roles} defaultPrograms={result.programs} swalComponent={swalComponent} handleDataUserEdit={handleDataUserEdit} value={t} />);
                handleShow(true);

            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                if (status === 400) {
                    swalComponent(t('contact.status'), t('admin.errorFindUser'), "error");
                }
                else if (status === 401) {
                    history.push("/");
                }
                else {
                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }

            }
        });

    }

    const handleDataUserEdit = (id, datas) => {

        let user = { ...datas, id: id };

        API_USERS.editUser(user, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                console.log(result);
                let services;
                let packages;

                if (result.services) {

                    services = result.services.map(service => {

                        return language === 'en' ?
                            <li key={service.id}>{service.nameEn}</li>
                            :
                            <li key={service.id}>{service.nameRo}
                            </li>
                    });
                }

                if (result.packages) {
                    packages = result.packages.map(p => {

                        return language === 'en' ?
                            <li key={p.id}>{p.nameEn}</li>
                            :
                            <li key={p.id}>{p.nameRo}
                            </li>
                    });
                }

                setData(data.map(item => {
                    if (item.id === result.id) {
                        item.username = result.username;
                        item.name = result.name;
                        item.email = result.email;
                        item.gender = result.gender;
                        item.country = result.country;
                        item.state = result.state;
                        item.city = result.city;
                        item.photo =
                            <img
                                src={`data:image/jpeg;base64,${result.photo}`}
                                alt="profile-img"
                                className="profile-img-card"
                            />;
                        item.birthDate = moment(new Date(result.birthDate)).format('YYYY-MM-DD HH:mm:ss');
                        item.services = services;
                        item.packages = packages;
                    }
                    return item;
                }));
                handleClose();
                setForm(<FormUser swalComponent={swalComponent} handleDataForUsers={handleDataUser} value={t} />);
                swalComponent(t('contact.status'), t('admin.successEditUser'), "success");

            } else {
                console.log(status);
                console.log(error);
                setError(error);
                setErrorStatus(status);
                if (status === 400) {
                    swalComponent(t('contact.status'), t('register.usernameError'), "error");
                }
                else if (status === 401) {
                    history.push("/");
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
            <br />
            <div className="containerContact">


                <form>

                    <label>{t('admin.select')}</label>

                    {props.language === 'en' &&
                        <Select
                            name="form-dept-select"
                            options={options}
                            defaultValue={{ label: t('admin.select'), value: 0 }}
                            onChange={e => {
                                setValue(e.value);
                            }}
                        />
                    }

                    {props.language === 'ro' &&
                        <Select
                            name="form-dept-select5"
                            options={options}
                            defaultValue={{ label: t('admin.select'), value: 0 }}
                            onChange={e => {
                                setValue(e.value);
                            }}
                        />
                    }

                    {value === 3 &&
                        <div>
                            <br />
                            <label>{t('admin.selectRoleUser')}</label>
                            <Select
                                name="form-dept-select"
                                options={optionsUsers}
                                defaultValue={{ label: t('admin.select'), value: 0 }}
                                onChange={e => {
                                    setRole(e.value);
                                }}
                            />
                        </div>
                    }

                </form>

            </div>
            <br />
            {!isLoading ?
                <div className="containerContact">
                    <Table data={data} columns={columns} editService={edit_text} deleteService={delete_text} title={title} editMethod={value === 1 ? editServiceMethod : value === 2 ? editPackageMethod : editUserMethod} deleteMethod={value === 1 ? deleteServiceMethod : value === 2 ? deletePackageMethod : deleteUserMethod} />

                    <br />
                    <button type='button' className='btn btn-outline-secondary' id="buttonAdmin" onClick={handleSubmit}>
                        <span>
                            <FontAwesomeIcon icon={faPlus} />
                        </span>
                    </button>
                </div>
                :
                <div></div>
            }

            <MyModal component={form} header={headerModal} show={show} handleClose={handleClose} />

            <hr />
            <br />
            {
                errorStatus > 401 &&
                <div>

                    <br />
                    <APIResponseErrorMessage errorStatus={errorStatus} error={error} />
                </div>
            }
        </div>


    )

}

export default AdminPage;