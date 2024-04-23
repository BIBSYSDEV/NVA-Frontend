import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LocalStorageKey } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';

const SignedOutPage = () => {
  const { t } = useTranslation();

  // TODO: Handle is user is authenticated

  const previousPath = localStorage.getItem(LocalStorageKey.RedirectPath);
  if (previousPath) {
    localStorage.removeItem(LocalStorageKey.RedirectPath);
  }

  const pathAfterLogin = previousPath ?? UrlPathTemplate.Home;

  return (
    <Box sx={{ m: '4rem 1rem 1rem 1rem' }}>
      <Typography variant="h1" gutterBottom>
        Du er utlogget
      </Typography>
      <Typography paragraph>
        Din sesjon har utløpt, og du har blitt logget ut. Fortsett som anonym bruker, eller logg inn på nytt.
      </Typography>

      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button component={Link} to={UrlPathTemplate.Home} variant="outlined">
          {t('authorization.back_to_home')}
        </Button>

        <Button
          variant="contained"
          data-testid={dataTestId.header.logInButton}
          component={Link}
          to={{ pathname: UrlPathTemplate.Login, state: pathAfterLogin }}>
          {t('authorization.login')}
        </Button>
      </Box>
    </Box>
  );
};

export default SignedOutPage;
