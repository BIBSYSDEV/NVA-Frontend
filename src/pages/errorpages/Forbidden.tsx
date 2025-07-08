import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { Box, Button, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginIcon from '@mui/icons-material/Login';

export const Forbidden = () => {
  const { t } = useTranslation();
  const { handleLogin } = useAuthentication();
  const navigate = useNavigate();

  return (
    <Box data-testid="forbidden" sx={{ mt: '4rem' }}>
      <span style={{ display: 'flex', gap: '0.2rem' }}>
        <LockOutlineIcon />
        <Typography variant="h2" component="h1" sx={{ mb: '1rem' }}>
          {t('authorization.forbidden')}
        </Typography>
      </span>
      <Trans
        i18nKey="authorization.forbidden_description"
        components={{
          p: <Typography />,
        }}
      />

      <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
        <Button
          sx={{ textTransform: 'none' }}
          data-testid={dataTestId.common.cancel}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(-1)}>
          {t('common.go_back')}
        </Button>

        <Button
          sx={{ textTransform: 'none' }}
          endIcon={<LoginIcon />}
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
