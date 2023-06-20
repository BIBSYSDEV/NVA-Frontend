import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import PersonIcon from '@mui/icons-material/PersonOutlineRounded';
import { Link as RouterLink } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { Menu } from './Menu';
import { getCurrentPath, useAuthentication } from '../../utils/hooks/useAuthentication';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { PreviousPathState } from '../LoginPage';

export const LoginButton = () => {
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const { handleLogout } = useAuthentication();

  // If amplify has set redirected value in localStorage we know that the user has either just logged in or out,
  // and we should wait for user object to be loaded in the case of login
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem(LocalStorageKey.AmplifyRedirect));

  useEffect(() => {
    // Clear amplify's redirect value in localStorage to avoid infinite isLoading=true if user signs out
    localStorage.removeItem(LocalStorageKey.AmplifyRedirect);
  }, []);

  const handleLogoutWrapper = () => {
    setIsLoading(true);
    handleLogout();
  };

  const previousPathState: PreviousPathState = { previousPath: getCurrentPath() };

  return user ? (
    <Menu handleLogout={handleLogoutWrapper} />
  ) : (
    <LoadingButton
      variant="outlined"
      loading={isLoading}
      endIcon={<PersonIcon />}
      color="inherit"
      sx={{ borderRadius: '1rem' }}
      data-testid={dataTestId.header.logInButton}
      component={RouterLink}
      to={{ pathname: UrlPathTemplate.Login, state: previousPathState }}>
      {t('authorization.login')}
    </LoadingButton>
  );
};
