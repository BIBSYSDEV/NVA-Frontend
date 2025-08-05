import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, SxProps, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { RootState } from '../../redux/store';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../../utils/urlPaths';

const buttonProps: SxProps = { textTransform: 'none', mt: '1rem', width: 'fit-content' };

export const Forbidden = () => {
  const { t } = useTranslation();
  const { handleLogin } = useAuthentication();
  const user = useSelector((store: RootState) => store.user);

  return (
    <Box data-testid="forbidden" sx={{ my: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <span style={{ display: 'flex', gap: '0.5rem' }}>
          <LockOutlineIcon />
          <Typography gutterBottom variant="h1">
            {t('authorization.forbidden')}
          </Typography>
        </span>

        {!user ? (
          <>
            <Trans
              i18nKey="authorization.forbidden_description"
              components={{
                p: <Typography />,
              }}
            />
            <Button
              data-testid={`${dataTestId.header.logInButton}-forbidden`}
              sx={buttonProps}
              endIcon={<LoginIcon />}
              variant="contained"
              onClick={() => {
                const redirectPath = new URLSearchParams(location.search).get(LocalStorageKey.RedirectPath);
                if (redirectPath) {
                  localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
                }
                handleLogin();
              }}>
              {t('authorization.login')}
            </Button>
          </>
        ) : (
          <>
            <Typography>{t('authorization.forbidden_description_logged_in')}</Typography>
            <Button
              data-testid={dataTestId.authorization.institutionAdminsLink}
              sx={buttonProps}
              endIcon={<ArrowForwardIcon />}
              variant="contained"
              component={Link}
              to={UrlPathTemplate.InstitutionOverviewPage}>
              {t('overview_over_administrators')}
            </Button>
          </>
        )}
      </div>
    </Box>
  );
};
