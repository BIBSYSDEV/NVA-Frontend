import '../../styles/login.scss';

import Amplify from 'aws-amplify';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Typography } from '@material-ui/core';

import { login, logout } from '../../actions/userActions';
import awsConfig from '../../aws-config';
import { RootStore } from '../../reducers/rootReducer';

Amplify.configure(awsConfig);
interface LoginProps {
  buttonText: string;
}

const Login: React.FC<LoginProps> = ({ buttonText }) => {
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();

  console.log('awsconfig', awsConfig);
  const { t } = useTranslation();

  // useEffect(() => {
  //   Auth.currentAuthenticatedUser()
  //     .then(user => {
  //       console.log('user', user);
  //       const user2 = user
  //         .getSignInUserSession()
  //         .getIdToken()
  //         .decodePayload();
  //       console.log('user:', user2);
  //     })
  //     .catch(err => console.log('Not signed in: ' + err));
  // }, []);

  const handleLogin = (event: React.MouseEvent<any>) => {
    // Auth.federatedSignIn();
    dispatch(login());
  };

  const handleLogout = (event: React.MouseEvent<any>) => {
    // Auth.federatedSignIn();
    dispatch(logout());
  };

  return (
    <div className="login">
      {user && user.name ? (
        <div className="login__username">
          <Typography variant="h6">
            {t('Hello')} {user.name}
          </Typography>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <div className="login__button">
          <Button onClick={handleLogin}>{buttonText}</Button>
        </div>
      )}
    </div>
  );
};

export default Login;
