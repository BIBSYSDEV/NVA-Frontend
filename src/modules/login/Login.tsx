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
  const { t } = useTranslation();

  const handleLogin = (event: React.MouseEvent<any>) => {
    dispatch(login());
  };

  const handleLogout = (event: React.MouseEvent<any>) => {
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
