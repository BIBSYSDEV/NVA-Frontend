import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../../utils/urlPaths';

const SignedOutPage = () => {
  const { t } = useTranslation();
  const { handleLogin } = useAuthentication();
  const user = useSelector((store: RootState) => store.user);

  if (user) {
    return <Redirect to={UrlPathTemplate.Home} />;
  }

  return (
    <Box sx={{ m: '4rem 1rem 1rem 1rem' }}>
      <Typography variant="h1" gutterBottom>
        {t('authorization.signed_out')}
      </Typography>
      <Typography paragraph>{t('authorization.expired_token_info')}</Typography>

      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button
          component={Link}
          to={UrlPathTemplate.Home}
          variant="outlined"
          onClick={() => localStorage.removeItem(LocalStorageKey.RedirectPath)}>
          {t('authorization.back_to_home')}
        </Button>

        <Button variant="contained" data-testid={dataTestId.header.logInButton} onClick={handleLogin}>
          {t('authorization.login')}
        </Button>
      </Box>
    </Box>
  );
};

export default SignedOutPage;
