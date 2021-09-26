import React, { useState, useEffect } from "react";
import { Route, Link, Switch } from "react-router-dom";
import Home from "./Home";
import News from "./News";
import AboutUs from "./AboutUs";
import Barbers from './Barbers';
import Services from "./Services";
import Contact from "./Contact";
import Login from "./Login";
import Register from './Register';
import AdminPage from './AdminPage';
import { useTranslation } from "react-i18next";
import AuthService from '../services/AuthService';
import Profile from "./Profile";
import Appointment from './Appointment';
import Calendar from './Calendar';
import Graphic from './Graphic';
import PrivateRoute from "./private-route";
import { Redirect } from 'react-router-dom';
import ActivationPage from './ActivationPage';
import AuthVerifyComponent from './AuthVerifyComponent';
import { useHistory } from 'react-router-dom';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';
import Chat from './chat/Chat';

function Header() {

    const { t, i18n } = useTranslation();
    const [user, isUser] = useState(false);
    const [barber, isBarber] = useState(false);
    const [admin, isAdmin] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const history = useHistory();
    const [language, setLanguage] = useState('');

    useEffect(() => {

        isUser(false);
        isBarber(false);
        isAdmin(false);

        setLanguage(localStorage.getItem('i18nextLng'));

        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {

            currentUser.roles.map(role => {
                if (role === 'ROLE_ADMIN') {
                    isAdmin(true);
                }
                if (role === 'ROLE_BARBER') {
                    isBarber(true);
                }
                if (role === 'ROLE_USER') {
                    isUser(true);
                }
                return role;
            })
        }

    }, [isModified]) // eslint-disable-line react-hooks/exhaustive-deps



    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
    };


    const logOut = () => {
        AuthService.logout();
        history.push('/');
        setIsModified(prevState => !prevState);
    }

    return (
        <div>
            <AuthVerifyComponent setIsModified={setIsModified} />
            <header>
                <div className="nav-bar">
                    <ul>
                        <li id="logo">
                            {" "}
                            <img
                                alt="logo-barbershop"
                                width="65"
                                height="65"
                                src="https://www.barber-shop.ro/wp-content/uploads/2021/01/logo-png-dimensiuni.png"
                            />{" "}
                        </li>{" "}
                        <li className="onLeft">
                            {" "}
                            <Link to="/">
                                {" "}
                                <strong> BarberSHOP </strong>
                            </Link>{" "}
                        </li>


                        <li id="select">
                            <select
                                onChange={(e) => {
                                    changeLanguage(e.target.value);
                                }}
                                value={language}
                            >
                                <option value="en" > EN </option>
                                <option value="ro" > RO </option>
                            </select>
                        </li>


                        {(user || barber || admin) &&
                            <div>
                                <li>
                                    <Link to="/" onClick={logOut}> {t("header.logout")} </Link>
                                </li>

                                <li>
                                    <Link to="/chat"> Chat </Link>
                                </li>
                            </div>
                        }

                        {admin &&
                            <div>

                                <li>
                                    <Link to="/graphics"> {t("header.graphics")}</Link>
                                </li>

                                <li>
                                    <Link to="/admin">Admin</Link>
                                </li>

                            </div>
                        }

                        {user &&
                            <div>
                                <li>
                                    <Link to="/appointment"> {t("header.appointment")}</Link>
                                </li>
                            </div>
                        }

                        {(user || barber || admin) &&
                            <div>
                                <li>
                                    <Link to="/calendar"> {t("header.calendar")}</Link>
                                </li>

                                <li>

                                    <Link to="/profile"> {t("header.profile")}</Link>
                                </li>
                            </div>
                        }

                        {(!user && !barber && !admin) &&
                            <div>
                                <li>
                                    {" "}
                                    <Link to="/login"> {t("header.login")} </Link>
                                </li>
                                <li>
                                    {" "}
                                    <Link to="/register"> {t("header.register")} </Link>
                                </li>
                            </div>
                        }

                        <li>
                            {" "}
                            <Link to="/contact"> {t("header.firstLink")} </Link>
                        </li>
                        <li>
                            {" "}
                            <Link to="/services">
                                {" "}
                                {t("header.secondLink")}{" "}
                                <span className="sub-arrow">
                                    {" "}
                                    <i className="fa"> </i>
                                </span>{" "}
                            </Link>
                        </li>
                        <li>
                            {" "}
                            <Link to="/barbers"> {t("header.thirdLink")} </Link>
                        </li>
                        <li>
                            {" "}
                            <Link to="/about"> {t("header.fourthLink")} </Link>
                        </li>
                        <li>
                            {" "}
                            <Link to="/news"> {t("header.fifthLink")} </Link>
                        </li>
                        <li>
                            {" "}
                            <Link to="/"> {t("header.sixthLink")} </Link>
                        </li>
                    </ul>{" "}
                </div>

                <Switch>
                    <Route exact path="/">
                        {" "}
                        <Home value={t} language={language} />{" "}
                    </Route>
                    <Route exact path="/news">
                        {" "}
                        <News value={t} />{" "}
                    </Route>
                    <Route exact path="/about">
                        {" "}
                        <AboutUs value={t} />{" "}
                    </Route>
                    <Route exact path="/barbers">
                        {" "}
                        <Barbers value={t} language={language} />{" "}
                    </Route>
                    <Route exact path="/services">
                        {" "}
                        <Services value={t} language={language} />{" "}
                    </Route>
                    <Route exact path="/contact">
                        {" "}
                        <Contact value={t} />{" "}
                    </Route>
                    <Route exact path="/login">
                        {" "}
                        <Login value={t} setIsModified={setIsModified} />{" "}
                    </Route>
                    <Route exact path="/register">
                        {" "}
                        <Register value={t} language={language} />{" "}
                    </Route>

                    <Route exact path="/activate/:username">
                        {" "}
                        <ActivationPage value={t} />{" "}
                    </Route>

                    <Route exact path="/reset_password/:token">
                        {" "}
                        <ResetPassword value={t} />{" "}
                    </Route>

                    <Route exact path="/forget_password">
                        <ForgetPassword value={t} />
                    </Route>

                    <PrivateRoute component={Chat} value={t} role={["ROLE_USER", "ROLE_BARBER", "ROLE_ADMIN"]} path="/chat" exact />

                    <PrivateRoute component={Profile} value={t} role={["ROLE_USER", "ROLE_BARBER", "ROLE_ADMIN"]} path="/profile" exact />

                    <PrivateRoute component={Appointment} value={t} language={language} role={["ROLE_USER"]} path="/appointment" exact />

                    <PrivateRoute component={Calendar} value={t} language={language} role={["ROLE_USER", "ROLE_BARBER", "ROLE_ADMIN"]} path="/calendar" exact />

                    <PrivateRoute component={Graphic}  value={t} language={language} role={["ROLE_ADMIN"]} path="/graphics" exact />

                    <PrivateRoute component={AdminPage} value={t} language={language} role={["ROLE_ADMIN"]} path="/admin" exact />

                    <Route render={() => <Redirect to={{ pathname: "/" }} />} />


                </Switch>

            </header>
        </div >
    );
}

export default Header;
