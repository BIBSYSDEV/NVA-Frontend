import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

import { login, logout } from '../../api/userApi';
import { RootStore } from '../../redux/reducers/rootReducer';
import Menu from './Menu';

const StyledLoginComponent = styled.div`
  grid-area: auth;
  justify-self: right;
  align-items: center;
`;

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
    <StyledLoginComponent>
      {user && user.name ? (
        <Menu menuButtonLabel={user.name} handleLogout={handleLogout} />
      ) : (
        <Button color="primary" variant="contained" onClick={handleLogin} data-testid="login-button">
          {t('Login')}
        </Button>
      )}
    </StyledLoginComponent>
  );
};

export default Login;
