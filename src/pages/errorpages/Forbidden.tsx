import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { RootState } from '../../redux/store';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../../utils/urlPaths';

export const Forbidden = () => {
  const { t } = useTranslation();
  const { handleLogin } = useAuthentication();
  const navigate = useNavigate();
  const user = useSelector((store: RootState) => store.user);

  return (
    <Box data-testid="forbidden" sx={{ mt: '4rem' }}>
      <span style={{ display: 'flex', gap: '0.2rem' }}>
        <LockOutlineIcon />
        <Typography variant="h2" component="h1" sx={{ mb: '1rem' }}>
          {t('authorization.forbidden')}
        </Typography>
      </span>
      {!user ? (
        <Trans
          i18nKey="authorization.forbidden_description"
          components={{
            p: <Typography />,
          }}
        />
      ) : (
        <Typography>{t('authorization.forbidden_description_logged_in')}</Typography>
      )}

      <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
        <Button
          sx={{ textTransform: 'none' }}
          data-testid={dataTestId.common.cancel}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(-1)}>
          {t('common.go_back')}
        </Button>

        {!user ? (
          <Button
            sx={{ textTransform: 'none' }}
            endIcon={<LoginIcon />}
            variant="contained"
            data-testid={`${dataTestId.header.logInButton}-forbidden`}
            onClick={() => {
              const redirectPath = new URLSearchParams(location.search).get(LocalStorageKey.RedirectPath);
              if (redirectPath) {
                localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
              }
              handleLogin();
            }}>
            {t('authorization.login')}
          </Button>
        ) : (
          <Button
            data-testid={dataTestId.authorization.institutionAdminsLink}
            component={Link}
            to={UrlPathTemplate.InstitutionOverviewPage}
            sx={{ textTransform: 'none' }}
            variant="contained">
            {t('overview_over_administrators')}
          </Button>
        )}
      </Box>
    </Box>
  );
};
