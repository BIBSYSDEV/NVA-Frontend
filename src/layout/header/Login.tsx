import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import { RootStore } from '../../redux/reducers/rootReducer';
import { Menu } from './Menu';
import { ButtonWithProgress } from '../../components/ButtonWithProgress';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { AMPLIFY_REDIRECTED_KEY } from '../../utils/constants';

const StyledLoginComponent = styled.div`
  grid-area: auth;
  justify-self: right;
`;

export const Login = () => {
  const user = useSelector((state: RootStore) => state.user);
  const { t } = useTranslation('authorization');
  const { handleLogin, handleLogout } = useAuthentication();

  // If amplify has set redirected value in localStorage we know that the user has either just logged in or out,
  // and we should wait for user object to be loaded in the case of login
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem(AMPLIFY_REDIRECTED_KEY));

  useEffect(() => {
    // Clear amplify's redirect value in localStorage to avoid infinite isLoading=true if user signs out
    localStorage.removeItem(AMPLIFY_REDIRECTED_KEY);
  }, []);

  const handleLogoutWrapper = () => {
    setIsLoading(true);
    handleLogout();
  };

  return (
    <StyledLoginComponent>
      {user ? (
        <Menu menuButtonLabel={user.name} handleLogout={handleLogoutWrapper} />
      ) : isLoading ? (
        <ButtonWithProgress isLoading>{t('common:loading')}</ButtonWithProgress>
      ) : (
        <Button color="primary" variant="contained" onClick={handleLogin} data-testid="menu-login-button">
          {t('login')}
        </Button>
      )}
    </StyledLoginComponent>
  );
};
