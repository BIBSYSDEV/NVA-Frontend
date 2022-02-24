import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { SyledPageContent } from '../components/styled/Wrappers';
import { LocalStorageKey } from '../utils/constants';
import { useAuthentication } from '../utils/hooks/useAuthentication';

const LoginPage = () => {
  const { t } = useTranslation('authorization');
  const { handleLogin } = useAuthentication();
  const betaEnabled = localStorage.getItem(LocalStorageKey.Beta) === 'true';

  // TODO: Fetch CustomerInstitutions (NP-4821)

  if (betaEnabled) {
    return (
      <SyledPageContent>
        <PageHeader>{t('login')}</PageHeader>

        <Typography variant="h2" paragraph>
          {t('login_with_feide')}
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => handleLogin('FeideIdentityProvider')}>
          {t('login')}
        </Button>
      </SyledPageContent>
    );
  } else {
    handleLogin('FeideIdentityProvider');
    return null;
  }
};

export default LoginPage;
