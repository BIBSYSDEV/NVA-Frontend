import React, { FC, useEffect } from 'react';
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
import ButtonWithProgress from '../../components/ButtonWithProgress';

const StyledLoginComponent = styled.div`
  grid-area: auth;
  justify-self: right;
  align-items: center;
`;

const redirectedToFeideKey = 'redirectedToFeide';

const Login: FC = () => {
  const user = useSelector((state: RootStore) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation('authorization');

  // Use localStorage to track if user comes from a sign in or sign out process (FEIDE)
  const redirectedToFeide = !!localStorage.getItem(redirectedToFeideKey);

  useEffect(() => {
    // Clear possible redirect state in localStorage on mount
    if (redirectedToFeide) {
      localStorage.removeItem(redirectedToFeideKey);
    }
  }, [redirectedToFeide]);

  const handleLogin = () => {
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
    } else {
      localStorage.setItem(redirectedToFeideKey, 'true');
      Auth.federatedSignIn();
    }
  };

  const handleLogout = () => {
    if (USE_MOCK_DATA) {
      dispatch(logoutSuccess());
    } else {
      localStorage.setItem(redirectedToFeideKey, 'true');
      Auth.signOut();
    }
  };

  return (
    <StyledLoginComponent>
      {user ? (
        <Menu menuButtonLabel={user.name} handleLogout={handleLogout} />
      ) : redirectedToFeide ? (
        <ButtonWithProgress isLoading>{t('common:loading')}</ButtonWithProgress>
      ) : (
        <Button color="primary" variant="contained" onClick={handleLogin} data-testid="menu-login-button">
          {t('login')}
        </Button>
      )}
    </StyledLoginComponent>
  );
};

export default Login;
