import PersonIcon from '@mui/icons-material/PersonOutlineRounded';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { dataTestId } from '../../utils/dataTestIds';
import { getCurrentPath, useAuthentication } from '../../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { PreviousPathState } from '../LoginPage';
import { Menu } from './Menu';

export const LoginButton = () => {
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const { handleLogout } = useAuthentication();

  const handleLogoutWrapper = () => {
    handleLogout();
  };

  const previousPathState: PreviousPathState = { previousPath: getCurrentPath() };

  return user ? (
    <Menu handleLogout={handleLogoutWrapper} />
  ) : (
    <Button
      variant="outlined"
      endIcon={<PersonIcon />}
      color="inherit"
      sx={{ borderRadius: '1rem', flexDirection: 'row !important', height: 'fit-content', alignSelf: 'center' }}
      data-testid={dataTestId.header.logInButton}
      component={RouterLink}
      to={{ pathname: UrlPathTemplate.Login, state: previousPathState }}>
      {t('authorization.login')}
    </Button>
  );
};
