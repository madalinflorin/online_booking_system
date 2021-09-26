import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = ({component: Component,role, language, value, ...rest}) => {

    function verify(role){
        const currentUser = AuthService.getCurrentUser();
        let isOk = false;
        currentUser.roles.map(role1 => {

            role.map(role2 => {

                if(role1 === role2){
                    isOk = true;
                }
                return role2;
            })
            return role1;
        })

        return isOk;
    }

    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={() => (
            verify(role) ?
                <Component value = {value} language = {language}/>
                : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;