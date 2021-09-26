export const validUsername = (username, wasUsernameModified, t) => {
    if(wasUsernameModified){
    var regex = new RegExp(/^[a-zA-Z]+([a-zA-Z0-9])*$/i);

    if(!regex.test(username)){
        return  <div className="alert alert-danger" role="alert">
        {t('login.errorUsername')}          
        </div>
    }
    if(username.length < 3 || username.length > 50){
        return  <div className="alert alert-danger" role="alert">
        {t('register.usernameErrorLength')}          
        </div>
    }

}
}


export const emptyFields = (username, setWasUsernameModified, name, setWasNameModified, email, setWasEmailModified, password, setWasPasswordModified, password_confirmation, setWasPassword_confirmationModified) => {
    if(username ==='') setWasUsernameModified(true);
    if(name === '') setWasNameModified(true);
    if(email ==='') setWasEmailModified(true);
    if(password === '') setWasPasswordModified(true);
    if(password_confirmation === '') setWasPassword_confirmationModified(true);
}

export const validName = (name, wasNameModified, t) => {
    if(wasNameModified){

    if(name===''){
        return  <div className="alert alert-danger" role="alert">
        {t("contact.errorName")}          
        </div>
    }
    if(name.length < 3 || name.length > 50){
        return  <div className="alert alert-danger" role="alert">
        {t('register.usernameErrorLength')}        
        </div>
    }
}
}

export const validEmail = (email, wasEmailModified, t) => {
    if(wasEmailModified){
    var regex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

    if(!regex.test(email)){
        return  <div className="alert alert-danger" role="alert">
        {t('contact.errorEmailValid')}          
        </div>
    }
    if(email.length > 50){
        return  <div className="alert alert-danger" role="alert">
        {t('contact.errorEmailLength')}          
        </div>
    }
}
}

export const validPassword = (password, wasPasswordModified, t) => {
    if(wasPasswordModified){

    
    if(password.length < 6 || password.length > 40){
        return  <div className="alert alert-danger" role="alert">
        {t("register.passwordErrorLength")}          
        </div>
    }
}
}

export const validPasswordConfirmation = (password_confirmation, wasPassword_confirmationModified, t) => {
    if(wasPassword_confirmationModified){

    
    if(password_confirmation.length < 6 || password_confirmation.length > 40){
        return  <div className="alert alert-danger" role="alert">
        {t("register.passwordErrorLength")}          
        </div>
    }
}
}

export const handleEnter = (event, username, wasUsernameModified, name, wasNameModified, email, wasEmailModified, password, wasPasswordModified, t) => {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      
      if((form.elements[index].name==="username" && validUsername(username, wasUsernameModified, t) === undefined)) 
      form.elements[index + 1].focus();
      if((form.elements[index].name==="name" && validName(name, wasNameModified, t) === undefined))
      form.elements[index + 1].focus();
      if((form.elements[index].name==="email" && validEmail(email, wasEmailModified, t) === undefined))
      form.elements[index + 1].focus();
      if((form.elements[index].name==="password" && validUsername(password, wasPasswordModified, t) === undefined))
      form.elements[index + 1].focus();
      event.preventDefault();
    
}
}
