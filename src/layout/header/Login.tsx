import '../../styles/layout/login.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@material-ui/core';

import { login, logout } from '../../api/user';
import { RootStore } from '../../redux/reducers/rootReducer';
import Menu from './Menu';

const Login: React.FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogin = () => {
    dispatch(login());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="auth">
      {user && user.name ? (
        <Menu menuButtonLabel={user.name} handleLogout={handleLogout} />
      ) : (
        <Button color="primary" variant="contained" onClick={handleLogin} data-testid="login-button">
          {t('Login')}
        </Button>
      )}
    </div>
  );
};

export default Login;
