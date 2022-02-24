import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SyledPageContent } from '../components/styled/Wrappers';
import { LocalStorageKey } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../utils/urlPaths';

export interface PreviousPathState {
  previousPath?: string;
}

const LoginPage = () => {
  const { t } = useTranslation('authorization');
  const { handleLogin } = useAuthentication();
  const betaEnabled = localStorage.getItem(LocalStorageKey.Beta) === 'true';
  const location = useLocation<PreviousPathState>();
  const redirectPath = location.state?.previousPath ?? UrlPathTemplate.Home;

  // TODO: Fetch CustomerInstitutions (NP-4821)

  if (betaEnabled) {
    return (
      <SyledPageContent>
        <PageHeader>{t('login')}</PageHeader>

        <Typography variant="h2" paragraph>
          {t('login_with_feide')}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
            handleLogin('FeideIdentityProvider');
          }}>
          {t('login')}
        </Button>
      </SyledPageContent>
    );
  } else {
    localStorage.setItem(LocalStorageKey.RedirectPath, redirectPath);
    handleLogin('FeideIdentityProvider');
    return null;
  }
};

export default LoginPage;
