import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Auth } from 'aws-amplify';
import { Button } from '@material-ui/core';

import { RootStore } from '../../redux/reducers/rootReducer';
import Menu from './Menu';
import { USE_MOCK_DATA } from '../../utils/constants';
import { logoutSuccess } from '../../redux/actions/authActions';
import { setUser } from '../../redux/actions/userActions';
import { mockUser } from '../../utils/testfiles/mock_feide_user';

const StyledLoginComponent = styled.div`
  grid-area: auth;
  justify-self: right;
  align-items: center;
`;

const Login: FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation('authorization');

  const handleLogin = () => {
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
    } else {
      Auth.federatedSignIn();
    }
  };

  const handleLogout = () => {
    if (USE_MOCK_DATA) {
      dispatch(logoutSuccess());
    } else {
      Auth.signOut();
    }
  };

  return (
    <StyledLoginComponent>
      {user ? (
        <Menu menuButtonLabel={user.name} handleLogout={handleLogout} />
      ) : (
        <Button color="primary" variant="contained" onClick={handleLogin} data-testid="menu-login-button">
          {t('login')}
        </Button>
      )}
    </StyledLoginComponent>
  );
};

export default Login;
