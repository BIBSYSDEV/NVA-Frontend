import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { RootStore } from '../../redux/reducers/rootReducer';
import { Menu } from './Menu';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { AMPLIFY_REDIRECTED_KEY } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';

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

  return user ? (
    <Menu handleLogout={handleLogoutWrapper} />
  ) : isLoading ? (
    <LoadingButton variant="contained" color="secondary" loading>
      {t('common:loading')}
    </LoadingButton>
  ) : (
    <Button variant="contained" color="secondary" onClick={handleLogin} data-testid={dataTestId.header.logInButton}>
      {t('login')}
    </Button>
  );
};
