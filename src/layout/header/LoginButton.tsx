import PersonIcon from '@mui/icons-material/PersonOutlineRounded';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { getCurrentPath, useAuthentication } from '../../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { PreviousPathState } from '../LoginPage';
import { Menu } from './Menu';

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
      sx={{ borderRadius: '1rem', flexDirection: 'row !important', height: 'fit-content', alignSelf: 'center' }}
      data-testid={dataTestId.header.logInButton}
      component={RouterLink}
      to={{ pathname: UrlPathTemplate.Login, state: previousPathState }}>
      {t('authorization.login')}
    </LoadingButton>
  );
};
