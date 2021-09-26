import { withRouter } from "react-router-dom";
import AuthService from '../services/AuthService';

const AuthVerifyComponent = ({setIsModified, history }) => {
  history.listen(() => {// <--- Here you subscribe to the route change
    
    if(localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.jwtExpirationMs - 300000 < Date.now()) {
        AuthService.logout();
        history.push('/');
        setIsModified(prevState => !prevState);
      } 
    }
  });
  return <div></div>;
};

export default withRouter(AuthVerifyComponent);