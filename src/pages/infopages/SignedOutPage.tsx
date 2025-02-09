import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router';
import { RootState } from '../../redux/store';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../../utils/urlPaths';

const SignedOutPage = () => {
  const { t } = useTranslation();
  const { handleLogin } = useAuthentication();
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);

  if (user) {
    return <Navigate to={UrlPathTemplate.Root} replace />;
  }

  return (
    <Box sx={{ m: '4rem 1rem' }}>
      <Typography variant="h1" gutterBottom>
        {t('authorization.signed_out')}
      </Typography>
      <Typography sx={{ mb: '1rem' }}>{t('authorization.expired_token_info')}</Typography>

      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button
          data-testid={dataTestId.common.cancel}
          component={Link}
          to={UrlPathTemplate.Root}
          variant="outlined"
          onClick={() => localStorage.removeItem(LocalStorageKey.RedirectPath)}>
          {t('authorization.back_to_home')}
        </Button>

        <Button
          variant="contained"
          data-testid={dataTestId.header.logInButton}
          onClick={() => {
            const redirectPath = new URLSearchParams(location.search).get(LocalStorageKey.RedirectPath);
            if (redirectPath) {
              localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
            }
            handleLogin();
          }}>
          {t('authorization.login')}
        </Button>
      </Box>
    </Box>
  );
};

export default SignedOutPage;
