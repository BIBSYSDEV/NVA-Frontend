import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SyledPageContent } from '../components/styled/Wrappers';
import { RootStore } from '../redux/reducers/rootReducer';
import { LocalStorageKey } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { UrlPathTemplate } from '../utils/urlPaths';

export interface PreviousPathState {
  previousPath?: string;
}

const LoginPage = () => {
  const { t } = useTranslation('authorization');
  const user = useSelector((store: RootStore) => store.user);
  const location = useLocation<PreviousPathState>();
  const { handleLogin } = useAuthentication();

  if (user) {
    return <Redirect to={UrlPathTemplate.Home} />;
  }

  const betaEnabled = localStorage.getItem(LocalStorageKey.Beta) === 'true';
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
