import PersonIcon from '@mui/icons-material/PersonOutlineRounded';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router';
import { RootState } from '../../redux/store';
import { PreviousPathLocationState } from '../../types/locationState.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getCurrentPath } from '../../utils/general-helpers';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { Menu } from './Menu';

export const LoginButton = () => {
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const { handleLogout } = useAuthentication();

  return user ? (
    <Menu handleLogout={handleLogout} />
  ) : (
    <Button
      variant="outlined"
      endIcon={<PersonIcon />}
      color="inherit"
      sx={{ borderRadius: '1rem', flexDirection: 'row !important', height: 'fit-content', alignSelf: 'center' }}
      data-testid={dataTestId.header.logInButton}
      component={RouterLink}
      state={{ previousPath: getCurrentPath() } satisfies PreviousPathLocationState}
      to={{
        pathname: UrlPathTemplate.Login,
      }}>
      {t('authorization.login')}
    </Button>
  );
};
